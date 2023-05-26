package io.mosip.esignet.mock.identitysystem.dto;


import java.util.List;

import javax.validation.constraints.NotBlank;
import javax.validation.constraints.NotNull;
import javax.validation.constraints.Size;

import io.mosip.esignet.mock.identitysystem.util.ErrorConstants;
import io.mosip.esignet.mock.identitysystem.validator.IdData;
import lombok.Data;

@Data
@IdData
public class IdentityData {
	
	@NotBlank(message = ErrorConstants.INVALID_INDIVIDUAL_ID)
	String individualId;

	@NotBlank(message = ErrorConstants.INVALID_PIN)
	String pin;
	
	@Size(min = 1, message = ErrorConstants.INVALID_NAME)
	List<LanguageValue> name;

	@Size(min = 1, message = ErrorConstants.INVALID_FULLNAME)
	List<LanguageValue> fullName;
	
	@Size(min = 1, message = ErrorConstants.INVALID_GIVEN_NAME)
	List<LanguageValue> givenName;

	@Size(min = 1, message = ErrorConstants.INVALID_FAMILY_NAME)
	List<LanguageValue> familyName;
	
	@Size(min = 1, message = ErrorConstants.INVALID_MIDDLE_NAME)
	List<LanguageValue> middleName;

	@Size(min = 1, message = ErrorConstants.INVALID_NICK_NAME)
	List<LanguageValue> nickName;

	@Size(min = 1, message = ErrorConstants.INVALID_PREFERRED_USERNAME)
	List<LanguageValue> preferredUsername;

	@Size(min = 1, message = ErrorConstants.INVALID_GENDER)
	List<LanguageValue> gender;

	@Size(min = 1, message = ErrorConstants.INVALID_DATE_OF_BIRTH)
	String dateOfBirth;

	@Size(min = 1, message = ErrorConstants.INVALID_STREET_ADDRESS)
	List<LanguageValue> streetAddress;

	@Size(min = 1, message = ErrorConstants.INVALID_LOCALITY)
	List<LanguageValue> locality;

	@Size(min = 1, message = ErrorConstants.INVALID_REGION)
	List<LanguageValue> region;

	@Size(min = 1, message = ErrorConstants.INVALID_POSTAL_CODE)
	String postalCode;

	@Size(min = 1, message = ErrorConstants.INVALID_COUNTRY)
	List<LanguageValue> country;

	@NotBlank(message = ErrorConstants.INVALID_ENCODED_PHOTO)
	String encodedPhoto;

	@NotNull(message = ErrorConstants.INVALID_BIOMETRICS)
	BiometricData individualBiometrics;

	@Size(min = 1, message = ErrorConstants.INVALID_EMAIL)
	String email;

	@Size(min = 1, message = ErrorConstants.INVALID_PHONE)
	String phone;
	
	@Size(min = 1, message = ErrorConstants.INVALID_ZONEINFO)
	String zoneInfo;
	
	@Size(min = 1, message = ErrorConstants.INVALID_LOCALE)
	String locale;

}
