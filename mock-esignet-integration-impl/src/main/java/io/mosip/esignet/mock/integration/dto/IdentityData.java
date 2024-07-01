/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at https://mozilla.org/MPL/2.0/.
 */
package io.mosip.esignet.mock.integration.dto;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import lombok.Data;

import java.util.List;


@JsonIgnoreProperties(ignoreUnknown = true)
@Data
public class IdentityData {

	String individualId;
	String pin;
	List<LanguageValue> name;
	List<LanguageValue> fullName;
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
}
