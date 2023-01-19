package io.mosip.mock.identity.system.dto;


import java.util.List;

import javax.validation.constraints.NotBlank;
import javax.validation.constraints.NotNull;
import javax.validation.constraints.Size;

import io.mosip.mock.identity.system.util.ErrorConstants;
import lombok.Data;

@Data
public class MockAuthData {
	
	@NotBlank(message = ErrorConstants.INVALID_VIRTUAL_ID)
	String virtualId;

	@NotBlank(message = ErrorConstants.INVALID_VIRTUAL_ID)
	String pin;

	@NotNull(message = ErrorConstants.INVALID_FULLNAME)
	@Size(min = 1, message = ErrorConstants.INVALID_FULLNAME)
	List<Values> fullName;

	@NotNull(message = ErrorConstants.INVALID_GENDER)
	@Size(min = 1, message = ErrorConstants.INVALID_GENDER)
	List<Values> gender;

	@NotBlank(message = ErrorConstants.INVALID_DATE_OF_BIRTH)
	String dateOfBirth;

	@NotNull(message = ErrorConstants.INVALID_STREET_ADDRESS)
	@Size(min = 1, message = ErrorConstants.INVALID_STREET_ADDRESS)
	List<Values> streetAddress;

	@NotNull(message = ErrorConstants.INVALID_LOCALITY)
	@Size(min = 1, message = ErrorConstants.INVALID_LOCALITY)
	List<Values> locality;

	@NotNull(message = ErrorConstants.INVALID_REGION)
	@Size(min = 1, message = ErrorConstants.INVALID_REGION)
	List<Values> region;

	@NotBlank(message = ErrorConstants.INVALID_POSTAL_CODE)
	String postalCode;

	@NotNull(message = ErrorConstants.INVALID_COUNTRY)
	@Size(min = 1, message = ErrorConstants.INVALID_COUNTRY)
	List<Values> country;

	@NotBlank(message = ErrorConstants.INVALID_ENCODED_PHOTO)
	String encodedPhoto;

	@NotNull(message = ErrorConstants.INVALID_BIOMETRICS)
	BiometricProperties individualBiometrics;

	@NotBlank(message = ErrorConstants.INVALID_EMAIL)
	String email;

	@NotBlank(message = ErrorConstants.INVALID_PHONE)
	String phone;

}
