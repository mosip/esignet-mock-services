/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at https://mozilla.org/MPL/2.0/.
 */
package io.mosip.esignet.mock.identitysystem.util;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.node.ArrayNode;
import io.mosip.esignet.mock.identitysystem.dto.LanguageValue;
import io.mosip.esignet.mock.identitysystem.exception.MockIdentityException;
import io.mosip.kernel.core.util.StringUtils;
import lombok.extern.slf4j.Slf4j;
import org.springframework.util.AntPathMatcher;
import org.springframework.util.PathMatcher;

import java.nio.charset.StandardCharsets;
import java.security.MessageDigest;
import java.security.NoSuchAlgorithmException;
import java.time.ZoneOffset;
import java.time.ZonedDateTime;
import java.time.format.DateTimeFormatter;
import java.util.ArrayList;
import java.util.Base64;
import java.util.List;
import java.util.stream.IntStream;

import static io.mosip.esignet.mock.identitysystem.util.Constants.UTC_DATETIME_PATTERN;

@Slf4j
public class HelperUtil {
    public static final String ALGO_SHA3_256 = "SHA3-256";
    public static final String ALGO_SHA_256 = "SHA-256";
    public static final String ALGO_SHA_1 = "SHA-1";
    public static final String ALGO_MD5 = "MD5";
    public static final String CHARACTERS = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

    private static Base64.Encoder urlSafeEncoder;
    private static Base64.Decoder urlSafeDecoder;
    private static PathMatcher pathMatcher;

    static {
        urlSafeEncoder = Base64.getUrlEncoder().withoutPadding();
        urlSafeDecoder = Base64.getUrlDecoder();
        pathMatcher = new AntPathMatcher();
    }

    /**
     * Output format : 2022-12-01T03:22:46.720Z
     *
     * @return Formatted datetime
     */
    public static String getCurrentUTCDateTime() {
        return ZonedDateTime.now(ZoneOffset.UTC).format(DateTimeFormatter.ofPattern(UTC_DATETIME_PATTERN));
    }

    public static String generateB64EncodedHash(String algorithm, String value) throws MockIdentityException {
        try {
            MessageDigest digest = MessageDigest.getInstance(algorithm);
            byte[] hash = digest.digest(value.getBytes(StandardCharsets.UTF_8));
            return urlSafeEncoder.encodeToString(hash);
        } catch (NoSuchAlgorithmException ex) {
            log.error("Invalid algorithm : {}", algorithm, ex);
            throw new MockIdentityException("invalid_algorithm");
        }
    }

    public static String b64Encode(byte[] bytes) {
        return urlSafeEncoder.encodeToString(bytes);
    }

    public static String b64Encode(String value) {
        return urlSafeEncoder.encodeToString(value.getBytes(StandardCharsets.UTF_8));
    }

    public static String maskMobile(String mobileNumber) {
        if (StringUtils.isEmpty(mobileNumber)) {
            return "";
        }
        StringBuilder maskedMobile = new StringBuilder(mobileNumber);
        IntStream.range(0, (maskedMobile.length() / 2) + 1).forEach(i -> maskedMobile.setCharAt(i, 'X'));
        return maskedMobile.toString();
    }

    public static String maskEmail(String email) {
        if (StringUtils.isEmpty(email)) {
            return "";
        }
        StringBuilder maskedEmail = new StringBuilder(email);
        IntStream.range(1, StringUtils.split(email, '@')[0].length() + 1).filter(i -> i % 3 != 0)
                .forEach(i -> maskedEmail.setCharAt(i - 1, 'X'));
        return maskedEmail.toString();
    }

    public static String getIdentityDataValue(JsonNode jsonNode, String field, String fieldLang) {
       if(jsonNode.has(field)){
           Object fieldValue = jsonNode.get(field);
           if(fieldValue instanceof ArrayNode){
               List<LanguageValue> languageValues = getLanguageValuesList((ArrayNode) fieldValue);
               for(LanguageValue languageValue:languageValues){
                   if(languageValue.getLanguage().equals(fieldLang)){
                       return languageValue.getValue();
                   }
               }
           }else
            return jsonNode.get(field).asText();
       }
       return null;
    }

    public static List<LanguageValue> getLanguageValuesList(ArrayNode fieldValue){
        List<LanguageValue> languageValues=new ArrayList<>();
        for (JsonNode node : fieldValue) {
            String language = node.get("language").asText();
            String value = node.get("value").asText();
            LanguageValue languageValue = new LanguageValue();
            languageValue.setLanguage(language);
            languageValue.setValue(value);
            languageValues.add(languageValue);
        }
        return languageValues;
    }
}
