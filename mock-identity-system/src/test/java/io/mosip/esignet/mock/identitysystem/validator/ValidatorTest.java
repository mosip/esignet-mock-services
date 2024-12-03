/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at https://mozilla.org/MPL/2.0/.
 */
package io.mosip.esignet.mock.identitysystem.validator;

import io.mosip.esignet.mock.identitysystem.dto.IdentityData;
import io.mosip.esignet.mock.identitysystem.dto.LanguageValue;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.MockitoJUnitRunner;
import org.springframework.test.util.ReflectionTestUtils;

import javax.validation.ConstraintValidatorContext;

import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.Arrays;
import java.util.List;

import static org.junit.Assert.assertFalse;
import static org.junit.Assert.assertTrue;

@RunWith(MockitoJUnitRunner.class)
public class ValidatorTest {

    @InjectMocks
    private RequestTimeValidator requestTimeValidator;

    @Mock
    private ConstraintValidatorContext context;

    private static final String UTC_DATETIME_PATTERN = "yyyy-MM-dd'T'HH:mm:ss.SSS'Z'";

    @InjectMocks
    private IdentityDataValidator identityDataValidator;

    @Test
    public void requestTimeValidator_withNullValue_thenFail() {
        assertFalse(requestTimeValidator.isValid(null, context));
    }

    @Test
    public void requestTimeValidator_withBlankValue_thenFail() {
        assertFalse(requestTimeValidator.isValid("", context));
        assertFalse(requestTimeValidator.isValid("   ", context));
    }

    @Test
    public void requestTimeValidator_withInvalidDate_thenFail() {
        assertFalse(requestTimeValidator.isValid("invalid-date", context));
    }

    @Test
    public void requestTimeValidator_withValidDate_thenPass() {
        LocalDateTime now = LocalDateTime.now().plusSeconds(121);
        String validDate = now.format(DateTimeFormatter.ofPattern(UTC_DATETIME_PATTERN));
        assertFalse(requestTimeValidator.isValid(validDate, context));
    }

    @Test
    public void testIsValid_ValidDateJustOutsideNegativeVariation() {
        LocalDateTime now = LocalDateTime.now().minusSeconds(121);
        String validDate = now.format(DateTimeFormatter.ofPattern(UTC_DATETIME_PATTERN));
        assertFalse(requestTimeValidator.isValid(validDate, context));
    }

    @Test
    public void identityDataValidator_withNullValue_thenFail() {
        assertFalse(identityDataValidator.isValid(null, context));
    }

    @Test
    public void identityDataValidator_withValidInputForCreateAction_thenPass() {
        List<String> supportedFields = Arrays.asList("fullName", "email", "phone");
        ReflectionTestUtils.setField(identityDataValidator, "action", "CREATE");
        ReflectionTestUtils.setField(identityDataValidator, "createRequiredFields", supportedFields);
        IdentityData identityData = new IdentityData();
        LanguageValue languageValue = new LanguageValue();
        languageValue.setLanguage("en");
        languageValue.setValue("John Doe");

        identityData.setFullName(List.of(languageValue));
        identityData.setEmail("john.doe@example.com");
        identityData.setPhone("1234567890");
        identityData.setEncodedPhoto("encoded-photo");

        assertTrue(identityDataValidator.isValid(identityData, context));
    }

    @Test
    public void identityDataValidator_withValidInputForUpdateAction_thenPass() {
        List<String> supportedFields = Arrays.asList("individualId");
        ReflectionTestUtils.setField(identityDataValidator, "action", "UPDATE");
        ReflectionTestUtils.setField(identityDataValidator, "updateRequiredFields", supportedFields);
        IdentityData identityData = new IdentityData();
        identityData.setIndividualId("individualId");

        assertTrue(identityDataValidator.isValid(identityData, context));
    }

    @Test
    public void identityDataValidator_withInvalidInputForUpdateAction_thenFail() {
        List<String> supportedFields = Arrays.asList("individualId", "email");
        ReflectionTestUtils.setField(identityDataValidator, "action", "UPDATE");
        ReflectionTestUtils.setField(identityDataValidator, "updateRequiredFields", supportedFields);
        IdentityData identityData = new IdentityData();
        identityData.setIndividualId("individualId");

        assertFalse(identityDataValidator.isValid(identityData, context));
    }

}
