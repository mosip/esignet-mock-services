/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at https://mozilla.org/MPL/2.0/.
 */
package io.mosip.esignet.mock.integration.service;

import com.fasterxml.jackson.databind.ObjectMapper;
import io.mosip.esignet.api.dto.*;
import io.mosip.esignet.api.exception.KycAuthException;
import io.mosip.esignet.api.exception.KycExchangeException;
import io.mosip.esignet.api.exception.SendOtpException;
import io.mosip.esignet.api.spi.Authenticator;
import io.mosip.esignet.api.util.ErrorConstants;
import io.mosip.esignet.mock.integration.dto.*;
import io.mosip.kernel.core.http.ResponseWrapper;
import io.mosip.kernel.keymanagerservice.dto.AllCertificatesDataResponseDto;
import io.mosip.kernel.keymanagerservice.dto.CertificateDataResponseDto;
import io.mosip.kernel.keymanagerservice.service.KeymanagerService;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.autoconfigure.condition.ConditionalOnProperty;
import org.springframework.core.ParameterizedTypeReference;
import org.springframework.http.MediaType;
import org.springframework.http.RequestEntity;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Component;
import org.springframework.util.CollectionUtils;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.client.RestTemplate;
import org.springframework.web.util.UriComponentsBuilder;

import javax.annotation.PostConstruct;
import javax.validation.Valid;
import javax.validation.constraints.NotBlank;
import javax.validation.constraints.NotNull;
import java.util.*;


@ConditionalOnProperty(value = "mosip.esignet.integration.authenticator", havingValue = "MockAuthenticationService")
@Component
@Slf4j
public class MockAuthenticationService implements Authenticator {

    private static final String APPLICATION_ID = "MOCK_AUTHENTICATION_SERVICE";
    public static final String SEND_OTP_FAILED = "send_otp_failed";

    @Value("${mosip.esignet.mock.authenticator.ida.get-identity-url}")
    private String getIdentityUrl;

    @Value("${mosip.esignet.mock.authenticator.ida.kyc-auth-url}")
    private String kycAuthUrl;

    @Value("${mosip.esignet.mock.authenticator.ida.kyc-exchange-url}")
    private String kycExchangeUrl;

    @Autowired
    private ObjectMapper objectMapper;

    @Autowired
    private KeymanagerService keymanagerService;

    @Autowired
    private MockHelperService mockHelperService;

    @Autowired
    private RestTemplate restTemplate;

    @PostConstruct
    public void initialize() {
        log.info("Started to setup MOCK IDA");
    }

    @Validated
    @Override
    public KycAuthResult doKycAuth(@NotBlank String relyingPartyId, @NotBlank String clientId,
                                   @NotNull @Valid KycAuthDto kycAuthDto) throws KycAuthException {

        log.info("Started to build kyc-auth request with transactionId : {} && clientId : {}",
                kycAuthDto.getTransactionId(), clientId);
        try {
            KycAuthRequestDto kycAuthRequestDto = new KycAuthRequestDto();
            kycAuthRequestDto.setTransactionId(kycAuthDto.getTransactionId());
            kycAuthRequestDto.setIndividualId(kycAuthDto.getIndividualId());

            for (AuthChallenge authChallenge : kycAuthDto.getChallengeList()) {
                if (Objects.equals(authChallenge.getAuthFactorType(), "PIN")) {
                    kycAuthRequestDto.setPin(authChallenge.getChallenge());
                } else if (Objects.equals(authChallenge.getAuthFactorType(), "OTP")) {
                    kycAuthRequestDto.setOtp(authChallenge.getChallenge());
                } else if (Objects.equals(authChallenge.getAuthFactorType(), "BIO")) {
                    kycAuthRequestDto.setBiometrics(authChallenge.getChallenge());
                }
            }

            //set signature header, body and invoke kyc auth endpoint
            String requestBody = objectMapper.writeValueAsString(kycAuthRequestDto);
            RequestEntity requestEntity = RequestEntity
                    .post(UriComponentsBuilder.fromUriString(kycAuthUrl).pathSegment(relyingPartyId, clientId).build().toUri())
                    .contentType(MediaType.APPLICATION_JSON_UTF8)
                    .body(requestBody);
            ResponseEntity<ResponseWrapper<KycAuthResponseDto>> responseEntity = restTemplate.exchange(requestEntity,
                    new ParameterizedTypeReference<>() {
                    });

            if (responseEntity.getStatusCode().is2xxSuccessful() && responseEntity.getBody() != null) {
                ResponseWrapper<KycAuthResponseDto> responseWrapper = responseEntity.getBody();
                if (responseWrapper.getResponse() != null && responseWrapper.getResponse().isAuthStatus() && responseWrapper.getResponse().getKycToken() != null) {
                    return new KycAuthResult(responseEntity.getBody().getResponse().getKycToken(),
                            responseEntity.getBody().getResponse().getKycToken());
                }
                log.error("Error response received from IDA KycStatus : {} && Errors: {}",
                        responseWrapper.getResponse().isAuthStatus(), responseWrapper.getErrors());
                throw new KycAuthException(CollectionUtils.isEmpty(responseWrapper.getErrors()) ?
                        ErrorConstants.AUTH_FAILED : responseWrapper.getErrors().get(0).getErrorCode());
            }
            log.error("Error response received from IDA (Kyc-auth) with status : {}", responseEntity.getStatusCode());
        } catch (KycAuthException e) {
            throw e;
        } catch (Exception e) {
            log.error("KYC-auth failed with transactionId : {} && clientId : {}", kycAuthDto.getTransactionId(),
                    clientId, e);
        }
        throw new KycAuthException(ErrorConstants.AUTH_FAILED);
    }

