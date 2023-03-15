/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at https://mozilla.org/MPL/2.0/.
 */
package io.mosip.esignet.mock.integration.service;

import java.io.StringWriter;
import java.math.BigInteger;
import java.security.PrivateKey;
import java.sql.Timestamp;
import java.time.LocalDateTime;
import java.time.temporal.ChronoUnit;
import java.util.*;

import javax.security.auth.x500.X500Principal;

import com.fasterxml.jackson.databind.ObjectMapper;
import io.mosip.esignet.mock.integration.dto.IdentityData;
import io.mosip.kernel.core.http.ResponseWrapper;
import org.bouncycastle.openssl.jcajce.JcaPEMWriter;
import org.bouncycastle.x509.X509V3CertificateGenerator;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.autoconfigure.condition.ConditionalOnProperty;
import org.springframework.http.RequestEntity;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Component;

import com.nimbusds.jose.jwk.RSAKey;

import io.mosip.esignet.api.dto.AuthChallenge;
import io.mosip.esignet.api.dto.KeyBindingResult;
import io.mosip.esignet.api.dto.SendOtpResult;
import io.mosip.esignet.api.exception.KeyBindingException;
import io.mosip.esignet.api.exception.SendOtpException;
import io.mosip.esignet.api.spi.KeyBinder;
import io.mosip.kernel.core.util.DateUtils;
import io.mosip.kernel.keymanagerservice.dto.KeyPairGenerateRequestDto;
import io.mosip.kernel.keymanagerservice.dto.SignatureCertificate;
import io.mosip.kernel.keymanagerservice.service.KeymanagerService;
import lombok.extern.slf4j.Slf4j;
import net.minidev.json.JSONObject;
import org.springframework.web.client.RestTemplate;
import org.springframework.web.util.UriComponentsBuilder;

@ConditionalOnProperty(value = "mosip.esignet.integration.key-binder", havingValue = "MockKeyBindingWrapperService")
@Component
@Slf4j
public class MockKeyBindingWrapperService implements KeyBinder {

    public static final String BINDING_SERVICE_APP_ID = "MOCK_BINDING_SERVICE";
    private static final String OTP_VALUE = "111111";
    @Value("${mosip.esignet.mock.authenticator.get-identity-url}")
    private String getIdentityUrl;

    @Value("#{${mosip.esignet.mock.supported.bind-auth-factor-types}}")
    private List<String> supportedBindAuthFactorTypes;
    @Autowired
    private KeymanagerService keymanagerService;

    @Value("${mosip.esignet.binding.key-expire-days}")
    private int expireInDays;

    @Autowired
    private RestTemplate restTemplate;

    @Autowired
    private ObjectMapper objectMapper;

    @Autowired
    private MockHelperService mockHelperService;

    private static final Map<String, List<String>> supportedFormats = new HashMap<>();

    static {
        supportedFormats.put("WLA", List.of("jwt"));
    }


    @Override
    public SendOtpResult sendBindingOtp(String individualId, List<String> otpChannels,
                                        Map<String, String> requestHeaders) throws SendOtpException {
        try {
            return mockHelperService.sendOtpMock(individualId, otpChannels, null);
        } catch (Exception e) {
            throw new SendOtpException(e.getMessage());
        }
    }

