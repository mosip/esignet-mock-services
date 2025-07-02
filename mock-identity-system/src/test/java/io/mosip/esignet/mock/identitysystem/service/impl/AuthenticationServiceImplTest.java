/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at https://mozilla.org/MPL/2.0/.
 */
package io.mosip.esignet.mock.identitysystem.service.impl;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.node.ArrayNode;
import com.fasterxml.jackson.databind.node.NullNode;
import com.fasterxml.jackson.databind.node.ObjectNode;
import io.mosip.esignet.mock.identitysystem.dto.*;
import io.mosip.esignet.mock.identitysystem.entity.KycAuth;
import io.mosip.esignet.mock.identitysystem.entity.VerifiedClaim;
import io.mosip.esignet.mock.identitysystem.exception.MockIdentityException;
import io.mosip.esignet.mock.identitysystem.repository.AuthRepository;
import io.mosip.esignet.mock.identitysystem.repository.VerifiedClaimRepository;
import io.mosip.esignet.mock.identitysystem.service.IdentityService;
import io.mosip.esignet.mock.identitysystem.util.CacheUtilService;
import io.mosip.kernel.signature.dto.JWTSignatureResponseDto;
import io.mosip.kernel.signature.service.SignatureService;
import org.junit.Assert;
import org.junit.Before;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.Mockito;
import org.mockito.junit.MockitoJUnitRunner;
import org.springframework.test.util.ReflectionTestUtils;

import java.lang.reflect.InvocationTargetException;
import java.time.LocalDateTime;
import java.util.*;

import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.when;

@RunWith(MockitoJUnitRunner.class)
public class AuthenticationServiceImplTest {

    @Mock
    IdentityService identityService;

    @Mock
    AuthRepository authRepository;

    @Mock
    VerifiedClaimRepository verifiedClaimRepository;

    @Mock
    SignatureService signatureService;

    @Mock
    CacheUtilService cacheUtilService;

    @InjectMocks
    AuthenticationServiceImpl authenticationService;


    private ObjectMapper objectMapper = new ObjectMapper();

    private JsonNode identityData = null;

    Map<String, String> oidcClaimsMap = new HashMap<>();

    @Before
    public void setUp() throws Exception {
        String jsonIdentity = "{\"individualId\":\"8267411571\",\"pin\":\"111111\",\"fullName\":[{\"language\":\"fra\",\"value\":\"Siddharth K Mansour\"},{\"language\":\"ara\",\"value\":\"تتگلدكنسَزقهِقِفل دسييسيكدكنوڤو\"},{\"language\":\"eng\",\"value\":\"Siddharth K Mansour\"}],\"gender\":[{\"language\":\"eng\",\"value\":\"Male\"},{\"language\":\"fra\",\"value\":\"Mâle\"},{\"language\":\"ara\",\"value\":\"ذكر\"}],\"dateOfBirth\":\"1987/11/25\",\"streetAddress\":[{\"language\":\"fra\",\"value\":\"yuān⥍\"},{\"language\":\"ara\",\"value\":\"$لُنگ\uF017ᆑ\"},{\"language\":\"eng\",\"value\":\"Slung\"}],\"locality\":[{\"language\":\"fra\",\"value\":\"yuān 2\"},{\"language\":\"ara\",\"value\":\"يَُانꉛ⥍\"},{\"language\":\"eng\",\"value\":\"yuan wee\"}],\"region\":[{\"language\":\"fra\",\"value\":\"yuān 3\"},{\"language\":\"ara\",\"value\":\"$لُنگ\uF017ᆑ\"},{\"language\":\"eng\",\"value\":\"yuan wee 3\"}],\"postalCode\":\"45009\",\"country\":[{\"language\":\"fra\",\"value\":\"CMâttye\"},{\"language\":\"ara\",\"value\":\"دسييسيكدك\"},{\"language\":\"eng\",\"value\":\"Cmattey\"}],\"encodedPhoto\":\"data:image/jpeg;base64,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\",\"individualBiometrics\":{\"format\":\"cbeff\",\"version\":1,\"value\":\"individualBiometrics_bio_CBEFF\"},\"email\":\"siddhartha.km@gmail.com\",\"phone\":\"+919427357934\"}";
        ObjectMapper objectMapper = new ObjectMapper();

        identityData = objectMapper.readTree(jsonIdentity);
        ReflectionTestUtils.setField(authenticationService, "objectMapper", objectMapper);
        ReflectionTestUtils.setField(authenticationService,"psutField", "psut");

        oidcClaimsMap.put("fullName", "name");
        oidcClaimsMap.put("name", "name");
        oidcClaimsMap.put("email", "email");
        oidcClaimsMap.put("phone", "phone");
        oidcClaimsMap.put("gender", "gender");
        oidcClaimsMap.put("dateOfBirth","birthdate");
        oidcClaimsMap.put("encodedPhoto","picture");
        ReflectionTestUtils.setField(authenticationService, "oidcClaimsMapping", oidcClaimsMap);
    }

    @Test
    public void kycAuth_withValidKbiChallenge_thenPass() {

        List<Map<String,String>> fieldDetailList = List.of(Map.of("id","individualId","type","text","format","string")
                ,Map.of("id","fullName","type","text","format","")
                ,Map.of("id","dateOfBirth","type","date","format","yyyy-MM-dd"));
        ReflectionTestUtils.setField(authenticationService, "fieldDetailList", fieldDetailList);
        ReflectionTestUtils.setField(authenticationService, "fieldLang", "eng");
        ReflectionTestUtils.setField(authenticationService,"objectMapper",new ObjectMapper());

        KycAuthDto kycAuthDto = new KycAuthDto();
        kycAuthDto.setKbi("eyJmdWxsTmFtZSI6IlNpZGRoYXJ0aCBLIE1hbnNvdXIiLCJkYXRlT2ZCaXJ0aCI6IjE5ODctMTEtMjUifQ==");
        kycAuthDto.setIndividualId("individualId");
        kycAuthDto.setTransactionId("transactionId");

        IdentityData identityData = new IdentityData();
        identityData.setDateOfBirth("1987/11/25");
        LanguageValue languageValue = new LanguageValue();
        languageValue.setLanguage("eng");
        languageValue.setValue("Siddharth K Mansour");
        identityData.setFullName(List.of(languageValue));
        Mockito.when(identityService.getIdentityV2(Mockito.anyString())).thenReturn(this.identityData);

        Mockito.when(authRepository.save(Mockito.any())).thenReturn(new KycAuth());

        KycAuthResponseDto kycAuthResponseDto = authenticationService.kycAuth("relyingPartyId", "clientId", kycAuthDto);
        Assert.assertTrue(kycAuthResponseDto.isAuthStatus());
    }

    @Test
    public void kycAuth_withInvalidIdentity_thenFail() {
        KycAuthDto kycAuthDto = new KycAuthDto();
        kycAuthDto.setKbi("eyJmdWxsTmFtZSI6IlNpZGRoYXJ0aCBLIE1hbnNvdXIiLCJkYXRlT2ZCaXJ0aCI6IjE5ODctMTEtMjUifQ==");
        kycAuthDto.setIndividualId("individualId");
        kycAuthDto.setTransactionId("transactionId");
        Mockito.when(identityService.getIdentityV2(Mockito.anyString())).thenReturn(null);

        try{
            authenticationService.kycAuth("relyingPartyId", "clientId", kycAuthDto);
        }catch (MockIdentityException e){
            Assert.assertEquals("invalid_individual_id",e.getMessage());
        }
    }

