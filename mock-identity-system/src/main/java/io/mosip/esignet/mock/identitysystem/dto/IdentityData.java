package io.mosip.esignet.mock.identitysystem.dto;


import java.util.List;

import javax.validation.constraints.NotBlank;
import javax.validation.constraints.NotNull;
import javax.validation.constraints.Size;

import io.mosip.esignet.mock.identitysystem.util.ErrorConstants;
import lombok.Data;

@Data
public class IdentityData {
	
	@NotBlank(message = ErrorConstants.INVALID_INDIVIDUAL_ID)
	String individualId;

	@NotBlank(message = ErrorConstants.INVALID_INDIVIDUAL_ID)
	String pin;

	@NotNull(message = ErrorConstants.INVALID_FULLNAME)
	@Size(min = 1, message = ErrorConstants.INVALID_FULLNAME)
	List<LanguageValue> fullName;

	@NotNull(message = ErrorConstants.INVALID_GENDER)
	@Size(min = 1, message = ErrorConstants.INVALID_GENDER)
	List<LanguageValue> gender;

	@NotBlank(message = ErrorConstants.INVALID_DATE_OF_BIRTH)
	String dateOfBirth;

	@NotNull(message = ErrorConstants.INVALID_STREET_ADDRESS)
	@Size(min = 1, message = ErrorConstants.INVALID_STREET_ADDRESS)
	List<LanguageValue> streetAddress;

	@NotNull(message = ErrorConstants.INVALID_LOCALITY)
	@Size(min = 1, message = ErrorConstants.INVALID_LOCALITY)
	List<LanguageValue> locality;

	@NotNull(message = ErrorConstants.INVALID_REGION)
	@Size(min = 1, message = ErrorConstants.INVALID_REGION)
	List<LanguageValue> region;

	@NotBlank(message = ErrorConstants.INVALID_POSTAL_CODE)
	String postalCode;

	@NotNull(message = ErrorConstants.INVALID_COUNTRY)
	@Size(min = 1, message = ErrorConstants.INVALID_COUNTRY)
	List<LanguageValue> country;

	@NotBlank(message = ErrorConstants.INVALID_ENCODED_PHOTO)
	String encodedPhoto;

	@NotNull(message = ErrorConstants.INVALID_BIOMETRICS)
	BiometricData individualBiometrics;

	@NotBlank(message = ErrorConstants.INVALID_EMAIL)
	String email;

	@NotBlank(message = ErrorConstants.INVALID_PHONE)
	String phone;

}
