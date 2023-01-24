/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at https://mozilla.org/MPL/2.0/.
 */
package io.mosip.esignet.mock.identitysystem.validator;

import static io.mosip.esignet.mock.identitysystem.util.ErrorConstants.INVALID_REQUEST;
import static java.lang.annotation.ElementType.FIELD;
import static java.lang.annotation.RetentionPolicy.RUNTIME;

import java.lang.annotation.Documented;
import java.lang.annotation.Retention;
import java.lang.annotation.Target;

import javax.validation.Constraint;
import javax.validation.Payload;

@Target({ FIELD })
@Retention(RUNTIME)
@Constraint(validatedBy = RequestTimeValidator.class)
@Documented
public @interface RequestTime {

    String message() default INVALID_REQUEST;

    Class<?>[] groups() default {};

    Class<? extends Payload>[] payload() default {};
}
