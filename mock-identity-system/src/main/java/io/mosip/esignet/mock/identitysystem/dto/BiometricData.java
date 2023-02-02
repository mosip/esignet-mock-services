package io.mosip.esignet.mock.identitysystem.dto;

import javax.validation.constraints.NotBlank;

import io.mosip.esignet.mock.identitysystem.util.ErrorConstants;
import lombok.Data;

@Data
public class BiometricData {

	@NotBlank(message = ErrorConstants.INVALID_FORMAT)
	private String format;

	@NotBlank(message = ErrorConstants.INVALID_VERSION)
	private double version;

	@NotBlank(message = ErrorConstants.INVALID_VALUE)
	private String value;
}
