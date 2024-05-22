package io.mosip.esignet.mock.identitysystem.service.impl;

import com.fasterxml.jackson.databind.ObjectMapper;
import io.mosip.esignet.mock.identitysystem.dto.*;
import io.mosip.esignet.mock.identitysystem.entity.KycAuth;
import io.mosip.esignet.mock.identitysystem.entity.VerifiedClaim;
import io.mosip.esignet.mock.identitysystem.exception.MockIdentityException;
import io.mosip.esignet.mock.identitysystem.repository.AuthRepository;
import io.mosip.esignet.mock.identitysystem.repository.VerifiedClaimRepository;
import io.mosip.esignet.mock.identitysystem.service.IdentityService;
import io.mosip.kernel.signature.dto.JWTSignatureResponseDto;
import io.mosip.kernel.signature.service.SignatureService;
import org.junit.Assert;
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

    @InjectMocks
    AuthenticationServiceImpl authenticationService;

    @Test
    public void kycAuth_withValidKbaChallenge_thenPass() {

        List<Map<String,String>> fieldDetailList = List.of(Map.of("id","individualId","type","text","format","string")
                ,Map.of("id","fullName","type","text","format","")
                ,Map.of("id","dateOfBirth","type","date","format","yyyy-MM-dd"));
        ReflectionTestUtils.setField(authenticationService, "fieldDetailList", fieldDetailList);
        ReflectionTestUtils.setField(authenticationService, "fieldLang", "eng");
        ReflectionTestUtils.setField(authenticationService,"objectMapper",new ObjectMapper());

        KycAuthRequestDto kycAuthRequestDto = new KycAuthRequestDto();
        kycAuthRequestDto.setKba("eyJmdWxsTmFtZSI6IlNpZGRoYXJ0aCBLIE1hbnNvdXIiLCJkYXRlT2ZCaXJ0aCI6IjE5ODctMTEtMjUifQ==");
        kycAuthRequestDto.setIndividualId("individualId");
        kycAuthRequestDto.setTransactionId("transactionId");

        IdentityData identityData = new IdentityData();
        identityData.setDateOfBirth("1987/11/25");
        LanguageValue languageValue = new LanguageValue();
        languageValue.setLanguage("eng");
        languageValue.setValue("Siddharth K Mansour");
        identityData.setFullName(List.of(languageValue));
        Mockito.when(identityService.getIdentity(Mockito.anyString())).thenReturn(identityData);

        Mockito.when(authRepository.save(Mockito.any())).thenReturn(new KycAuth());

        KycAuthResponseDto kycAuthResponseDto = authenticationService.kycAuth("relyingPartyId", "clientId", kycAuthRequestDto);
        Assert.assertTrue(kycAuthResponseDto.isAuthStatus());
    }

    @Test
    public void kycAuth_withInCorrectKbaChallenge_thenFail() {

        List<Map<String,String>> fieldDetailList = List.of(Map.of("id","individualId","type","text","format","")
                ,Map.of("id","fullName","type","text","format","")
                ,Map.of("id","dateOfBirth","type","date","format","yyyy-MM-dd"));
        ReflectionTestUtils.setField(authenticationService, "fieldDetailList", fieldDetailList);
        ReflectionTestUtils.setField(authenticationService, "fieldLang", "eng");
        ReflectionTestUtils.setField(authenticationService,"objectMapper",new ObjectMapper());
        KycAuthRequestDto kycAuthRequestDto = new KycAuthRequestDto();
        kycAuthRequestDto.setKba("eyJmdWxsTmFtZSI6IlNpZGRoYXJ0aCBLIiwiZG9iIjoiMTk4Ny0xMS0yNSJ9");
        kycAuthRequestDto.setIndividualId("individualId");
        kycAuthRequestDto.setTransactionId("transactionId");

        IdentityData identityData = new IdentityData();
        identityData.setDateOfBirth("1987/11/25");
        LanguageValue languageValue = new LanguageValue();
        languageValue.setLanguage("eng");
        languageValue.setValue("Siddharth K Mansour");
        identityData.setFullName(List.of(languageValue));
        Mockito.when(identityService.getIdentity(Mockito.anyString())).thenReturn(identityData);

        Mockito.when(authRepository.save(Mockito.any())).thenReturn(new KycAuth());

        KycAuthResponseDto kycAuthResponseDto = authenticationService.kycAuth("relyingPartyId", "clientId", kycAuthRequestDto);
        Assert.assertFalse(kycAuthResponseDto.isAuthStatus());
    }

    @Test
    public void kycAuth_withInValidKbaChallenge_thenFail() {

        List<Map<String,String>> fieldDetailList = List.of(Map.of("id","individualId","type","text","format","")
                ,Map.of("id","fullName","type","text","format","")
                ,Map.of("id","dateOfBirth","type","date","format","yyyy-MM-dd"));
        ReflectionTestUtils.setField(authenticationService, "fieldDetailList", fieldDetailList);
        ReflectionTestUtils.setField(authenticationService, "fieldLang", "eng");
        ReflectionTestUtils.setField(authenticationService,"objectMapper",new ObjectMapper());

        KycAuthRequestDto kycAuthRequestDto = new KycAuthRequestDto();
        kycAuthRequestDto.setKba("xsTmFtZSI6IlNpZG0aCBLIiwiZG9iIjoiMTk4Ny0xMS0yNSJ9");
        kycAuthRequestDto.setIndividualId("individualId");
        kycAuthRequestDto.setTransactionId("transactionId");

        IdentityData identityData = new IdentityData();
        identityData.setDateOfBirth("1987/11/25");
        LanguageValue languageValue = new LanguageValue();
        languageValue.setLanguage("eng");
        languageValue.setValue("Siddharth K Mansour");
        identityData.setFullName(List.of(languageValue));
        Mockito.when(identityService.getIdentity(Mockito.anyString())).thenReturn(identityData);
        try{
            authenticationService.kycAuth("relyingPartyId", "clientId", kycAuthRequestDto);
        }catch (MockIdentityException e){
            Assert.assertEquals("auth-failed",e.getMessage());
        }
    }

    @Test
    public void kycExchangeV2_withDetail_thenPass() throws InvocationTargetException, IllegalAccessException, NoSuchMethodException {
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
        identityData.setName(List.of(languageValueName));



        KycExchangeRequestDtoV2 kycExchangeRequestDtoV2 = new KycExchangeRequestDtoV2();
        kycExchangeRequestDtoV2.setIndividualId("individualId");
        kycExchangeRequestDtoV2.setTransactionId("transactionId");

        //
        Map<String, Object> acceptedClaims = new HashMap<>();

        // Add simple key-value pairs
        Map<String, Boolean> birthdate = new HashMap<>();
        birthdate.put("essential", true);
        acceptedClaims.put("birthdate", birthdate);

        Map<String, Boolean> gender = new HashMap<>();
        gender.put("essential", false);
        acceptedClaims.put("gender", gender);

        // Create a list for verified claims
        List<Map<String, Object>> verifiedClaimsList = new ArrayList<>();

        // First verified claim
        Map<String, Object> verifiedClaim1 = new HashMap<>();
        Map<String, String> verification1 = new HashMap<>();
        verification1.put("trust_framework", "pwd");
        verifiedClaim1.put("verification", verification1);

        Map<String, Object> claims1 = new HashMap<>();
        claims1.put("email", null);
        claims1.put("birthdate", null);
        verifiedClaim1.put("claims", claims1);

        verifiedClaimsList.add(verifiedClaim1);

        // Second verified claim
        Map<String, Object> verifiedClaim2 = new HashMap<>();
        Map<String, String> verification2 = new HashMap<>();
        verification2.put("trust_framework", "income-tax");
        verifiedClaim2.put("verification", verification2);

        Map<String, Object> claims2 = new HashMap<>();
        claims2.put("name", null);
        claims2.put("email", null);
        claims2.put("gender", null);
        verifiedClaim2.put("claims", claims2);

        verifiedClaimsList.add(verifiedClaim2);

        // Third verified claim
        Map<String, Object> verifiedClaim3 = new HashMap<>();
        Map<String, String> verification3 = new HashMap<>();
        verification3.put("trust_framework", null);
        verifiedClaim3.put("verification", verification3);

        Map<String, Object> claims3 = new HashMap<>();
        claims3.put("email", null);
        claims3.put("birthdate", null);
        verifiedClaim3.put("claims", claims3);

        verifiedClaimsList.add(verifiedClaim3);

        // Add the list of verified claims to the outer map
        acceptedClaims.put("verified_claims", verifiedClaimsList);

        kycExchangeRequestDtoV2.setAcceptedClaims(acceptedClaims);
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

        Mockito.when(identityService.getIdentity(Mockito.anyString())).thenReturn(identityData);

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


        Mockito.when(verifiedClaimRepository.findByIndividualIdAndActive(Mockito.anyString(),Mockito.anyBoolean())).thenReturn(verifiedClaimsOptional);
        JWTSignatureResponseDto jwtSignatureResponseDto = new JWTSignatureResponseDto();
        jwtSignatureResponseDto.setJwtSignedData("jwtSignedData");
        Mockito.when(signatureService.jwtSign(Mockito.any())).thenReturn(jwtSignatureResponseDto);
        KycExchangeResponseDto kycExchangeResponseDto = authenticationService.kycExchangeV2("relyingPartyId", "clientId", kycExchangeRequestDtoV2);
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



        KycExchangeRequestDtoV2 kycExchangeRequestDtoV2 = new KycExchangeRequestDtoV2();
        kycExchangeRequestDtoV2.setIndividualId("individualId");
        kycExchangeRequestDtoV2.setTransactionId("transactionId");


        kycExchangeRequestDtoV2.setAcceptedClaims(new HashMap<>());
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

        Mockito.when(identityService.getIdentity(Mockito.anyString())).thenReturn(null);

        try{
            authenticationService.kycExchangeV2("relyingPartyId", "clientId", kycExchangeRequestDtoV2);
        }catch (MockIdentityException e){
            Assert.assertEquals("mock-ida-008",e.getMessage());
        }
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
        identityData.setName(List.of(languageValueName));

        KycExchangeRequestDtoV2 kycExchangeRequestDtoV2 = new KycExchangeRequestDtoV2();
        kycExchangeRequestDtoV2.setIndividualId("individualId");
        kycExchangeRequestDtoV2.setTransactionId("transactionId");

        //
        Map<String, Object> acceptedClaims = new HashMap<>();

        // Add simple key-value pairs
        Map<String, Boolean> birthdate = new HashMap<>();
        birthdate.put("essential", true);
        acceptedClaims.put("birthdate", birthdate);

        Map<String, Boolean> gender = new HashMap<>();
        gender.put("essential", false);
        acceptedClaims.put("gender", gender);

        // Create a list for verified claims
        List<Map<String, Object>> verifiedClaimsList = new ArrayList<>();

        // First verified claim
        Map<String, Object> verifiedClaim1 = new HashMap<>();
        Map<String, String> verification1 = new HashMap<>();
        verification1.put("trust_framework", "pwd");
        verifiedClaim1.put("verification", verification1);

        Map<String, Object> claims1 = new HashMap<>();
        claims1.put("email", null);
        claims1.put("birthdate", null);
        verifiedClaim1.put("claims", claims1);

        verifiedClaimsList.add(verifiedClaim1);

        // Second verified claim
        Map<String, Object> verifiedClaim2 = new HashMap<>();
        Map<String, String> verification2 = new HashMap<>();
        verification2.put("trust_framework", "income-tax");
        verifiedClaim2.put("verification", verification2);

        Map<String, Object> claims2 = new HashMap<>();
        claims2.put("name", null);
        claims2.put("email", null);
        claims2.put("gender", null);
        verifiedClaim2.put("claims", claims2);

        verifiedClaimsList.add(verifiedClaim2);

        // Third verified claim
        Map<String, Object> verifiedClaim3 = new HashMap<>();
        Map<String, String> verification3 = new HashMap<>();
        verification3.put("trust_framework", null);
        verifiedClaim3.put("verification", verification3);

        Map<String, Object> claims3 = new HashMap<>();
        claims3.put("email", null);
        claims3.put("birthdate", null);
        verifiedClaim3.put("claims", claims3);

        verifiedClaimsList.add(verifiedClaim3);

        // Add the list of verified claims to the outer map
        acceptedClaims.put("verified_claims", verifiedClaimsList);

        kycExchangeRequestDtoV2.setAcceptedClaims(acceptedClaims);
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

        Mockito.when(identityService.getIdentity(Mockito.anyString())).thenReturn(identityData);

        Mockito.when(verifiedClaimRepository.findByIndividualIdAndActive(Mockito.anyString(),Mockito.anyBoolean())).thenReturn(Optional.empty());
        JWTSignatureResponseDto jwtSignatureResponseDto = new JWTSignatureResponseDto();
        jwtSignatureResponseDto.setJwtSignedData("jwtSignedData");
        Mockito.when(signatureService.jwtSign(Mockito.any())).thenReturn(jwtSignatureResponseDto);
        KycExchangeResponseDto kycExchangeResponseDto = authenticationService.kycExchangeV2("relyingPartyId", "clientId", kycExchangeRequestDtoV2);
        Assert.assertEquals("jwtSignedData",kycExchangeResponseDto.getKyc());
    }

}