    @Override
    public KycExchangeResult doKycExchange(String relyingPartyId, String clientId, KycExchangeDto kycExchangeDto)
            throws KycExchangeException {
        log.info("Started to build kyc-exchange request with transactionId : {} && clientId : {}",
                kycExchangeDto.getTransactionId(), clientId);
        try {
            KycExchangeRequestDto kycExchangeRequestDto = new KycExchangeRequestDto();
            kycExchangeRequestDto.setRequestDateTime(MockHelperService.getUTCDateTime());
            kycExchangeRequestDto.setTransactionId(kycExchangeDto.getTransactionId());
            kycExchangeRequestDto.setKycToken(kycExchangeDto.getKycToken());
            kycExchangeRequestDto.setIndividualId(kycExchangeDto.getIndividualId());
            kycExchangeRequestDto.setAcceptedClaims(kycExchangeDto.getAcceptedClaims());
            kycExchangeRequestDto.setClaimLocales(Arrays.asList(kycExchangeDto.getClaimsLocales()));

            //set signature header, body and invoke kyc exchange endpoint
            String requestBody = objectMapper.writeValueAsString(kycExchangeRequestDto);
            RequestEntity requestEntity = RequestEntity
                    .post(UriComponentsBuilder.fromUriString(kycExchangeUrl).pathSegment(relyingPartyId,
                            clientId).build().toUri())
                    .contentType(MediaType.APPLICATION_JSON_UTF8)
                    .body(requestBody);
            ResponseEntity<ResponseWrapper<KycExchangeResponseDto>> responseEntity = restTemplate.exchange(requestEntity,
                    new ParameterizedTypeReference<>() {
                    });

            if (responseEntity.getStatusCode().is2xxSuccessful() && responseEntity.getBody() != null) {
                ResponseWrapper<KycExchangeResponseDto> responseWrapper = responseEntity.getBody();
                if (responseWrapper.getResponse() != null && responseWrapper.getResponse().getKyc() != null) {
                    return new KycExchangeResult(responseWrapper.getResponse().getKyc());
                }
                log.error("Errors in response received from IDA Kyc Exchange: {}", responseWrapper.getErrors());
                throw new KycExchangeException(CollectionUtils.isEmpty(responseWrapper.getErrors()) ?
                        ErrorConstants.DATA_EXCHANGE_FAILED : responseWrapper.getErrors().get(0).getErrorCode());
            }

            log.error("Error response received from IDA (Kyc-exchange) with status : {}", responseEntity.getStatusCode());
        } catch (KycExchangeException e) {
            throw e;
        } catch (Exception e) {
            log.error("IDA Kyc-exchange failed with clientId : {}", clientId, e);
        }
        throw new KycExchangeException("mock-ida-005", "Failed to build kyc data");
    }

    @Override
    public SendOtpResult sendOtp(String relyingPartyId, String clientId, SendOtpDto sendOtpDto)
            throws SendOtpException {
        try {
            RequestEntity requestEntity = RequestEntity
                    .get(UriComponentsBuilder.fromUriString(getIdentityUrl + "/" + sendOtpDto.getIndividualId()).build().toUri()).build();
            ResponseEntity<ResponseWrapper> responseEntity = restTemplate.exchange(requestEntity,
                    ResponseWrapper.class);

            if (responseEntity.getStatusCode().is2xxSuccessful() && responseEntity.getBody() != null) {
                ResponseWrapper responseWrapper = responseEntity.getBody();
                IdentityData IdentityData = objectMapper.convertValue(responseWrapper.getResponse(), IdentityData.class);

                String maskedEmailId = MockHelperService.maskEmail(IdentityData.getEmail());
                String maskedMobile = MockHelperService.maskMobile(IdentityData.getPhone());

                return new SendOtpResult(sendOtpDto.getTransactionId(), maskedEmailId, maskedMobile);
            }
            log.error("Provided identity is not found {}", sendOtpDto.getIndividualId());
            throw new SendOtpException("mock-ida-001");
        } catch (Exception e) {
            log.error("authenticateIndividualWithPin failed", e);
        }
        throw new SendOtpException(SEND_OTP_FAILED);
    }

    @Override
    public boolean isSupportedOtpChannel(String channel) {
        return channel != null && ("email".equalsIgnoreCase(channel) || "mobile".equalsIgnoreCase(channel));
    }

    @Override
    public List<KycSigningCertificateData> getAllKycSigningCertificates() {
        List<KycSigningCertificateData> certs = new ArrayList<>();
        AllCertificatesDataResponseDto allCertificatesDataResponseDto = keymanagerService.getAllCertificates(APPLICATION_ID,
                Optional.empty());
        for (CertificateDataResponseDto dto : allCertificatesDataResponseDto.getAllCertificates()) {
            certs.add(new KycSigningCertificateData(dto.getKeyId(), dto.getCertificateData(),
                    dto.getExpiryAt(), dto.getIssuedAt()));
        }
        return certs;
    }
}
