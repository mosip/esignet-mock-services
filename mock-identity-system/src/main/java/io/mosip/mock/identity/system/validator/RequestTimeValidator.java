package io.mosip.mock.identity.system.validator;

import static io.mosip.mock.identity.system.util.Constants.UTC_DATETIME_PATTERN;

import java.time.LocalDateTime;
import java.time.ZoneOffset;
import java.time.format.DateTimeFormatter;
import java.time.temporal.ChronoUnit;

import javax.validation.ConstraintValidator;
import javax.validation.ConstraintValidatorContext;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

@Component
public class RequestTimeValidator implements ConstraintValidator<RequestTime, String> {

	@Value("${mosip.mock.authdata.reqtime.maxlimit:-2}")
    private int maxMinutes;

	@Value("${mosip..mock.authdata.reqtime.minlimit:2}")
    private int minMinutes;


    @Override
    public boolean isValid(String value, ConstraintValidatorContext context) {
        if(value == null || value.isBlank())
            return false;

        try {
            LocalDateTime localDateTime = LocalDateTime.parse(value, DateTimeFormatter.ofPattern(UTC_DATETIME_PATTERN));
            long diff = localDateTime.until(LocalDateTime.now(ZoneOffset.UTC), ChronoUnit.MINUTES);
            return (diff <= minMinutes && diff >= maxMinutes);
        } catch (Exception ex) {}

        return false;
    }
}
