package io.mosip.esignet.mock.identitysystem.service.impl;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.nimbusds.jose.jwk.RSAKey;
import io.mosip.esignet.mock.identitysystem.dto.*;
import io.mosip.esignet.mock.identitysystem.entity.KycAuth;
import io.mosip.esignet.mock.identitysystem.exception.MockIdentityException;
import io.mosip.esignet.mock.identitysystem.repository.AuthRepository;
import io.mosip.esignet.mock.identitysystem.service.AuthenticationService;
import io.mosip.esignet.mock.identitysystem.service.IdentityService;
import io.mosip.esignet.mock.identitysystem.util.HelperUtil;
import io.mosip.kernel.signature.dto.JWTSignatureRequestDto;
import io.mosip.kernel.signature.dto.JWTSignatureResponseDto;
import io.mosip.kernel.signature.service.SignatureService;
import lombok.extern.slf4j.Slf4j;
import org.jose4j.jwe.ContentEncryptionAlgorithmIdentifiers;
import org.jose4j.jwe.JsonWebEncryption;
import org.jose4j.jwe.KeyManagementAlgorithmIdentifiers;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.util.CollectionUtils;

import java.time.LocalDateTime;
import java.time.ZoneOffset;
import java.time.temporal.ChronoUnit;
import java.util.*;
import java.util.stream.Collectors;

import static io.mosip.esignet.mock.identitysystem.util.HelperUtil.ALGO_SHA3_256;


@Service
@Slf4j
public class AuthenticationServiceImpl implements AuthenticationService {

    private static final String APPLICATION_ID = "MOCK_AUTH_WRAPPER";
    private static final String PSUT_FORMAT = "%s%s";
    private static final String OTP_VALUE = "111111";

    @Autowired
    private AuthRepository authRepository;

    @Autowired
    private IdentityService identityService;

    @Autowired
    private ObjectMapper objectMapper;

    @Autowired
    private SignatureService signatureService;

    @Value("${mosip.mock.ida.kyc.transaction-timeout-secs:60}")
    private int transactionTimeoutInSecs;

    @Value("${mosip.mock.ida.kyc.encrypt:false}")
    private boolean encryptKyc;

    @Value("${mosip.mock.ida.kyc.default-language:eng}")
    private String defaultLanguage;


    @Override
    public KycAuthResponseDto kycAuth(String relyingPartyId, String clientId, KycAuthRequestDto kycAuthRequestDto) throws MockIdentityException {
        //TODO validate relying party Id and client Id
        IdentityData identityData = identityService.getIdentity(kycAuthRequestDto.getIndividualId());
        if(identityData == null) {
            throw new MockIdentityException("mock-ida-001");
        }
        boolean authStatus = false;
        if(kycAuthRequestDto.getOtp() != null) {
            authStatus = kycAuthRequestDto.getOtp().equals(OTP_VALUE);
            if(!authStatus)
                throw new MockIdentityException("mock-ida-002");
        }
        if(kycAuthRequestDto.getPin() != null) {
            authStatus = kycAuthRequestDto.getPin().equals(identityData.getPin());
            if(!authStatus)
                throw new MockIdentityException("mock-ida-003");
        }
        if(kycAuthRequestDto.getBiometrics() != null) {
            authStatus = true; //TODO
        }

        KycAuth kycAuth = saveKycAuthTransaction(kycAuthRequestDto.getTransactionId(), relyingPartyId,
                kycAuthRequestDto.getIndividualId());

        KycAuthResponseDto kycAuthResponseDto = new KycAuthResponseDto();
        kycAuthResponseDto.setAuthStatus(authStatus);
        kycAuthResponseDto.setKycToken(kycAuth.getKycToken());
        kycAuthResponseDto.setPartnerSpecificUserToken(kycAuth.getPartnerSpecificUserToken());
        return kycAuthResponseDto;
    }

    @Override
    public KycExchangeResponseDto kycExchange(String relyingPartyId, String clientId, KycExchangeRequestDto kycExchangeRequestDto) throws MockIdentityException {
        //TODO validate relying party Id and client Id
        Optional<KycAuth> result = authRepository.findByKycTokenAndValidityAndTransactionIdAndIndividualId
                (kycExchangeRequestDto.getKycToken(), Valid.ACTIVE, kycExchangeRequestDto.getTransactionId(),
                        kycExchangeRequestDto.getIndividualId());

        if(!result.isPresent())
            throw new MockIdentityException("mock-ida-006");

        LocalDateTime savedTime = result.get().getResponseTime();
        long seconds = savedTime.until(kycExchangeRequestDto.getRequestDateTime(), ChronoUnit.SECONDS);
        if(seconds < 0 || seconds > transactionTimeoutInSecs) {
            result.get().setValidity(Valid.EXPIRED);
            authRepository.save(result.get());
            throw new MockIdentityException("mock-ida-007");
        }

        try {
            Map<String, Object> kyc = buildKycDataBasedOnPolicy(kycExchangeRequestDto.getIndividualId(),
                    kycExchangeRequestDto.getAcceptedClaims(), kycExchangeRequestDto.getClaimLocales());
            kyc.put("sub", result.get().getPartnerSpecificUserToken());

            result.get().setValidity(Valid.PROCESSED);
            authRepository.save(result.get());

            String finalKyc = this.encryptKyc ? getJWE(relyingPartyId, signKyc(kyc)) : signKyc(kyc);
            KycExchangeResponseDto kycExchangeResponseDto = new KycExchangeResponseDto();
            kycExchangeResponseDto.setKyc(finalKyc);
            return kycExchangeResponseDto;
        } catch (Exception ex) {
            log.error("Failed to build kyc data", ex);
            throw new MockIdentityException("mock-ida-008");
        }
    }

