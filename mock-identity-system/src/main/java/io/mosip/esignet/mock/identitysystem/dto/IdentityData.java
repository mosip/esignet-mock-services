/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at https://mozilla.org/MPL/2.0/.
 */
package io.mosip.esignet.mock.identitysystem.dto;


import java.util.List;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import lombok.Data;

@Data
@JsonIgnoreProperties(ignoreUnknown = true)
public class IdentityData {

	String individualId;

	String pin;

	List<LanguageValue> fullName;

	String preferredLang;

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

	String email;

	String phone;

	String zoneInfo;

	String locale;

	String password;

}
