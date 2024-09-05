package io.mosip.esignet.mock.identitysystem.util;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.node.ArrayNode;
import com.fasterxml.jackson.databind.node.JsonNodeFactory;
import com.fasterxml.jackson.databind.node.ObjectNode;
import io.mosip.esignet.mock.identitysystem.dto.LanguageValue;
import io.mosip.esignet.mock.identitysystem.exception.MockIdentityException;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.mockito.junit.MockitoJUnitRunner;

import java.nio.charset.StandardCharsets;
import java.security.MessageDigest;
import java.security.NoSuchAlgorithmException;
import java.util.List;

import static org.junit.Assert.*;

@RunWith(MockitoJUnitRunner.class)
public class HelperUtilTest {

    private static final String TEST_EMAIL = "test@example.com";
    private static final String TEST_MOBILE = "1234567890";
    private static final String TEST_STRING = "Hello World";

    @Test
    public void b64EncodeString_validDetails_thenPass() {
        String encoded = HelperUtil.b64Encode(TEST_STRING);
        assertNotNull(encoded);
        assertEquals("SGVsbG8gV29ybGQ", encoded);
    }

    @Test
    public void b64EncodeByteArray_validDetails_thenPass() {
        byte[] bytes = TEST_STRING.getBytes(StandardCharsets.UTF_8);
        String encoded = HelperUtil.b64Encode(bytes);
        assertNotNull(encoded);
        assertEquals("SGVsbG8gV29ybGQ", encoded);
    }

    @Test
    public void maskMobile_validMobile_thenPass() {
        String masked = HelperUtil.maskMobile(TEST_MOBILE);
        assertEquals("XXXXXX7890", masked);
    }

    @Test
    public void maskEmail_validEmail_thenPass() {
        String masked = HelperUtil.maskEmail(TEST_EMAIL);
        assertEquals("XXsX@example.com", masked);
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
        assertEquals("Value in English", result);
    }

    @Test
    public void getLanguageValuesList_validDetails_thenPass() {
        ArrayNode arrayNode = JsonNodeFactory.instance.arrayNode();
        ObjectNode langNode = JsonNodeFactory.instance.objectNode();
        arrayNode.add(langNode);
        langNode.set("language", JsonNodeFactory.instance.textNode("en"));
        langNode.set("value", JsonNodeFactory.instance.textNode("Value in English"));
        List<LanguageValue> languageValues = HelperUtil.getLanguageValuesList(arrayNode);
        assertNotNull(languageValues);
        assertEquals(1, languageValues.size());
        assertEquals("en", languageValues.get(0).getLanguage());
        assertEquals("Value in English", languageValues.get(0).getValue());
    }

    @Test
    public void generateB64EncodedHash_validDetails_thenPass() throws NoSuchAlgorithmException, MockIdentityException {
        String hash = HelperUtil.generateB64EncodedHash("SHA-256", TEST_STRING);
        assertNotNull(hash);
        MessageDigest digest = MessageDigest.getInstance("SHA-256");
        byte[] expectedHash = digest.digest(TEST_STRING.getBytes(StandardCharsets.UTF_8));
        String expectedEncoded = HelperUtil.b64Encode(expectedHash);
        assertEquals(expectedEncoded, hash);
    }

    @Test
    public void generateB64EncodedHash_withInvalidAlgorithm_thenFail() {
        MockIdentityException exception = assertThrows(MockIdentityException.class, () -> {
            HelperUtil.generateB64EncodedHash("INVALID_ALGO", TEST_STRING);
        });
        assertEquals("invalid_algorithm", exception.getMessage());
    }
}