    @Override
    public KeyBindingResult doKeyBinding(String individualId, List<AuthChallenge> challengeList,
                                         Map<String, Object> publicKeyJWK, String bindAuthFactorType, Map<String, String> requestHeaders) throws KeyBindingException {
        KeyBindingResult keyBindingResult = new KeyBindingResult();

        if (!supportedBindAuthFactorTypes.contains(bindAuthFactorType)) {
            throw new KeyBindingException("invalid_bind_auth_factor_type");
        }

        IdentityData identityData = null;
        try {
            var requestEntity = RequestEntity
                    .get(UriComponentsBuilder.fromUriString(getIdentityUrl + "/" + individualId).build().toUri()).build();
            var responseEntity = restTemplate.exchange(requestEntity,
                    ResponseWrapper.class);
            if (responseEntity.getStatusCode().is2xxSuccessful() && responseEntity.getBody() != null) {
                var responseWrapper = responseEntity.getBody();
                identityData = objectMapper.convertValue(responseWrapper.getResponse(), IdentityData.class);
            }
        } catch (Exception e) {
            log.error("failed to fetch individual data", e);
            throw new KeyBindingException("auth_failed", e.getMessage());
        }

        var isAuthenticated = authenticate(identityData, challengeList);
        if (!isAuthenticated) {
            throw new KeyBindingException("auth_failed");
        }

        //TODO
        //create a signed certificate, with cn as username
        //certificate validity based on configuration
        try {
            RSAKey rsaKey = RSAKey.parse(new JSONObject(publicKeyJWK));
            X509V3CertificateGenerator generator = new X509V3CertificateGenerator();
            generator.setSubjectDN(new X500Principal("CN=" + identityData.getFullName().get(0).getValue()));
            generator.setIssuerDN(new X500Principal("CN=Mock-IDA"));
            LocalDateTime notBeforeDate = DateUtils.getUTCCurrentDateTime();
            LocalDateTime notAfterDate = notBeforeDate.plus(expireInDays, ChronoUnit.DAYS);
            generator.setNotBefore(Timestamp.valueOf(notBeforeDate));
            generator.setNotAfter(Timestamp.valueOf(notAfterDate));
            generator.setPublicKey(rsaKey.toPublicKey());
            generator.setSignatureAlgorithm("SHA256WITHRSA");
            generator.setSerialNumber(new BigInteger(String.valueOf(System.currentTimeMillis())));

            setupMockBindingKey();
            SignatureCertificate signatureCertificate = keymanagerService.getSignatureCertificate(BINDING_SERVICE_APP_ID, Optional.empty(),
                    DateUtils.getUTCCurrentDateTimeString());
            PrivateKey privateKey = signatureCertificate.getCertificateEntry().getPrivateKey();
            StringWriter stringWriter = new StringWriter();
            try (JcaPEMWriter pemWriter = new JcaPEMWriter(stringWriter)) {
                pemWriter.writeObject(generator.generate(privateKey));
                pemWriter.flush();
                keyBindingResult.setCertificate(stringWriter.toString());
            }
        } catch (Exception e) {
            throw new RuntimeException(e);
        }
        keyBindingResult.setPartnerSpecificUserToken(individualId);
        return keyBindingResult;
    }

    public boolean authenticate(IdentityData identityData, List<AuthChallenge> challengeList) throws KeyBindingException {
        boolean authStatus = false;
        if (identityData == null) {
            throw new KeyBindingException("invalid_individual_id");
        }
        for (AuthChallenge authChallenge : challengeList) {
            if (Objects.equals(authChallenge.getAuthFactorType(), "PIN")) {
                authStatus = authChallenge.getAuthFactorType().equals(identityData.getPin());
                if (!authStatus)
                    throw new KeyBindingException("invalid_input");
            } else if (Objects.equals(authChallenge.getAuthFactorType(), "OTP")) {
                authStatus = authChallenge.getChallenge().equals(OTP_VALUE);
                if (!authStatus)
                    throw new KeyBindingException("invalid_input");
            } else if (Objects.equals(authChallenge.getAuthFactorType(), "BIO")) {
                authStatus = true; //TODO
            } else {
                authStatus = false;
            }
        }

        return authStatus;
    }

    private void setupMockBindingKey() {
        KeyPairGenerateRequestDto mockBindingKeyRequest = new KeyPairGenerateRequestDto();
        mockBindingKeyRequest.setApplicationId(BINDING_SERVICE_APP_ID);
        keymanagerService.generateMasterKey("CSR", mockBindingKeyRequest);
        log.info("===================== MOCK_BINDING_SERVICE KEY SETUP COMPLETED ========================");
    }

    @Override
    public List<String> getSupportedChallengeFormats(String authFactorType) {
        return supportedFormats.getOrDefault(authFactorType, List.of());
    }
}