    @Test
    public void kycAuth_withoutSendOTPInvocation_thenFail() {
        List<Map<String,String>> fieldDetailList = List.of(Map.of("id","individualId","type","text","format","string")
                ,Map.of("id","fullName","type","text","format","")
                ,Map.of("id","dateOfBirth","type","date","format","yyyy-MM-dd"));
        ReflectionTestUtils.setField(authenticationService, "fieldDetailList", fieldDetailList);
        ReflectionTestUtils.setField(authenticationService, "fieldLang", "eng");
        ReflectionTestUtils.setField(authenticationService,"objectMapper",new ObjectMapper());

        KycAuthDto kycAuthDto = new KycAuthDto();
        kycAuthDto.setOtp("111111");
        kycAuthDto.setIndividualId("individualId");
        kycAuthDto.setTransactionId("transactionId");

        IdentityData identityData = new IdentityData();
        identityData.setDateOfBirth("1987/11/25");
        LanguageValue languageValue = new LanguageValue();
        languageValue.setLanguage("eng");
        languageValue.setValue("Siddharth K Mansour");
        identityData.setFullName(List.of(languageValue));
        Mockito.when(identityService.getIdentityV2(Mockito.anyString())).thenReturn(this.identityData);
        try{
            authenticationService.kycAuth("relyingPartyId", "clientId", kycAuthDto);
        }catch (MockIdentityException e){
            Assert.assertEquals("invalid_transaction",e.getMessage());
        }
    }

    @Test
    public void kycAuth_withSendOTPInvocation_thenPass() {
        List<Map<String,String>> fieldDetailList = List.of(Map.of("id","individualId","type","text","format","string")
                ,Map.of("id","fullName","type","text","format","")
                ,Map.of("id","dateOfBirth","type","date","format","yyyy-MM-dd"));
        ReflectionTestUtils.setField(authenticationService,"otpChannels",Arrays.asList("email","phone"));
        ReflectionTestUtils.setField(authenticationService, "fieldDetailList", fieldDetailList);
        ReflectionTestUtils.setField(authenticationService, "fieldLang", "eng");
        ReflectionTestUtils.setField(authenticationService,"objectMapper",new ObjectMapper());

        KycAuthDto kycAuthDto = new KycAuthDto();
        kycAuthDto.setOtp("111111");
        kycAuthDto.setIndividualId("individualId");
        kycAuthDto.setTransactionId("transactionId");

        IdentityData identityData = new IdentityData();
        identityData.setDateOfBirth("1987/11/25");
        identityData.setIndividualId("individualId");
        identityData.setEmail("test@email.com");
        identityData.setPhone("1234567890");
        LanguageValue languageValue = new LanguageValue();
        languageValue.setLanguage("eng");
        languageValue.setValue("Siddharth K Mansour");
        identityData.setFullName(List.of(languageValue));
        SendOtpDto sendOtpDto=new SendOtpDto();
        sendOtpDto.setIndividualId("individualId");
        sendOtpDto.setOtpChannels(Arrays.asList("email","phone"));
        sendOtpDto.setTransactionId("transactionId");

        Mockito.when(identityService.getIdentity("individualId")).thenReturn(identityData);
        authenticationService.sendOtp("relyingPartyId", "clientId", sendOtpDto);
        Mockito.when(identityService.getIdentityV2(Mockito.anyString())).thenReturn(this.identityData);
        Mockito.when(authRepository.save(Mockito.any())).thenReturn(new KycAuth());
        when(cacheUtilService.getTransactionHash(Mockito.anyString())).thenReturn(true);

        KycAuthResponseDto kycAuthResponseDto = authenticationService.kycAuth("relyingPartyId", "clientId", kycAuthDto);
        Assert.assertTrue(kycAuthResponseDto.isAuthStatus());
    }

    @Test
    public void kycAuth_withInValidTransactionId_thenFail() {
        List<Map<String,String>> fieldDetailList = List.of(Map.of("id","individualId","type","text","format","string")
                ,Map.of("id","fullName","type","text","format","")
                ,Map.of("id","dateOfBirth","type","date","format","yyyy-MM-dd"));
        ReflectionTestUtils.setField(authenticationService, "fieldDetailList", fieldDetailList);
        ReflectionTestUtils.setField(authenticationService, "fieldLang", "eng");
        ReflectionTestUtils.setField(authenticationService,"objectMapper",new ObjectMapper());

        KycAuthDto kycAuthDto = new KycAuthDto();
        kycAuthDto.setOtp("111111");
        kycAuthDto.setIndividualId("individualId");
        kycAuthDto.setTransactionId("");

        IdentityData identityData = new IdentityData();
        identityData.setDateOfBirth("1987/11/25");
        LanguageValue languageValue = new LanguageValue();
        languageValue.setLanguage("eng");
        languageValue.setValue("Siddharth K Mansour");
        identityData.setFullName(List.of(languageValue));
        Mockito.when(identityService.getIdentityV2(Mockito.anyString())).thenReturn(this.identityData);
        try{
            authenticationService.kycAuth("relyingPartyId", "clientId", kycAuthDto);
        }catch (MockIdentityException e){
            Assert.assertEquals("invalid_transaction_id",e.getMessage());
        }
    }

    @Test
    public void kycAuth_withValidPinChallenge_thenPass() {

        List<Map<String,String>> fieldDetailList = List.of(Map.of("id","individualId","type","text","format","string")
                ,Map.of("id","fullName","type","text","format","")
                ,Map.of("id","dateOfBirth","type","date","format","yyyy-MM-dd"));
        ReflectionTestUtils.setField(authenticationService, "fieldDetailList", fieldDetailList);
        ReflectionTestUtils.setField(authenticationService, "fieldLang", "eng");
        ReflectionTestUtils.setField(authenticationService,"objectMapper",new ObjectMapper());

        KycAuthDto kycAuthDto = new KycAuthDto();
        kycAuthDto.setPin("111111");
        kycAuthDto.setIndividualId("individualId");
        kycAuthDto.setTransactionId("transactionId");

        IdentityData identityData = new IdentityData();
        identityData.setDateOfBirth("1987/11/25");
        LanguageValue languageValue = new LanguageValue();
        languageValue.setLanguage("eng");
        languageValue.setValue("Siddharth K Mansour");
        identityData.setFullName(List.of(languageValue));
        Mockito.when(identityService.getIdentityV2(Mockito.anyString())).thenReturn(this.identityData);
        Mockito.when(authRepository.save(Mockito.any())).thenReturn(new KycAuth());

        KycAuthResponseDto kycAuthResponseDto = authenticationService.kycAuth("relyingPartyId", "clientId", kycAuthDto);
        Assert.assertTrue(kycAuthResponseDto.isAuthStatus());
    }

    @Test
    public void kycAuth_withValidBiometricsChallenge_thenPass() {

        List<Map<String,String>> fieldDetailList = List.of(Map.of("id","individualId","type","text","format","string")
                ,Map.of("id","fullName","type","text","format","")
                ,Map.of("id","dateOfBirth","type","date","format","yyyy-MM-dd"));
        ReflectionTestUtils.setField(authenticationService, "fieldDetailList", fieldDetailList);
        ReflectionTestUtils.setField(authenticationService, "fieldLang", "eng");
        ReflectionTestUtils.setField(authenticationService,"objectMapper",new ObjectMapper());

        KycAuthDto kycAuthDto = new KycAuthDto();
        kycAuthDto.setBiometrics("111111");
        kycAuthDto.setTokens(new ArrayList<>());
        kycAuthDto.setIndividualId("individualId");
        kycAuthDto.setTransactionId("transactionId");

        IdentityData identityData = new IdentityData();
        identityData.setDateOfBirth("1987/11/25");
        LanguageValue languageValue = new LanguageValue();
        languageValue.setLanguage("eng");
        languageValue.setValue("Siddharth K Mansour");
        identityData.setFullName(List.of(languageValue));
        Mockito.when(identityService.getIdentityV2(Mockito.anyString())).thenReturn(this.identityData);
        Mockito.when(authRepository.save(Mockito.any())).thenReturn(new KycAuth());

        KycAuthResponseDto kycAuthResponseDto = authenticationService.kycAuth("relyingPartyId", "clientId", kycAuthDto);
        Assert.assertTrue(kycAuthResponseDto.isAuthStatus());
    }

