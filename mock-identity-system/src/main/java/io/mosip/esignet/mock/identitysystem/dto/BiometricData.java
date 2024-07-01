/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at https://mozilla.org/MPL/2.0/.
 */
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
