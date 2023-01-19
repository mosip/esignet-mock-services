package io.mosip.mock.identity.system.dto;

import java.util.List;

import lombok.Data;

@Data
public class Identity{
	List<Values> fullName;
	String dateOfBirth;
	String email;
	String phone;
	List<Values> gender;
	List<Values> addressLine1;
	List<Values> addressLine2;
	List<Values> addressLine3;
	List<Values> province;
	List<Values> region;
	List<Values> zone;
	String postal_code;
	String encodedPhoto;
}