    @Test
    public void kycAuth_withValidPwdChallenge_thenPass() {

        List<Map<String,String>> fieldDetailList = List.of(Map.of("id","individualId","type","text","format","string")
                ,Map.of("id","fullName","type","text","format","")
                ,Map.of("id","dateOfBirth","type","date","format","yyyy-MM-dd"));
        ReflectionTestUtils.setField(authenticationService, "fieldDetailList", fieldDetailList);
        ReflectionTestUtils.setField(authenticationService, "fieldLang", "eng");
        ReflectionTestUtils.setField(authenticationService,"objectMapper",new ObjectMapper());

        KycAuthDto kycAuthDto = new KycAuthDto();
        kycAuthDto.setPassword("Mosip@123");
        kycAuthDto.setIndividualId("individualId");
        kycAuthDto.setTransactionId("transactionId");

        IdentityData identityData = new IdentityData();
        identityData.setDateOfBirth("1987/11/25");
        identityData.setPassword("Mosip@123");
        LanguageValue languageValue = new LanguageValue();
        languageValue.setLanguage("eng");
        languageValue.setValue("Siddharth K Mansour");
        identityData.setFullName(List.of(languageValue));
        Mockito.when(identityService.getIdentityV2(Mockito.anyString())).thenReturn(this.identityData);

        KycAuthResponseDto kycAuthResponseDto = authenticationService.kycAuth("relyingPartyId", "clientId", kycAuthDto);
        Assert.assertNotNull(kycAuthResponseDto);
    }

    @Test
    public void kycAuth_withValidKbiChallengeCustomPSUTfield_thenPass() {
        List<Map<String,String>> fieldDetailList = List.of(Map.of("id","individualId","type","text","format","string")
                ,Map.of("id","fullName","type","text","format","")
                ,Map.of("id","dateOfBirth","type","date","format","yyyy-MM-dd"));
        ReflectionTestUtils.setField(authenticationService, "fieldDetailList", fieldDetailList);
        ReflectionTestUtils.setField(authenticationService, "fieldLang", "eng");
        ReflectionTestUtils.setField(authenticationService,"objectMapper",new ObjectMapper());
        // set the PSUT field to contain the individualId instead
        ReflectionTestUtils.setField(authenticationService,"psutField", "individualId");

        KycAuthDto kycAuthDto = new KycAuthDto();
        kycAuthDto.setKbi("eyJmdWxsTmFtZSI6IlNpZGRoYXJ0aCBLIE1hbnNvdXIiLCJkYXRlT2ZCaXJ0aCI6IjE5ODctMTEtMjUifQ==");
        kycAuthDto.setIndividualId("individualId");
        kycAuthDto.setTransactionId("transactionId");

        IdentityData identityData = new IdentityData();
        identityData.setDateOfBirth("1987/11/25");
        LanguageValue languageValue = new LanguageValue();
        languageValue.setLanguage("eng");
        languageValue.setValue("Siddharth K Mansour");
        identityData.setFullName(List.of(languageValue));
        Mockito.when(identityService.getIdentityV2(Mockito.anyString())).thenReturn(this.identityData);

        Mockito.when(authRepository.save(Mockito.any())).thenReturn(new KycAuth());

        KycAuthResponseDto kycAuthResponseDto = authenticationService.kycAuth("relyingPartyId", "clientId", kycAuthDto);
        Assert.assertEquals("8267411571", kycAuthResponseDto.getPartnerSpecificUserToken());
        Assert.assertTrue(kycAuthResponseDto.isAuthStatus());
    }

    @Test
    public void kycAuth_withInCorrectKbiChallenge_thenFail() {

        List<Map<String,String>> fieldDetailList = List.of(Map.of("id","individualId","type","text","format","")
                ,Map.of("id","fullName","type","text","format","")
                ,Map.of("id","dateOfBirth","type","date","format","yyyy-MM-dd"));
        ReflectionTestUtils.setField(authenticationService, "fieldDetailList", fieldDetailList);
        ReflectionTestUtils.setField(authenticationService, "fieldLang", "eng");
        ReflectionTestUtils.setField(authenticationService,"objectMapper",new ObjectMapper());
        KycAuthDto kycAuthDto = new KycAuthDto();
        kycAuthDto.setKbi("eyJmdWxsTmFtZSI6IlNpZGRoYXJ0aCBLIiwiZG9iIjoiMTk4Ny0xMS0yNSJ9");
        kycAuthDto.setIndividualId("individualId");
        kycAuthDto.setTransactionId("transactionId");

        IdentityData identityData = new IdentityData();
        identityData.setDateOfBirth("1987/11/25");
        LanguageValue languageValue = new LanguageValue();
        languageValue.setLanguage("eng");
        languageValue.setValue("Siddharth K Mansour");
        identityData.setFullName(List.of(languageValue));
        Mockito.when(identityService.getIdentityV2(Mockito.anyString())).thenReturn(this.identityData);

        //Mockito.when(authRepository.save(Mockito.any())).thenReturn(new KycAuth());

        KycAuthResponseDto kycAuthResponseDto = authenticationService.kycAuth("relyingPartyId", "clientId", kycAuthDto);
        Assert.assertFalse(kycAuthResponseDto.isAuthStatus());
    }

    @Test
    public void kycAuth_withInValidKbiChallenge_thenFail() {

        List<Map<String,String>> fieldDetailList = List.of(Map.of("id","individualId","type","text","format","")
                ,Map.of("id","fullName","type","text","format","")
                ,Map.of("id","dateOfBirth","type","date","format","yyyy-MM-dd"));
        ReflectionTestUtils.setField(authenticationService, "fieldDetailList", fieldDetailList);
        ReflectionTestUtils.setField(authenticationService, "fieldLang", "eng");
        ReflectionTestUtils.setField(authenticationService,"objectMapper",new ObjectMapper());

        KycAuthDto kycAuthDto = new KycAuthDto();
        kycAuthDto.setKbi("xsTmFtZSI6IlNpZG0aCBLIiwiZG9iIjoiMTk4Ny0xMS0yNSJ9");
        kycAuthDto.setIndividualId("individualId");
        kycAuthDto.setTransactionId("transactionId");

        IdentityData identityData = new IdentityData();
        identityData.setDateOfBirth("1987/11/25");
        LanguageValue languageValue = new LanguageValue();
        languageValue.setLanguage("eng");
        languageValue.setValue("Siddharth K Mansour");
        identityData.setFullName(List.of(languageValue));
        Mockito.when(identityService.getIdentityV2(Mockito.anyString())).thenReturn(this.identityData);
        try{
            authenticationService.kycAuth("relyingPartyId", "clientId", kycAuthDto);
        }catch (MockIdentityException e){
            Assert.assertEquals("auth-failed",e.getMessage());
        }
    }

    @Test
    public void kycAuth_withEmptyKbiChallenge_thenFail() {

        ReflectionTestUtils.setField(authenticationService, "fieldLang", "eng");
        ReflectionTestUtils.setField(authenticationService,"objectMapper",new ObjectMapper());

        KycAuthDto kycAuthDto = new KycAuthDto();
        kycAuthDto.setKbi("xsTmFtZSI6IlNpZG0aCBLIiwiZG9iIjoiMTk4Ny0xMS0yNSJ9");
        kycAuthDto.setIndividualId("individualId");
        kycAuthDto.setTransactionId("transactionId");

        IdentityData identityData = new IdentityData();
        identityData.setDateOfBirth("1987/11/25");
        LanguageValue languageValue = new LanguageValue();
        languageValue.setLanguage("eng");
        languageValue.setValue("Siddharth K Mansour");
        identityData.setFullName(List.of(languageValue));
        Mockito.when(identityService.getIdentityV2(Mockito.anyString())).thenReturn(this.identityData);
        try{
            authenticationService.kycAuth("relyingPartyId", "clientId", kycAuthDto);
        }catch (MockIdentityException e){
            Assert.assertEquals("auth-failed",e.getMessage());
        }
    }

