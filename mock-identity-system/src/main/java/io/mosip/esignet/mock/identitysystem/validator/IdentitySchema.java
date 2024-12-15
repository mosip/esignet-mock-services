package io.mosip.esignet.mock.identitysystem.validator;


import io.mosip.esignet.mock.identitysystem.util.ErrorConstants;

import javax.validation.Constraint;
import javax.validation.Payload;
import java.lang.annotation.ElementType;
import java.lang.annotation.Retention;
import java.lang.annotation.RetentionPolicy;
import java.lang.annotation.Target;

@Target({ElementType.TYPE_USE, ElementType.FIELD, ElementType.PARAMETER})
@Retention(RetentionPolicy.RUNTIME)
@Constraint(validatedBy = IdentitySchemaValidator.class)
public @interface IdentitySchema {

    String message() default ErrorConstants.INVALID_IDENTITY_DATA;
    Class<?>[] groups() default {};
    Class<? extends Payload>[] payload() default {};

    String action();
}