    private String signKyc(Map<String,Object> kyc) throws JsonProcessingException {
        String payload = objectMapper.writeValueAsString(kyc);
        JWTSignatureRequestDto jwtSignatureRequestDto = new JWTSignatureRequestDto();
        jwtSignatureRequestDto.setApplicationId(APPLICATION_ID);
        jwtSignatureRequestDto.setReferenceId("");
        jwtSignatureRequestDto.setIncludePayload(true);
        jwtSignatureRequestDto.setIncludeCertificate(false);
        jwtSignatureRequestDto.setDataToSign(HelperUtil.b64Encode(payload));
        jwtSignatureRequestDto.setIncludeCertHash(false);
        JWTSignatureResponseDto responseDto = signatureService.jwtSign(jwtSignatureRequestDto);
        return responseDto.getJwtSignedData();
    }

    private String getJWE(String relyingPartyId, String signedJwt) throws Exception {
        JsonWebEncryption jsonWebEncryption = new JsonWebEncryption();
        jsonWebEncryption.setAlgorithmHeaderValue(KeyManagementAlgorithmIdentifiers.RSA_OAEP_256);
        jsonWebEncryption.setEncryptionMethodHeaderParameter(ContentEncryptionAlgorithmIdentifiers.AES_256_GCM);
        jsonWebEncryption.setPayload(signedJwt);
        jsonWebEncryption.setContentTypeHeaderValue("JWT");
        RSAKey rsaKey = getRelyingPartyPublicKey(relyingPartyId);
        jsonWebEncryption.setKey(rsaKey.toPublicKey());
        jsonWebEncryption.setKeyIdHeaderValue(rsaKey.getKeyID());
        return jsonWebEncryption.getCompactSerialization();
    }

    private RSAKey getRelyingPartyPublicKey(String relyingPartyId) {
        //TODO where to strore relying-party public key
        throw new MockIdentityException("jwe-not-implemented");
    }

    private KycAuth saveKycAuthTransaction(String transactionId, String relyingPartyId, String individualId) {
        String kycToken = HelperUtil.generateB64EncodedHash(ALGO_SHA3_256, UUID.randomUUID().toString());
        String psut;
        try {
            psut = HelperUtil.generateB64EncodedHash(ALGO_SHA3_256,
                    String.format(PSUT_FORMAT, individualId, relyingPartyId));
        } catch (Exception e) {
            log.error("Failed to generate PSUT", e);
            throw new MockIdentityException("mock-ida-004");
        }

        KycAuth kycAuth = new KycAuth(kycToken, psut, LocalDateTime.now(ZoneOffset.UTC), Valid.ACTIVE, transactionId,
                individualId);
        if(kycAuth == null)
            throw new MockIdentityException("mock-ida-005");
        return authRepository.save(kycAuth);
    }

    private Map<String, Object> buildKycDataBasedOnPolicy(String individualId, List<String> claims, List<String> locales) {
        Map<String, Object> kyc = new HashMap<>();
        IdentityData identityData = identityService.getIdentity(individualId);
        if(identityData == null) {
            throw new MockIdentityException("mock-ida-001");
        }

        if(CollectionUtils.isEmpty(locales)) {
            locales = Arrays.asList(defaultLanguage);
        }
        boolean singleLanguage = locales.size() == 1;
        for(String claim : claims) {
            switch (claim) {
                case "name" :
                    kyc.putAll(getKycValues(locales, "name", identityData.getFullName(), singleLanguage));
                    break;
                case "birthdate" :
                    if(identityData.getDateOfBirth() != null) { kyc.put("birthdate", identityData.getDateOfBirth()); }
                    break;
                case "gender" :
                    kyc.putAll(getKycValues(locales, "gender", identityData.getGender(), singleLanguage));
                    break;
                case "email" :
                    if(identityData.getEmail() != null) { kyc.put("email", identityData.getEmail()); }
                    break;
                case "phone_number" :
                    if(identityData.getPhone() != null) { kyc.put("phone_number", identityData.getPhone()); }
                    break;
                case "address" :
                    //TODO
                    break;
                case "picture" :
                    if(identityData.getEncodedPhoto() != null) { kyc.put("picture", identityData.getEncodedPhoto()); }
                    break;
                case "individual_id" :
                    if(identityData.getIndividualId() != null) { kyc.put("individual_id", identityData.getIndividualId()); }
                    break;
            }
        }
        return kyc;
    }

    private Map<String, Object> getKycValues(List<String> locales, String claimName, List<LanguageValue> values, boolean isSingleLanguage) {
        for(String locale : locales) {
            return values.stream()
                    .filter( v -> v.getLanguage().equalsIgnoreCase(locale) || v.getLanguage().startsWith(locale))
                    .collect(Collectors.toMap(v -> isSingleLanguage ? claimName : claimName+"#"+locale, v -> v.getValue()));
        }
        return Collections.emptyMap();
    }
}