    @Test
    public void sendOtp_validIndividualIdAndOtpChannels_thenPass() throws MockIdentityException {
        ReflectionTestUtils.setField(authenticationService,"otpChannels",Arrays.asList("email","phone"));
        String relyingPartyId = "relyingPartyId";
        String clientId = "clientId";
        String individualId = "individualId";
        SendOtpDto sendOtpDto=new SendOtpDto();
        sendOtpDto.setIndividualId("individualId");
        sendOtpDto.setOtpChannels(Arrays.asList("email","phone"));
        sendOtpDto.setTransactionId("transactionId");
        IdentityData identityData=new IdentityData();
        identityData.setIndividualId("individualId");
        identityData.setEmail("test@email.com");
        identityData.setPhone("1234567890");

        Mockito.when(identityService.getIdentity(individualId)).thenReturn(identityData);
        SendOtpResult result = authenticationService.sendOtp(relyingPartyId, clientId, sendOtpDto);

        Assert.assertNotNull(result);
        Assert.assertEquals(sendOtpDto.getTransactionId(), result.getTransactionId());
        Assert.assertEquals("XXXXXX7890", result.getMaskedMobile());
    }

    @Test
    public void sendOtp_invalidIndividualId_thenFail() {
        String relyingPartyId = "relyingPartyId";
        String clientId = "clientId";
        String individualId = "invalidId";
        SendOtpDto sendOtpDto=new SendOtpDto();
        sendOtpDto.setIndividualId(individualId);
        Mockito.when(identityService.getIdentity(individualId)).thenReturn(null);
        MockIdentityException exception = Assert.assertThrows(MockIdentityException.class, () -> {
            authenticationService.sendOtp(relyingPartyId, clientId, sendOtpDto);
        });
        Assert.assertEquals("invalid_individual_id", exception.getMessage());
    }

    @Test
    public void sendOtp_invalidOtpChannels_thenFail() {
        ReflectionTestUtils.setField(authenticationService,"otpChannels",Arrays.asList("email","phone"));
        String relyingPartyId = "relyingPartyId";
        String clientId = "clientId";
        String individualId = "individualId";
        SendOtpDto sendOtpDto=new SendOtpDto();
        sendOtpDto.setIndividualId("individualId");
        List<String> otpChannels = new ArrayList<>();
        otpChannels.add(null);

        sendOtpDto.setOtpChannels(otpChannels);
        sendOtpDto.setTransactionId("transactionId");
        IdentityData identityData=new IdentityData();
        identityData.setIndividualId("individualId");
        identityData.setEmail("test@email.com");
        identityData.setPhone("1234567890");

        Mockito.when(identityService.getIdentity(individualId)).thenReturn(identityData);

        MockIdentityException exception = Assert.assertThrows(MockIdentityException.class, () -> {
            authenticationService.sendOtp(relyingPartyId, clientId, sendOtpDto);
        });
        Assert.assertEquals("invalid_otp_channel", exception.getMessage());
    }

    @Test
    public void sendOtp_noEmailOrMobileFound_thenFail() {
        ReflectionTestUtils.setField(authenticationService,"otpChannels",Arrays.asList("email","phone"));
        String relyingPartyId = "relyingPartyId";
        String clientId = "clientId";
        String individualId = "individualId";

        SendOtpDto sendOtpDto=new SendOtpDto();
        sendOtpDto.setIndividualId("individualId");
        List<String> otpChannels = new ArrayList<>();
        otpChannels.add("email");
        otpChannels.add("phone");

        sendOtpDto.setOtpChannels(otpChannels);
        sendOtpDto.setTransactionId("transactionId");
        IdentityData identityData=new IdentityData();
        identityData.setIndividualId("individualId");
        identityData.setEmail(null);
        identityData.setPhone(null);
        Mockito.when(identityService.getIdentity(individualId)).thenReturn(identityData);
        try {
            authenticationService.sendOtp(relyingPartyId, clientId, sendOtpDto);
        }catch(MockIdentityException e) {
            Assert.assertEquals("no_email_mobile_found", e.getMessage());
        }
    }

    @Test
    public void kycExchange_withValidDetails_thenPass() throws MockIdentityException, JsonProcessingException {
        ReflectionTestUtils.setField(authenticationService,"transactionTimeoutInSecs",60);
        ReflectionTestUtils.setField(authenticationService,"objectMapper",objectMapper);
        String relyingPartyId = "relyingPartyId";
        String clientId = "clientId";

        KycExchangeRequestDto kycExchangeRequestDto=new KycExchangeRequestDto();
        kycExchangeRequestDto.setKycToken("kycToken");
        kycExchangeRequestDto.setIndividualId("individualId");
        kycExchangeRequestDto.setTransactionId("transactionId");
        kycExchangeRequestDto.setClaimLocales(Arrays.asList("en","fr"));
        kycExchangeRequestDto.setAcceptedClaims(Arrays.asList("name","gender"));

        kycExchangeRequestDto.setRequestDateTime(LocalDateTime.now());

        KycAuth kycAuth=new KycAuth();
        kycAuth.setResponseTime(LocalDateTime.now().minusSeconds(2));
        kycAuth.setPartnerSpecificUserToken("token");

        ObjectNode identityData = objectMapper.createObjectNode();
        identityData.put("gender", "Male");

        ArrayNode arrayNode = objectMapper.createArrayNode();
        ObjectNode fullNameEng = objectMapper.createObjectNode();
        fullNameEng.put("value", "Test");
        fullNameEng.put("language", "eng");
        ObjectNode fullNameFra = objectMapper.createObjectNode();
        fullNameFra.put("value", "Test_fra");
        fullNameFra.put("language", "fra");
        arrayNode.add(fullNameEng);
        arrayNode.add(fullNameFra);
        identityData.put("fullName", arrayNode);
        JWTSignatureResponseDto jwtSignatureResponseDto=new JWTSignatureResponseDto();
        jwtSignatureResponseDto.setJwtSignedData("signedData");

        Mockito.when(authRepository.findByKycTokenAndValidityAndTransactionIdAndIndividualId(
                Mockito.anyString(), eq(Valid.ACTIVE), Mockito.anyString(), Mockito.anyString()))
                .thenReturn(Optional.of(kycAuth));
        Mockito.when(identityService.getIdentityV2(Mockito.anyString())).thenReturn(identityData);
        Mockito.when(signatureService.jwtSign(Mockito.any())).thenReturn(jwtSignatureResponseDto);

        KycExchangeResponseDto response = authenticationService.kycExchange(relyingPartyId, clientId, new KycExchangeDto(kycExchangeRequestDto,null,"JWS"));
        Assert.assertNotNull(response);
        Assert.assertEquals("signedData", response.getKyc());
    }

    @Test
    public void kycExchange_withInValidJwe_thenFail() throws MockIdentityException, JsonProcessingException {
        ReflectionTestUtils.setField(authenticationService,"transactionTimeoutInSecs",60);
        ReflectionTestUtils.setField(authenticationService,"objectMapper",objectMapper);
        String relyingPartyId = "relyingPartyId";
        String clientId = "clientId";

        KycExchangeRequestDto kycExchangeRequestDto=new KycExchangeRequestDto();
        kycExchangeRequestDto.setKycToken("kycToken");
        kycExchangeRequestDto.setIndividualId("individualId");
        kycExchangeRequestDto.setTransactionId("transactionId");
        kycExchangeRequestDto.setClaimLocales(Arrays.asList("en","fr"));
        kycExchangeRequestDto.setAcceptedClaims(Arrays.asList("name","gender"));

        kycExchangeRequestDto.setRequestDateTime(LocalDateTime.now());

        KycAuth kycAuth=new KycAuth();
        kycAuth.setResponseTime(LocalDateTime.now().minusSeconds(2));
        kycAuth.setPartnerSpecificUserToken("token");

        ObjectNode identityData = objectMapper.createObjectNode();
        identityData.put("gender", "Male");

        ArrayNode arrayNode = objectMapper.createArrayNode();
        ObjectNode fullNameEng = objectMapper.createObjectNode();
        fullNameEng.put("value", "Test");
        fullNameEng.put("language", "eng");
        ObjectNode fullNameFra = objectMapper.createObjectNode();
        fullNameFra.put("value", "Test_fra");
        fullNameFra.put("language", "fra");
        arrayNode.add(fullNameEng);
        arrayNode.add(fullNameFra);
        identityData.put("fullName", arrayNode);
        JWTSignatureResponseDto jwtSignatureResponseDto=new JWTSignatureResponseDto();
        jwtSignatureResponseDto.setJwtSignedData("signedData");

        Mockito.when(authRepository.findByKycTokenAndValidityAndTransactionIdAndIndividualId(
                        Mockito.anyString(), eq(Valid.ACTIVE), Mockito.anyString(), Mockito.anyString()))
                .thenReturn(Optional.of(kycAuth));
        Mockito.when(identityService.getIdentityV2(Mockito.anyString())).thenReturn(identityData);
        Mockito.when(signatureService.jwtSign(Mockito.any())).thenReturn(jwtSignatureResponseDto);


        MockIdentityException exception = Assert.assertThrows(MockIdentityException.class, () -> {
            authenticationService.kycExchange(relyingPartyId, clientId, new KycExchangeDto(kycExchangeRequestDto,null,"JWE"));
        });
        Assert.assertEquals("mock-ida-008", exception.getMessage());
    }

