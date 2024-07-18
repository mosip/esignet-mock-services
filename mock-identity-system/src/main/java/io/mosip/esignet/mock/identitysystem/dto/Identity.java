/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at https://mozilla.org/MPL/2.0/.
 */
package io.mosip.esignet.mock.identitysystem.dto;

import java.util.List;

import lombok.Data;

@Data
public class Identity{
	List<LanguageValue> fullName;
	String dateOfBirth;
	String email;
	String phone;
	List<LanguageValue> gender;
	List<LanguageValue> addressLine1;
	List<LanguageValue> addressLine2;
	List<LanguageValue> addressLine3;
	List<LanguageValue> province;
	List<LanguageValue> region;
	List<LanguageValue> zone;
	String postal_code;
	String encodedPhoto;
}
