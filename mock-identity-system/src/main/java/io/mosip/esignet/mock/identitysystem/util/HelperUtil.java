package io.mosip.esignet.mock.identitysystem.util;

import static io.mosip.esignet.mock.identitysystem.util.Constants.UTC_DATETIME_PATTERN;

import java.time.ZoneOffset;
import java.time.ZonedDateTime;
import java.time.format.DateTimeFormatter;

import lombok.extern.slf4j.Slf4j;

@Slf4j
public class HelperUtil {

	/**
	 * Output format : 2022-12-01T03:22:46.720Z
	 * 
	 * @return Formatted datetime
	 */
	public static String getCurrentUTCDateTime() {
		return ZonedDateTime.now(ZoneOffset.UTC).format(DateTimeFormatter.ofPattern(UTC_DATETIME_PATTERN));
	}

}