    @Test
    public void kycExchange_invalidToken_thenFail() {
        String relyingPartyId = "relyingPartyId";
        String clientId = "clientId";
        KycExchangeRequestDto kycExchangeRequestDto=new KycExchangeRequestDto();
        MockIdentityException exception = Assert.assertThrows(MockIdentityException.class, () -> {
            authenticationService.kycExchange(relyingPartyId, clientId, new KycExchangeDto(kycExchangeRequestDto,null,"JWS"));
        });
        Assert.assertEquals("mock-ida-006", exception.getMessage());
    }

    @Test
    public void kycExchange_expiredTransaction_thenFail() {
        ReflectionTestUtils.setField(authenticationService,"transactionTimeoutInSecs",60);
        ReflectionTestUtils.setField(authenticationService,"objectMapper",objectMapper);
        String relyingPartyId = "relyingPartyId";
        String clientId = "clientId";

        KycExchangeRequestDto kycExchangeRequestDto=new KycExchangeRequestDto();
        kycExchangeRequestDto.setKycToken("kycToken");
        kycExchangeRequestDto.setIndividualId("individualId");
        kycExchangeRequestDto.setTransactionId("transactionId");
        kycExchangeRequestDto.setClaimLocales(Arrays.asList("en","fr"));
        kycExchangeRequestDto.setAcceptedClaims(Arrays.asList("name","gender"));

        kycExchangeRequestDto.setRequestDateTime(LocalDateTime.now());

        KycAuth kycAuth=new KycAuth();
        kycAuth.setResponseTime(LocalDateTime.now().minusSeconds(70));
        kycAuth.setPartnerSpecificUserToken("token");

        Mockito.when(authRepository.findByKycTokenAndValidityAndTransactionIdAndIndividualId(
                        Mockito.anyString(), eq(Valid.ACTIVE), Mockito.anyString(), Mockito.anyString()))
                .thenReturn(Optional.of(kycAuth));
        MockIdentityException exception = Assert.assertThrows(MockIdentityException.class, () -> {
            authenticationService.kycExchange(relyingPartyId, clientId, new KycExchangeDto(kycExchangeRequestDto,null,"JWS"));
        });
        Assert.assertEquals("mock-ida-007", exception.getMessage());
    }

    @Test
    public void kycExchange_invalidKycData_thenFail() {
        ReflectionTestUtils.setField(authenticationService,"transactionTimeoutInSecs",60);
        ReflectionTestUtils.setField(authenticationService,"objectMapper",objectMapper);
        String relyingPartyId = "relyingPartyId";
        String clientId = "clientId";

        KycExchangeRequestDto kycExchangeRequestDto=new KycExchangeRequestDto();
        kycExchangeRequestDto.setKycToken("kycToken");
        kycExchangeRequestDto.setIndividualId("individualId");
        kycExchangeRequestDto.setTransactionId("transactionId");
        kycExchangeRequestDto.setClaimLocales(Arrays.asList("en","fr"));
        kycExchangeRequestDto.setAcceptedClaims(Arrays.asList("name","gender"));

        kycExchangeRequestDto.setRequestDateTime(LocalDateTime.now());

        KycAuth kycAuth=new KycAuth();
        kycAuth.setResponseTime(LocalDateTime.now().minusSeconds(2));
        kycAuth.setPartnerSpecificUserToken("token");

        Mockito.when(authRepository.findByKycTokenAndValidityAndTransactionIdAndIndividualId(
                        Mockito.anyString(), eq(Valid.ACTIVE), Mockito.anyString(), Mockito.anyString()))
                .thenReturn(Optional.of(kycAuth));
        MockIdentityException exception = Assert.assertThrows(MockIdentityException.class, () -> {
            authenticationService.kycExchange(relyingPartyId, clientId, new KycExchangeDto(kycExchangeRequestDto,null,"JWS"));
        });
        Assert.assertEquals("mock-ida-008", exception.getMessage());
    }

