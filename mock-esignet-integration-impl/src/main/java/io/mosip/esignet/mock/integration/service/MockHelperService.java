package io.mosip.esignet.mock.integration.service;

import com.fasterxml.jackson.databind.ObjectMapper;
import io.mosip.esignet.api.dto.SendOtpResult;
import io.mosip.esignet.api.exception.SendOtpException;
import io.mosip.esignet.mock.integration.dto.IdentityData;
import io.mosip.kernel.core.http.ResponseWrapper;
import io.mosip.kernel.core.util.StringUtils;
import io.mosip.kernel.signature.dto.JWTSignatureRequestDto;
import io.mosip.kernel.signature.dto.JWTSignatureResponseDto;
import io.mosip.kernel.signature.service.SignatureService;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.RequestEntity;
import org.springframework.stereotype.Component;
import org.springframework.web.client.RestTemplate;
import org.springframework.web.util.UriComponentsBuilder;

import java.nio.charset.StandardCharsets;
import java.time.LocalDateTime;
import java.time.ZoneOffset;
import java.time.ZonedDateTime;
import java.util.Base64;
import java.util.List;
import java.util.stream.IntStream;

@Component
@Slf4j
public class MockHelperService {
    public static final String OIDC_PARTNER_APP_ID = "OIDC_PARTNER";
    private static final Base64.Encoder urlSafeEncoder = Base64.getUrlEncoder().withoutPadding();
    @Value("${mosip.esignet.mock.authenticator.get-identity-url}")
    private String getIdentityUrl;
    @Autowired
    private SignatureService signatureService;
    @Autowired
    private RestTemplate restTemplate;
    @Autowired
    private ObjectMapper objectMapper;

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

    public static boolean isSupportedOtpChannel(String channel) {
        return ("email".equalsIgnoreCase(channel) || "mobile".equalsIgnoreCase(channel));
    }

    public static String maskMobile(String mobileNumber) {
        if (StringUtils.isEmpty(mobileNumber)) {
            return "";
        }
        StringBuilder maskedMobile = new StringBuilder(mobileNumber);
        IntStream.range(0, (maskedMobile.length() / 2) + 1).forEach(i -> maskedMobile.setCharAt(i, 'X'));
        return maskedMobile.toString();
    }

    public static String maskEmail(String email) {
        if (StringUtils.isEmpty(email)) {
            return "";
        }
        StringBuilder maskedEmail = new StringBuilder(email);
        IntStream.range(1, StringUtils.split(email, '@')[0].length() + 1).filter(i -> i % 3 != 0)
                .forEach(i -> maskedEmail.setCharAt(i - 1, 'X'));
        return maskedEmail.toString();
    }

    public SendOtpResult sendOtpMock(String individualId, List<String> otpChannels, String transactionId) throws SendOtpException {

        try {
            var requestEntity = RequestEntity
                    .get(UriComponentsBuilder.fromUriString(getIdentityUrl + "/" + individualId).build().toUri()).build();
            var responseEntity = restTemplate.exchange(requestEntity,
                    ResponseWrapper.class);

            if (responseEntity.getStatusCode().is2xxSuccessful() && responseEntity.getBody() != null) {
                var responseWrapper = responseEntity.getBody();
                IdentityData IdentityData = objectMapper.convertValue(responseWrapper.getResponse(), IdentityData.class);

                if (otpChannels == null
                        || !otpChannels.stream().allMatch(MockHelperService::isSupportedOtpChannel)) {
                    throw new SendOtpException("invalid_otp_channel");
                }

                String maskedEmailId = null;
                String maskedMobile = null;
                for (String channel : otpChannels) {
                    if (channel.equalsIgnoreCase("email")) {
                        maskedEmailId = MockHelperService.maskEmail(IdentityData.getEmail());
                    }
                    if (channel.equalsIgnoreCase("mobile")) {
                        maskedMobile = MockHelperService.maskMobile(IdentityData.getPhone());
                    }
                }

                return new SendOtpResult(transactionId, maskedEmailId, maskedMobile);
            }
            log.error("Provided individual Id not found {}", individualId);
            throw new SendOtpException("invalid_individual_id");
        } catch (Exception e) {
            log.error("send otp failed", e);
            throw new SendOtpException("send_otp_failed: " + e.getMessage());
        }
    }
}
