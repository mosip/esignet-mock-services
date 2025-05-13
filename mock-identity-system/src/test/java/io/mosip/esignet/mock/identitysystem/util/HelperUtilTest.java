/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at https://mozilla.org/MPL/2.0/.
 */
package io.mosip.esignet.mock.identitysystem.util;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.node.ArrayNode;
import com.fasterxml.jackson.databind.node.JsonNodeFactory;
import com.fasterxml.jackson.databind.node.ObjectNode;
import io.mosip.esignet.mock.identitysystem.dto.LanguageValue;
import io.mosip.esignet.mock.identitysystem.exception.MockIdentityException;
import org.junit.jupiter.api.Assertions;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.junit.jupiter.MockitoExtension;

import java.nio.charset.StandardCharsets;
import java.security.MessageDigest;
import java.security.NoSuchAlgorithmException;
import java.util.List;

@ExtendWith(MockitoExtension.class)
public class HelperUtilTest {

    private static final String TEST_EMAIL = "test@example.com";
    private static final String TEST_MOBILE = "1234567890";
    private static final String TEST_STRING = "Hello World";

    @Test
    public void b64EncodeString_validDetails_thenPass() {
        String encoded = HelperUtil.b64Encode(TEST_STRING);
        Assertions.assertNotNull(encoded);
        Assertions.assertEquals("SGVsbG8gV29ybGQ", encoded);
    }

    @Test
    public void b64EncodeByteArray_validDetails_thenPass() {
        byte[] bytes = TEST_STRING.getBytes(StandardCharsets.UTF_8);
        String encoded = HelperUtil.b64Encode(bytes);
        Assertions.assertNotNull(encoded);
        Assertions.assertEquals("SGVsbG8gV29ybGQ", encoded);
    }

    @Test
    public void maskMobile_validMobile_thenPass() {
        String masked = HelperUtil.maskMobile(TEST_MOBILE);
        Assertions.assertEquals("XXXXXX7890", masked);
    }

    @Test
    public void maskEmail_validEmail_thenPass() {
        String masked = HelperUtil.maskEmail(TEST_EMAIL);
        Assertions.assertEquals("XXsX@example.com", masked);
    }

    @Test
    public void getIdentityDataValue2_validDetails_thenPass() {
        ObjectNode jsonNode = JsonNodeFactory.instance.objectNode();
        ArrayNode arrayNode = JsonNodeFactory.instance.arrayNode();
        JsonNode langNode = JsonNodeFactory.instance.objectNode();
        jsonNode.set("testField", arrayNode);
        arrayNode.add(langNode);
        ((ObjectNode) langNode).set("language", JsonNodeFactory.instance.textNode("en"));
        ((ObjectNode) langNode).set("value", JsonNodeFactory.instance.textNode("Value in English"));
        String result = HelperUtil.getIdentityDataValue(jsonNode, "testField", "en");
        Assertions.assertEquals("Value in English", result);
    }

    @Test
    public void getLanguageValuesList_validDetails_thenPass() {
        ArrayNode arrayNode = JsonNodeFactory.instance.arrayNode();
        ObjectNode langNode = JsonNodeFactory.instance.objectNode();
        arrayNode.add(langNode);
        langNode.set("language", JsonNodeFactory.instance.textNode("en"));
        langNode.set("value", JsonNodeFactory.instance.textNode("Value in English"));
        List<LanguageValue> languageValues = HelperUtil.getLanguageValuesList(arrayNode);
        Assertions.assertNotNull(languageValues);
        Assertions.assertEquals(1, languageValues.size());
        Assertions.assertEquals("en", languageValues.get(0).getLanguage());
        Assertions.assertEquals("Value in English", languageValues.get(0).getValue());
    }

    @Test
    public void generateB64EncodedHash_validDetails_thenPass() throws NoSuchAlgorithmException, MockIdentityException {
        String hash = HelperUtil.generateB64EncodedHash("SHA-256", TEST_STRING);
        Assertions.assertNotNull(hash);
        MessageDigest digest = MessageDigest.getInstance("SHA-256");
        byte[] expectedHash = digest.digest(TEST_STRING.getBytes(StandardCharsets.UTF_8));
        String expectedEncoded = HelperUtil.b64Encode(expectedHash);
        Assertions.assertEquals(expectedEncoded, hash);
    }

    @Test
    public void generateB64EncodedHash_withInvalidAlgorithm_thenFail() {
        MockIdentityException exception = Assertions.assertThrows(MockIdentityException.class, () -> {
            HelperUtil.generateB64EncodedHash("INVALID_ALGO", TEST_STRING);
        });
        Assertions.assertEquals("invalid_algorithm", exception.getMessage());
    }
}