    @Test
    public void kycExchangeV2_withDetail_thenPass()  {
        Map<String,String> oidcClaimsMap=new HashMap<>();
        oidcClaimsMap.put("name", "name");
        oidcClaimsMap.put("email", "email");
        oidcClaimsMap.put("phone", "phone");
        oidcClaimsMap.put("gender", "gender");
        oidcClaimsMap.put("dateOfBirth", "birthdate");
        oidcClaimsMap.put("encodedPhoto", "picture");
        ReflectionTestUtils.setField(authenticationService, "oidcClaimsMapping", oidcClaimsMap);
        ReflectionTestUtils.setField(authenticationService,"objectMapper",new ObjectMapper());

        IdentityData identityData = new IdentityData();
        identityData.setDateOfBirth("1987/11/25");
        LanguageValue languageValueName = new LanguageValue();
        languageValueName.setLanguage("eng");
        languageValueName.setValue("Siddharth K Mansour");
        identityData.setFullName(List.of(languageValueName));



        KycExchangeDto kycExchangeRequestDtoV2 = new KycExchangeDto();
        kycExchangeRequestDtoV2.setIndividualId("individualId");
        kycExchangeRequestDtoV2.setTransactionId("transactionId");

        //
        Map<String, JsonNode> acceptedClaims = new HashMap<>();

        // Add simple key-value pairs
        ObjectNode birthdate = objectMapper.createObjectNode();
        birthdate.put("essential", true);
        acceptedClaims.put("birthdate", birthdate);

        ObjectNode gender = objectMapper.createObjectNode();
        gender.put("essential", false);
        acceptedClaims.put("gender", gender);

        // Create a list for verified claims
        ArrayNode verifiedClaimsList = objectMapper.createArrayNode();

        // First verified claim
        ObjectNode verifiedClaim1 = objectMapper.createObjectNode();
        ObjectNode verification1 = objectMapper.createObjectNode();
        verification1.put("trust_framework", "pwd");
        verifiedClaim1.put("verification", verification1);

        ObjectNode claims1 = objectMapper.createObjectNode();
        claims1.put("email", NullNode.getInstance());
        claims1.put("birthdate", NullNode.getInstance());
        verifiedClaim1.put("claims", claims1);

        verifiedClaimsList.add(verifiedClaim1);

        // Second verified claim
        ObjectNode verifiedClaim2 = objectMapper.createObjectNode();
        ObjectNode verification2 = objectMapper.createObjectNode();
        verification2.put("trust_framework", "income-tax");
        verifiedClaim2.put("verification", verification2);

        ObjectNode claims2 = objectMapper.createObjectNode();
        claims2.put("name", NullNode.getInstance());
        claims2.put("email", NullNode.getInstance());
        claims2.put("gender", NullNode.getInstance());
        verifiedClaim2.put("claims", claims2);

        verifiedClaimsList.add(verifiedClaim2);

        // Third verified claim
        ObjectNode verifiedClaim3 = objectMapper.createObjectNode();
        ObjectNode verification3 = objectMapper.createObjectNode();
        verification3.put("trust_framework", NullNode.getInstance());
        verifiedClaim3.put("verification", verification3);

        ObjectNode claims3 = objectMapper.createObjectNode();
        claims3.put("email", NullNode.getInstance());
        claims3.put("birthdate", NullNode.getInstance());
        verifiedClaim3.put("claims", claims3);

        verifiedClaimsList.add(verifiedClaim3);
        ObjectNode addressClaim = objectMapper.createObjectNode();
        addressClaim.put("locality", NullNode.getInstance());

        // Add the list of verified claims to the outer map
        acceptedClaims.put("verified_claims", verifiedClaimsList);
        acceptedClaims.put("address",addressClaim);

        kycExchangeRequestDtoV2.setAcceptedClaimDetail(acceptedClaims);
        kycExchangeRequestDtoV2.setClaimLocales(List.of("eng"));
        kycExchangeRequestDtoV2.setRequestDateTime(LocalDateTime.now());

        KycAuth kycAuth = new KycAuth();
        kycAuth.setKycToken("kycToken");
        kycAuth.setTransactionId("transactionId");
        kycAuth.setIndividualId("individualId");
        kycAuth.setPartnerSpecificUserToken("partnerSpecificUserToken");
        kycAuth.setResponseTime(LocalDateTime.now());
        Optional<KycAuth> kycAuthOptional = Optional.of(kycAuth);
        Mockito.when(authRepository.findByKycTokenAndValidityAndTransactionIdAndIndividualId(Mockito.any(),
                                    Mockito.any(),Mockito.any(),Mockito.any())).thenReturn(kycAuthOptional);
        Mockito.when(authRepository.save(Mockito.any())).thenReturn(new KycAuth());

        Mockito.when(identityService.getIdentityV2(Mockito.anyString())).thenReturn(this.identityData);

        VerifiedClaim verifiedClaim = new VerifiedClaim();
        verifiedClaim.setTrustFramework("pwd");
        verifiedClaim.setClaim("name");

        VerifiedClaim verifiedClaim4=new VerifiedClaim();
        verifiedClaim4.setTrustFramework("pwd");
        verifiedClaim4.setClaim("email");

        VerifiedClaim verifiedClaim5=new VerifiedClaim();
        verifiedClaim5.setTrustFramework("pwd");
        verifiedClaim5.setClaim("birthdate");

        List<VerifiedClaim> verifiedClaimList =new ArrayList<>();
        verifiedClaimList.add(verifiedClaim);
        verifiedClaimList.add(verifiedClaim4);
        verifiedClaimList.add(verifiedClaim5);
        Optional<List<VerifiedClaim>> verifiedClaimsOptional = Optional.of(verifiedClaimList);


        //Mockito.when(verifiedClaimRepository.findByIndividualIdAndActive(Mockito.anyString(),Mockito.anyBoolean())).thenReturn(verifiedClaimsOptional);
        JWTSignatureResponseDto jwtSignatureResponseDto = new JWTSignatureResponseDto();
        jwtSignatureResponseDto.setJwtSignedData("jwtSignedData");
        Mockito.when(signatureService.jwtSign(Mockito.any())).thenReturn(jwtSignatureResponseDto);
        KycExchangeResponseDto kycExchangeResponseDto = authenticationService.kycExchange("relyingPartyId", "clientId", kycExchangeRequestDtoV2);
        Assert.assertEquals("jwtSignedData",kycExchangeResponseDto.getKyc());
    }

    @Test
    public void kycExchangeV2_withInValidIndividualId_thenFail() throws InvocationTargetException, IllegalAccessException, NoSuchMethodException {
        Map<String,String> oidcClaimsMap=new HashMap<>();
        oidcClaimsMap.put("name", "name");
        oidcClaimsMap.put("email", "email");
        oidcClaimsMap.put("phone", "phone");
        oidcClaimsMap.put("gender", "gender");
        oidcClaimsMap.put("dateOfBirth", "birthdate");
        oidcClaimsMap.put("encodedPhoto", "picture");
        ReflectionTestUtils.setField(authenticationService, "oidcClaimsMapping", oidcClaimsMap);

        KycExchangeDto kycExchangeRequestDtoV2 = new KycExchangeDto();
        kycExchangeRequestDtoV2.setIndividualId("individualId");
        kycExchangeRequestDtoV2.setTransactionId("transactionId");

        kycExchangeRequestDtoV2.setAcceptedClaimDetail(new HashMap<>());
        kycExchangeRequestDtoV2.setClaimLocales(List.of("eng"));
        kycExchangeRequestDtoV2.setRequestDateTime(LocalDateTime.now());

        KycAuth kycAuth = new KycAuth();
        kycAuth.setKycToken("kycToken");
        kycAuth.setTransactionId("transactionId");
        kycAuth.setIndividualId("individualId");
        kycAuth.setPartnerSpecificUserToken("partnerSpecificUserToken");
        kycAuth.setResponseTime(LocalDateTime.now());
        Optional<KycAuth> kycAuthOptional = Optional.of(kycAuth);
        Mockito.when(authRepository.findByKycTokenAndValidityAndTransactionIdAndIndividualId(Mockito.any(),
                Mockito.any(),Mockito.any(),Mockito.any())).thenReturn(kycAuthOptional);

        Mockito.when(identityService.getIdentityV2(Mockito.anyString())).thenReturn(null);

        try{
            authenticationService.kycExchange("relyingPartyId", "clientId", kycExchangeRequestDtoV2);
        }catch (MockIdentityException e){
            Assert.assertEquals("mock-ida-008",e.getMessage());
        }
    }

