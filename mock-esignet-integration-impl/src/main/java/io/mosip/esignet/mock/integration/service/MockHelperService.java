package io.mosip.esignet.mock.integration.service;

import com.fasterxml.jackson.databind.ObjectMapper;
import io.mosip.esignet.api.dto.*;
import io.mosip.esignet.api.exception.KycAuthException;
import io.mosip.esignet.api.exception.SendOtpException;
import io.mosip.esignet.api.util.ErrorConstants;
import io.mosip.esignet.mock.integration.dto.KycAuthRequestDto;
import io.mosip.esignet.mock.integration.dto.KycAuthResponseDto;
import io.mosip.kernel.core.http.ResponseWrapper;
import io.mosip.kernel.signature.dto.JWTSignatureRequestDto;
import io.mosip.kernel.signature.dto.JWTSignatureResponseDto;
import io.mosip.kernel.signature.service.SignatureService;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.core.ParameterizedTypeReference;
import org.springframework.http.MediaType;
import org.springframework.http.RequestEntity;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Component;
import org.springframework.util.CollectionUtils;
import org.springframework.web.client.RestTemplate;
import org.springframework.web.util.UriComponentsBuilder;

import java.nio.charset.StandardCharsets;
import java.time.LocalDateTime;
import java.time.ZoneOffset;
import java.time.ZonedDateTime;
import java.util.*;

@Component
@Slf4j
public class MockHelperService {
    public static final String OIDC_PARTNER_APP_ID = "OIDC_PARTNER";
    private static final Base64.Encoder urlSafeEncoder = Base64.getUrlEncoder().withoutPadding();
    public static final String CHARACTERS = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    @Value("${mosip.esignet.mock.authenticator.send-otp}")
    private String sendOtpUrl;
    @Value("${mosip.esignet.mock.authenticator.kyc-auth-url}")
    private String kycAuthUrl;
    @Value("${mosip.esignet.mock.authenticator.ida.otp-channels}")
    private List<String> otpChannels;
    @Autowired
    private SignatureService signatureService;
    @Autowired
    private RestTemplate restTemplate;
    @Autowired
    private ObjectMapper objectMapper;

    private static final Map<String, List<String>> supportedKycAuthFormats = new HashMap<>();

    static {
        supportedKycAuthFormats.put("OTP", List.of("alpha-numeric"));
        supportedKycAuthFormats.put("PIN", List.of("number"));
        supportedKycAuthFormats.put("BIO", List.of("encoded-json"));
        supportedKycAuthFormats.put("WLA", List.of("jwt"));
    }


    public static String b64Encode(String value) {
        return urlSafeEncoder.encodeToString(value.getBytes(StandardCharsets.UTF_8));
    }

    public static long getEpochSeconds() {
        return ZonedDateTime.now(ZoneOffset.UTC).toEpochSecond();
    }

    protected static LocalDateTime getUTCDateTime() {
        return ZonedDateTime
                .now(ZoneOffset.UTC).toLocalDateTime();
    }

    protected String getRequestSignature(String request) {
        JWTSignatureRequestDto jwtSignatureRequestDto = new JWTSignatureRequestDto();
        jwtSignatureRequestDto.setApplicationId(OIDC_PARTNER_APP_ID);
        jwtSignatureRequestDto.setReferenceId("");
        jwtSignatureRequestDto.setIncludePayload(false);
        jwtSignatureRequestDto.setIncludeCertificate(true);
        jwtSignatureRequestDto.setDataToSign(MockHelperService.b64Encode(request));
        JWTSignatureResponseDto responseDto = signatureService.jwtSign(jwtSignatureRequestDto);
        log.debug("Request signature ---> {}", responseDto.getJwtSignedData());
        return responseDto.getJwtSignedData();
    }

    public boolean isSupportedOtpChannel(String channel) {
        return channel != null && otpChannels.contains(channel.toLowerCase());
    }

    public SendOtpResult sendOtpMock(String transactionId, String individualId, List<String> otpChannels, String relyingPartyId, String clientId)
            throws SendOtpException {
        try {
            var sendOtpDto = new SendOtpDto();
            sendOtpDto.setTransactionId(transactionId);
            sendOtpDto.setIndividualId(individualId);
            sendOtpDto.setOtpChannels(otpChannels);
            String requestBody = objectMapper.writeValueAsString(sendOtpDto);
            RequestEntity requestEntity = RequestEntity
                    .post(UriComponentsBuilder.fromUriString(sendOtpUrl).pathSegment(relyingPartyId,
                            clientId).build().toUri())
                    .contentType(MediaType.APPLICATION_JSON_UTF8)
                    .body(requestBody);
            ResponseEntity<ResponseWrapper<SendOtpResult>> responseEntity = restTemplate.exchange(requestEntity,
                    new ParameterizedTypeReference<>() {
                    });

            if (responseEntity.getStatusCode().is2xxSuccessful() && responseEntity.getBody() != null) {
                ResponseWrapper<SendOtpResult> responseWrapper = responseEntity.getBody();
                if (responseWrapper.getResponse() != null) {
                    return responseWrapper.getResponse();
                }
                log.error("Errors in response received from IDA send Otp: {}", responseWrapper.getErrors());
                if (!CollectionUtils.isEmpty(responseWrapper.getErrors())) {
                    throw new SendOtpException(responseWrapper.getErrors().get(0).getErrorCode());
                }
            }
            throw new SendOtpException(ErrorConstants.SEND_OTP_FAILED);
        } catch (SendOtpException e) {
            throw e;
        } catch (Exception e) {
            log.error("send otp failed", e);
            throw new SendOtpException("send_otp_failed: " + e.getMessage());
        }
    }

    public KycAuthResult doKycAuthMock(String relyingPartyId, String clientId, KycAuthDto kycAuthDto)
            throws KycAuthException {
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
                } else if (Objects.equals(authChallenge.getAuthFactorType(), "WLA")) {
                    kycAuthRequestDto.setTokens(List.of(authChallenge.getChallenge()));
                } else {
                    throw new KycAuthException("invalid_auth_challenge");
                }

                if (!isKycAuthFormatSupported(authChallenge.getAuthFactorType(), authChallenge.getFormat())) {
                    throw new KycAuthException("invalid_challenge_format");
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
                log.error("Error response received from IDA, Errors: {}", responseWrapper.getErrors());
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

    private boolean isKycAuthFormatSupported(String authFactorType, String kycAuthFormat) {
        var supportedFormat = supportedKycAuthFormats.get(authFactorType);
        return supportedFormat != null && supportedFormat.contains(kycAuthFormat);
    }
}
