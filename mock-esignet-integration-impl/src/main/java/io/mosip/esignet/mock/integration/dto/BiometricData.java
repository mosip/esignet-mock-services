package io.mosip.esignet.mock.integration.dto;

import lombok.Data;

@Data
public class BiometricData {

	private String format;
	private double version;
	private String value;
}