    @Test
    public void kycExchangeV2_withDetailAndMatchedClaims_thenPass() {
        Map<String, String> oidcClaimsMap = new HashMap<>();
        oidcClaimsMap.put("name", "name");
        oidcClaimsMap.put("email", "email");
        oidcClaimsMap.put("phone", "phone");
        oidcClaimsMap.put("gender", "gender");
        oidcClaimsMap.put("address", "address");
        oidcClaimsMap.put("dateOfBirth", "birthdate");
        oidcClaimsMap.put("encodedPhoto", "picture");
        ReflectionTestUtils.setField(authenticationService, "oidcClaimsMapping", oidcClaimsMap);
        ReflectionTestUtils.setField(authenticationService, "objectMapper", new ObjectMapper());

        // Create an IdentityData object
        IdentityData identityData = new IdentityData();
        identityData.setDateOfBirth("1987/11/25");
        LanguageValue languageValueGender = new LanguageValue();
        languageValueGender.setLanguage("eng");
        languageValueGender.setValue("Male");
        identityData.setGender(List.of(languageValueGender));

        LanguageValue languageValueName = new LanguageValue();
        languageValueName.setLanguage("eng");
        languageValueName.setValue("Siddharth K Mansour");
        identityData.setFullName(List.of(languageValueName));

        // Convert IdentityData to JsonNode
        ObjectMapper objectMapper = new ObjectMapper();
        JsonNode identityDataJsonNode = objectMapper.valueToTree(identityData);

        KycExchangeDto kycExchangeRequestDtoV2 = new KycExchangeDto();
        kycExchangeRequestDtoV2.setIndividualId("individualId");
        kycExchangeRequestDtoV2.setTransactionId("transactionId");

        Map<String, JsonNode> acceptedClaims = new HashMap<>();

        ObjectNode birthdate = objectMapper.createObjectNode();
        birthdate.put("essential", true);
        acceptedClaims.put("birthdate", birthdate);

        ObjectNode gender = objectMapper.createObjectNode();
        gender.put("essential", true);
        acceptedClaims.put("gender", gender);

        ObjectNode address = objectMapper.createObjectNode();
        address.put("essential", true);
        acceptedClaims.put("address", address);

        ObjectNode picture = objectMapper.createObjectNode();
        picture.put("essential", true);
        acceptedClaims.put("picture", picture);

        // Create a list for verified claims
        ArrayNode verifiedClaimsList = objectMapper.createArrayNode();

        // First verified claim with matching trust framework
        ObjectNode verifiedClaim1 = objectMapper.createObjectNode();
        ObjectNode verification1 = objectMapper.createObjectNode();
        verification1.put("trust_framework", "pwd");
        verifiedClaim1.put("verification", verification1);

        ObjectNode claims1 = objectMapper.createObjectNode();
        claims1.put("email", NullNode.getInstance());
        claims1.put("birthdate", NullNode.getInstance());
        verifiedClaim1.put("claims", claims1);
        verifiedClaimsList.add(verifiedClaim1);

        // Set up the second verified claim that should not match
        ObjectNode verifiedClaim2 = objectMapper.createObjectNode();
        ObjectNode verification2 = objectMapper.createObjectNode();
        verification2.put("trust_framework", "non_matching");
        verifiedClaim2.put("verification", verification2);

        ObjectNode claims2 = objectMapper.createObjectNode();
        claims2.put("name", NullNode.getInstance());
        claims2.put("email", NullNode.getInstance());
        verifiedClaim2.put("claims", claims2);
        verifiedClaimsList.add(verifiedClaim2);

        // Add the list of verified claims to the outer map
        acceptedClaims.put("verified_claims", verifiedClaimsList);
        kycExchangeRequestDtoV2.setAcceptedClaimDetail(acceptedClaims);
        kycExchangeRequestDtoV2.setClaimLocales(List.of("eng"));
        kycExchangeRequestDtoV2.setRequestDateTime(LocalDateTime.now());

        KycAuth kycAuth = new KycAuth();
        kycAuth.setKycToken("kycToken");
        kycAuth.setTransactionId("transactionId");
        kycAuth.setIndividualId("individualId");
        kycAuth.setPartnerSpecificUserToken("partnerSpecificUserToken");
        kycAuth.setResponseTime(LocalDateTime.now());
        Optional<KycAuth> kycAuthOptional = Optional.of(kycAuth);
        Mockito.when(authRepository.findByKycTokenAndValidityAndTransactionIdAndIndividualId(Mockito.any(),
                Mockito.any(), Mockito.any(), Mockito.any())).thenReturn(kycAuthOptional);
        Mockito.when(authRepository.save(Mockito.any())).thenReturn(new KycAuth());

        // Mock the identityService to return JsonNode
        Mockito.when(identityService.getIdentityV2(Mockito.anyString())).thenReturn(identityDataJsonNode);

        VerifiedClaim verifiedClaim = new VerifiedClaim();
        verifiedClaim.setTrustFramework("pwd");
        verifiedClaim.setClaim("email");

        VerifiedClaim verifiedClaim4 = new VerifiedClaim();
        verifiedClaim4.setTrustFramework("pwd");
        verifiedClaim4.setClaim("birthdate");

        List<VerifiedClaim> verifiedClaimList = new ArrayList<>();
        verifiedClaimList.add(verifiedClaim);
        verifiedClaimList.add(verifiedClaim4);
        Optional<List<VerifiedClaim>> verifiedClaimsOptional = Optional.of(verifiedClaimList);

        JWTSignatureResponseDto jwtSignatureResponseDto = new JWTSignatureResponseDto();
        jwtSignatureResponseDto.setJwtSignedData("jwtSignedData");
        Mockito.when(signatureService.jwtSign(Mockito.any())).thenReturn(jwtSignatureResponseDto);

        KycExchangeResponseDto kycExchangeResponseDto = authenticationService.kycExchange("relyingPartyId", "clientId", kycExchangeRequestDtoV2);
        Assert.assertEquals("jwtSignedData", kycExchangeResponseDto.getKyc());
    }

    @Test
    public void kycExchangeV2_withOutVerifiedClaims_thenPass() throws InvocationTargetException, IllegalAccessException, NoSuchMethodException {
        Map<String,String> oidcClaimsMap=new HashMap<>();
        oidcClaimsMap.put("name", "name");
        oidcClaimsMap.put("email", "email");
        oidcClaimsMap.put("phone", "phone");
        oidcClaimsMap.put("gender", "gender");
        oidcClaimsMap.put("dateOfBirth", "birthdate");
        oidcClaimsMap.put("encodedPhoto", "picture");
        ReflectionTestUtils.setField(authenticationService, "oidcClaimsMapping", oidcClaimsMap);
        ReflectionTestUtils.setField(authenticationService,"objectMapper",new ObjectMapper());

        IdentityData identityData = new IdentityData();
        identityData.setDateOfBirth("1987/11/25");
        LanguageValue languageValueName = new LanguageValue();
        languageValueName.setLanguage("eng");
        languageValueName.setValue("Siddharth K Mansour");
        identityData.setFullName(List.of(languageValueName));

        KycExchangeRequestDtoV2 kycExchangeRequestDtoV2 = new KycExchangeRequestDtoV2();
        kycExchangeRequestDtoV2.setIndividualId("individualId");
        kycExchangeRequestDtoV2.setTransactionId("transactionId");

        Map<String, JsonNode> acceptedClaims = new HashMap<>();

        // Add simple key-value pairs
        ObjectNode birthdate = objectMapper.createObjectNode();
        birthdate.put("essential", true);
        acceptedClaims.put("birthdate", birthdate);

        ObjectNode gender = objectMapper.createObjectNode();
        gender.put("essential", false);
        acceptedClaims.put("gender", gender);

        // Create a list for verified claims
        ArrayNode verifiedClaimsList = objectMapper.createArrayNode();

        // First verified claim
        ObjectNode verifiedClaim1 = objectMapper.createObjectNode();
        ObjectNode verification1 = objectMapper.createObjectNode();
        verification1.put("trust_framework", "pwd");
        verifiedClaim1.put("verification", verification1);

        ObjectNode claims1 = objectMapper.createObjectNode();
        claims1.put("email", NullNode.getInstance());
        claims1.put("birthdate", NullNode.getInstance());
        verifiedClaim1.put("claims", claims1);

        verifiedClaimsList.add(verifiedClaim1);

        // Second verified claim
        ObjectNode verifiedClaim2 = objectMapper.createObjectNode();
        ObjectNode verification2 =objectMapper.createObjectNode();
        verification2.put("trust_framework", "income-tax");
        verifiedClaim2.put("verification", verification2);

        ObjectNode claims2 = objectMapper.createObjectNode();
        claims2.put("name", NullNode.getInstance());
        claims2.put("email", NullNode.getInstance());
        claims2.put("gender", NullNode.getInstance());
        verifiedClaim2.put("claims", claims2);

        verifiedClaimsList.add(verifiedClaim2);

        // Third verified claim
        ObjectNode verifiedClaim3 = objectMapper.createObjectNode();
        ObjectNode verification3 = objectMapper.createObjectNode();
        verification3.put("trust_framework", NullNode.getInstance());
        verifiedClaim3.put("verification", verification3);

        ObjectNode claims3 =  objectMapper.createObjectNode();
        claims3.put("email", NullNode.getInstance());
        claims3.put("birthdate", NullNode.getInstance());
        verifiedClaim3.put("claims", claims3);

        verifiedClaimsList.add(verifiedClaim3);

        // Add the list of verified claims to the outer map
        acceptedClaims.put("verified_claims", verifiedClaimsList);

        kycExchangeRequestDtoV2.setAcceptedClaims(Arrays.asList("name"));
        kycExchangeRequestDtoV2.setClaimLocales(List.of("eng"));
        kycExchangeRequestDtoV2.setRequestDateTime(LocalDateTime.now());

        KycAuth kycAuth = new KycAuth();
        kycAuth.setKycToken("kycToken");
        kycAuth.setTransactionId("transactionId");
        kycAuth.setIndividualId("individualId");
        kycAuth.setPartnerSpecificUserToken("partnerSpecificUserToken");
        kycAuth.setResponseTime(LocalDateTime.now());
        Optional<KycAuth> kycAuthOptional = Optional.of(kycAuth);
        Mockito.when(authRepository.findByKycTokenAndValidityAndTransactionIdAndIndividualId(Mockito.any(),
                Mockito.any(),Mockito.any(),Mockito.any())).thenReturn(kycAuthOptional);
        Mockito.when(authRepository.save(Mockito.any())).thenReturn(new KycAuth());

        Mockito.when(identityService.getIdentityV2(Mockito.anyString())).thenReturn(this.identityData);

        JWTSignatureResponseDto jwtSignatureResponseDto = new JWTSignatureResponseDto();
        jwtSignatureResponseDto.setJwtSignedData("jwtSignedData");
        Mockito.when(signatureService.jwtSign(Mockito.any())).thenReturn(jwtSignatureResponseDto);
        KycExchangeResponseDto kycExchangeResponseDto = authenticationService.kycExchange("relyingPartyId", "clientId",
                new KycExchangeDto(kycExchangeRequestDtoV2, acceptedClaims,"JWS"));
        Assert.assertEquals("jwtSignedData",kycExchangeResponseDto.getKyc());
    }


