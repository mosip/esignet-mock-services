package io.mosip.esignet.mock.integration.dto;

import lombok.Data;

import java.util.List;

@Data
public class IdentityData {

	String individualId;
	String pin;
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
