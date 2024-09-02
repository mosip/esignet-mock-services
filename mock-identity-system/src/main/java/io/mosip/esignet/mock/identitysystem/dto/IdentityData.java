/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at https://mozilla.org/MPL/2.0/.
 */
package io.mosip.esignet.mock.identitysystem.dto;


import java.util.List;

import javax.validation.constraints.NotBlank;
import javax.validation.constraints.NotNull;
import javax.validation.constraints.Size;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import io.mosip.esignet.mock.identitysystem.util.ErrorConstants;
import io.mosip.esignet.mock.identitysystem.validator.IdData;
import lombok.Data;

@Data
@IdData
@JsonIgnoreProperties(ignoreUnknown = true)
public class IdentityData {
	
	@NotBlank(message = ErrorConstants.INVALID_INDIVIDUAL_ID)
	String individualId;

	String pin;
	
	List<LanguageValue> name;

	@Size(min = 1, message = ErrorConstants.INVALID_FULLNAME)
	List<LanguageValue> fullName;
	
	List<LanguageValue> givenName;

	List<LanguageValue> familyName;
	
	List<LanguageValue> middleName;

	List<LanguageValue> nickName;

	List<LanguageValue> preferredUsername;

	List<LanguageValue> gender;

	String dateOfBirth;

	List<LanguageValue> streetAddress;

	List<LanguageValue> locality;

	List<LanguageValue> region;

	String postalCode;

	List<LanguageValue> country;

	String encodedPhoto;

	BiometricData individualBiometrics;

	String email;

	String phone;
	
	String zoneInfo;
	
	String locale;

	String password;

}