    @Test
    public void kycAuth2_withValidKbiChallenge_thenPass() throws Exception {

        List<Map<String,String>> fieldDetailList = List.of(Map.of("id","individualId","type","text","format","string")
                ,Map.of("id","fullName","type","text","format","")
                ,Map.of("id","dateOfBirth","type","date","format","yyyy-MM-dd"));

        Map<String,String> oidcClaimsMap=new HashMap<>();
        oidcClaimsMap.put("name","name");
        oidcClaimsMap.put("email","email");
        oidcClaimsMap.put("dateOfBirth","birthdate");
        oidcClaimsMap.put("encodedPhoto","picture");
        oidcClaimsMap.put("gender","gender");
        oidcClaimsMap.put("phone","phone");

        ReflectionTestUtils.setField(authenticationService, "oidcClaimsMapping", oidcClaimsMap);
        ReflectionTestUtils.setField(authenticationService, "fieldDetailList", fieldDetailList);
        ReflectionTestUtils.setField(authenticationService, "fieldLang", "eng");
        ReflectionTestUtils.setField(authenticationService,"objectMapper",new ObjectMapper());

        KycAuthDto kycAuthDto = new KycAuthDto();
        kycAuthDto.setKbi("eyJmdWxsTmFtZSI6IlNpZGRoYXJ0aCBLIE1hbnNvdXIiLCJkYXRlT2ZCaXJ0aCI6IjE5ODctMTEtMjUifQ==");
        kycAuthDto.setIndividualId("individualId");
        kycAuthDto.setTransactionId("transactionId");

        IdentityData identityData = new IdentityData();
        identityData.setDateOfBirth("1987/11/25");
        LanguageValue languageValueFullName = new LanguageValue();
        languageValueFullName.setLanguage("eng");
        languageValueFullName.setValue("Siddharth K Mansour");
        identityData.setFullName(List.of(languageValueFullName));

         identityData.setEncodedPhoto("encodedPhoto");
        identityData.setDateOfBirth("1987/11/25");
        identityData.setEmail("email@gmail.com");

        Mockito.when(identityService.getIdentityV2(Mockito.anyString())).thenReturn(this.identityData);

        Mockito.when(authRepository.save(Mockito.any())).thenReturn(new KycAuth());

        List<VerifiedClaim> verifiedClaimList =new ArrayList<>();
        //fill this verifiedClaimList with some data
        VerifiedClaim verifiedClaimName = new VerifiedClaim();
        verifiedClaimName.setTrustFramework("trustFramework");
        verifiedClaimName.setClaim("name");
        verifiedClaimName.setIndividualId("individualId");
        verifiedClaimName.setIsActive(true);


        VerifiedClaim verifiedClaimEmail = new VerifiedClaim();
        verifiedClaimEmail.setTrustFramework("trustFramework");
        verifiedClaimEmail.setClaim("email");
        verifiedClaimEmail.setIndividualId("individualId");
        verifiedClaimEmail.setIsActive(true);

        verifiedClaimList.add(verifiedClaimName);
        verifiedClaimList.add(verifiedClaimEmail);


        Optional<List<VerifiedClaim>> verifiedClaimsOptional = Optional.of(verifiedClaimList);
        Mockito.when(verifiedClaimRepository.findByIndividualIdAndIsActive(Mockito.anyString(),Mockito.anyBoolean())).thenReturn(verifiedClaimsOptional);

        kycAuthDto.setClaimMetadataRequired(true);
        KycAuthResponseDto kycAuthResponseDtoV2 = authenticationService.kycAuth("relyingPartyId", "clientId", kycAuthDto);

        int oidcSupportedIdentityData =getOidcSupportedIdentityData(this.identityData,oidcClaimsMap);
        Map<String,List<JsonNode>> claimMetaData = kycAuthResponseDtoV2.getClaimMetadata();
        Assert.assertEquals(claimMetaData.size(),oidcSupportedIdentityData);

        Assert.assertTrue(claimMetaData.containsKey("email"));
        Assert.assertTrue(kycAuthResponseDtoV2.isAuthStatus());

    }


    @Test
    public void kycAuth2_withValidKbiChallenge_and_withOutVerifiedClaim_thenPass() throws Exception {

        List<Map<String,String>> fieldDetailList = List.of(Map.of("id","individualId","type","text","format","string")
                ,Map.of("id","fullName","type","text","format","")
                ,Map.of("id","dateOfBirth","type","date","format","yyyy-MM-dd"));

        ReflectionTestUtils.setField(authenticationService, "fieldDetailList", fieldDetailList);
        ReflectionTestUtils.setField(authenticationService, "fieldLang", "eng");

        KycAuthDto kycAuthDto = new KycAuthDto();
        kycAuthDto.setKbi("eyJmdWxsTmFtZSI6IlNpZGRoYXJ0aCBLIE1hbnNvdXIiLCJkYXRlT2ZCaXJ0aCI6IjE5ODctMTEtMjUifQ==");
        kycAuthDto.setIndividualId("individualId");
        kycAuthDto.setTransactionId("transactionId");

        IdentityData identityData = new IdentityData();
        identityData.setDateOfBirth("1987/11/25");
        LanguageValue languageValueFullName = new LanguageValue();
        languageValueFullName.setLanguage("eng");
        languageValueFullName.setValue("Siddharth K Mansour");
        identityData.setFullName(List.of(languageValueFullName));

        identityData.setEncodedPhoto("encodedPhoto");
        identityData.setDateOfBirth("1987/11/25");
        identityData.setEmail("email@gmail.com");

        Mockito.when(identityService.getIdentityV2(Mockito.anyString())).thenReturn(this.identityData);

        Mockito.when(authRepository.save(Mockito.any())).thenReturn(new KycAuth());

        Mockito.when(verifiedClaimRepository.findByIndividualIdAndIsActive(Mockito.anyString(),Mockito.anyBoolean())).thenReturn(Optional.empty());

        kycAuthDto.setClaimMetadataRequired(true);
        KycAuthResponseDto kycAuthResponseDtoV2 = authenticationService.kycAuth("relyingPartyId", "clientId", kycAuthDto);

        int oidcSupportedIdentityData = getOidcSupportedIdentityData(this.identityData,oidcClaimsMap);
        Map<String,List<JsonNode>> claimMetaData = kycAuthResponseDtoV2.getClaimMetadata();
        Assert.assertEquals(claimMetaData.size(),oidcSupportedIdentityData);

        Assert.assertTrue(claimMetaData.containsKey("email"));
        Assert.assertTrue(kycAuthResponseDtoV2.isAuthStatus());

    }


    private  int getOidcSupportedIdentityData(JsonNode identityData,Map<String,String> oidcClaimsMap) throws Exception {
        int oidcSupportedIdentityData=0;
        for(String claim :oidcClaimsMap.keySet()){
            if(getIdentityDataValue(identityData,claim,"eng")!=null)oidcSupportedIdentityData++;
        }
        return oidcSupportedIdentityData;
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
        for (JsonNode node : (ArrayNode) fieldValue) {
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
