package io.mosip.esignet.mock.identitysystem.util;

import static io.mosip.esignet.mock.identitysystem.util.Constants.UTC_DATETIME_PATTERN;

import java.nio.charset.StandardCharsets;
import java.security.MessageDigest;
import java.security.NoSuchAlgorithmException;
import java.time.ZoneOffset;
import java.time.ZonedDateTime;
import java.time.format.DateTimeFormatter;
import java.util.Base64;

import io.mosip.esignet.mock.identitysystem.exception.MockIdentityException;
import lombok.extern.slf4j.Slf4j;
import org.springframework.util.AntPathMatcher;
import org.springframework.util.PathMatcher;

@Slf4j
public class HelperUtil {

	public static final String ALGO_SHA3_256 = "SHA3-256";
	public static final String ALGO_SHA_256 = "SHA-256";
	public static final String ALGO_SHA_1 = "SHA-1";
	public static final String ALGO_MD5 = "MD5";
	public static final String CHARACTERS = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

	private static Base64.Encoder urlSafeEncoder;
	private static Base64.Decoder urlSafeDecoder;
	private static PathMatcher pathMatcher;

	static {
		urlSafeEncoder = Base64.getUrlEncoder().withoutPadding();
		urlSafeDecoder = Base64.getUrlDecoder();
		pathMatcher = new AntPathMatcher();
	}

	/**
	 * Output format : 2022-12-01T03:22:46.720Z
	 * 
	 * @return Formatted datetime
	 */
	public static String getCurrentUTCDateTime() {
		return ZonedDateTime.now(ZoneOffset.UTC).format(DateTimeFormatter.ofPattern(UTC_DATETIME_PATTERN));
	}

	public static String generateB64EncodedHash(String algorithm, String value) throws MockIdentityException {
		try {
			MessageDigest digest = MessageDigest.getInstance(algorithm);
			byte[] hash = digest.digest(value.getBytes(StandardCharsets.UTF_8));
			return urlSafeEncoder.encodeToString(hash);
		} catch (NoSuchAlgorithmException ex) {
			log.error("Invalid algorithm : {}", algorithm, ex);
			throw new MockIdentityException("invalid_algorithm");
		}
	}

	public static String b64Encode(byte[] bytes) {
		return urlSafeEncoder.encodeToString(bytes);
	}

	public static String b64Encode(String value) {
		return urlSafeEncoder.encodeToString(value.getBytes(StandardCharsets.UTF_8));
	}

}
