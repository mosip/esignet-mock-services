package io.mosip.esignet.mock.integration.service;

import io.mosip.kernel.core.util.StringUtils;
import io.mosip.kernel.signature.dto.JWTSignatureRequestDto;
import io.mosip.kernel.signature.dto.JWTSignatureResponseDto;
import io.mosip.kernel.signature.service.SignatureService;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

import java.nio.charset.StandardCharsets;
import java.time.LocalDateTime;
import java.time.ZoneOffset;
import java.time.ZonedDateTime;
import java.util.Base64;
import java.util.stream.IntStream;

@Component
@Slf4j
public class MockHelperService {
	public static final String OIDC_PARTNER_APP_ID = "OIDC_PARTNER";
	private static final Base64.Encoder urlSafeEncoder = Base64.getUrlEncoder().withoutPadding();;

	@Autowired
	private SignatureService signatureService;

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

	public static String maskMobile(String mobileNumber) {
		if (StringUtils.isEmpty(mobileNumber)) {
			return "";
		}
		StringBuilder maskedMobile = new StringBuilder(mobileNumber);
		IntStream.range(0, (maskedMobile.length() / 2) + 1).forEach(i -> maskedMobile.setCharAt(i, 'X'));
		return maskedMobile.toString();
	}

	public static String maskEmail(String email){
		if (StringUtils.isEmpty(email)) {
			return "";
		}
		StringBuilder maskedEmail = new StringBuilder(email);
		IntStream.range(1, StringUtils.split(email, '@')[0].length() + 1).filter(i -> i % 3 != 0)
				.forEach(i -> maskedEmail.setCharAt(i - 1, 'X'));
		return maskedEmail.toString();
	}
}
