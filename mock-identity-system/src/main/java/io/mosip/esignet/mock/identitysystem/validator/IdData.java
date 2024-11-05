package io.mosip.esignet.mock.identitysystem.validator;

import static java.lang.annotation.ElementType.TYPE;
import static java.lang.annotation.RetentionPolicy.RUNTIME;
import static io.mosip.esignet.mock.identitysystem.util.ErrorConstants.INVALID_REQUEST;

import java.lang.annotation.Documented;
import java.lang.annotation.Retention;
import java.lang.annotation.Target;

import javax.validation.Constraint;
import javax.validation.Payload;

@Target({TYPE})
@Retention(RUNTIME)
@Constraint(validatedBy = IdentityDataValidator.class)
@Documented
public @interface IdData {

	String message() default INVALID_REQUEST;

	Class<?>[] groups() default {};

	Class<? extends Payload>[] payload() default {};

	String action() default "CREATE";

}
