/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at https://mozilla.org/MPL/2.0/.
 */
package io.mosip.esignet.mock.identitysystem.validator;

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

	@Value("#{T(java.util.Arrays).asList('${mosip.esignet.mock.supported-fields:}')}")
	private List<String> supportedFields;

	@Override
	public boolean isValid(IdentityData value, ConstraintValidatorContext context) {
		if (value == null) {
			return false;
		}

		@SuppressWarnings("unchecked")
		Map<String, Object> fields = new ObjectMapper().convertValue(value, HashMap.class);

		fields.values().removeIf(Objects::isNull);

		return fields.keySet().containsAll(supportedFields);
	}

}
