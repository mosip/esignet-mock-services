package io.mosip.esignet.mock.identitysystem.validator;

import java.util.Arrays;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Objects;

import javax.validation.ConstraintValidator;
import javax.validation.ConstraintValidatorContext;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

import com.fasterxml.jackson.databind.ObjectMapper;

import io.mosip.esignet.mock.identitysystem.dto.IdentityData;

@Component
public class IdentityDataValidator implements ConstraintValidator<IdData, IdentityData> {

	@Value("${mosip.esignet.mock.supported-fields}")
	private String supportedFields;

	@Value("${mosip.esignet.mock.number-of-extra-fields:10}")
	private String extraFields;

	@Override
	public boolean isValid(IdentityData value,
			ConstraintValidatorContext context) {
		if (value == null) {
			return false;
		}

		List<String> supportedFieldsList = Arrays.asList(supportedFields.split("\\s*,\\s*"));

		Map<String, Object> fields = new ObjectMapper().convertValue(value, HashMap.class);
		
		fields.values().removeIf(Objects::isNull);

		if (!fields.keySet().containsAll(supportedFieldsList)) {
			return false;
		}
		
		long count = supportedFieldsList.stream().filter(field -> fields.containsKey(field)).count();

		if ((fields.size() - count) <= Long.parseLong(extraFields)) {
			return true;
		}

		return false;
	}

}
