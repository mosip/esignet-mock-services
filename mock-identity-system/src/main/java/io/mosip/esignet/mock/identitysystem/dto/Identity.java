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
