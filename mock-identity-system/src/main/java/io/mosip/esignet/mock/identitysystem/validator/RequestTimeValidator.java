/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at https://mozilla.org/MPL/2.0/.
 */
package io.mosip.esignet.mock.identitysystem.validator;

import static io.mosip.esignet.mock.identitysystem.util.Constants.UTC_DATETIME_PATTERN;

import java.time.LocalDateTime;
import java.time.ZoneOffset;
import java.time.format.DateTimeFormatter;
import java.time.temporal.ChronoUnit;

import jakarta.validation.ConstraintValidator;
import jakarta.validation.ConstraintValidatorContext;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

@Component
public class RequestTimeValidator implements ConstraintValidator<RequestTime, String> {

	@Value("${esignet.mock.identity-system.allowed-request-time-variation-seconds:120}")
    private int timeVariationSeconds;

    @Override
    public boolean isValid(String value, ConstraintValidatorContext context) {
        if(value == null || value.isBlank())
            return false;

        try {
            LocalDateTime localDateTime = LocalDateTime.parse(value, DateTimeFormatter.ofPattern(UTC_DATETIME_PATTERN));
            long diff = localDateTime.until(LocalDateTime.now(ZoneOffset.UTC), ChronoUnit.SECONDS);
            return (diff <= timeVariationSeconds && diff >= -timeVariationSeconds);
        } catch (Exception ex) {}

        return false;
    }
}
