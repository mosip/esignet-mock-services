package io.mosip.esignet.mock.identitysystem.service.impl;

import com.fasterxml.jackson.databind.ObjectMapper;
import io.mosip.esignet.mock.identitysystem.dto.*;
import io.mosip.esignet.mock.identitysystem.entity.KycAuth;
import io.mosip.esignet.mock.identitysystem.entity.VerifiedClaim;
import io.mosip.esignet.mock.identitysystem.exception.MockIdentityException;
import io.mosip.esignet.mock.identitysystem.repository.AuthRepository;
import io.mosip.esignet.mock.identitysystem.repository.VerifiedClaimRepository;
import io.mosip.esignet.mock.identitysystem.service.IdentityService;
import org.junit.Assert;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.Mockito;
import org.mockito.junit.MockitoJUnitRunner;
import org.springframework.test.util.ReflectionTestUtils;

import java.lang.reflect.Field;
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

    @InjectMocks
    AuthenticationServiceImpl authenticationService;

    @Test
    public void kycAuth_withValidKbiChallenge_thenPass() {

        List<Map<String,String>> fieldDetailList = List.of(Map.of("id","individualId","type","text","format","string")
                ,Map.of("id","fullName","type","text","format","")
                ,Map.of("id","dateOfBirth","type","date","format","yyyy-MM-dd"));
        ReflectionTestUtils.setField(authenticationService, "fieldDetailList", fieldDetailList);
        ReflectionTestUtils.setField(authenticationService, "fieldLang", "eng");
        ReflectionTestUtils.setField(authenticationService,"objectMapper",new ObjectMapper());

        KycAuthRequestDto kycAuthRequestDto = new KycAuthRequestDto();
        kycAuthRequestDto.setKbi("eyJmdWxsTmFtZSI6IlNpZGRoYXJ0aCBLIE1hbnNvdXIiLCJkYXRlT2ZCaXJ0aCI6IjE5ODctMTEtMjUifQ==");
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
    public void kycAuth_withInCorrectKbiChallenge_thenFail() {

        List<Map<String,String>> fieldDetailList = List.of(Map.of("id","individualId","type","text","format","")
                ,Map.of("id","fullName","type","text","format","")
                ,Map.of("id","dateOfBirth","type","date","format","yyyy-MM-dd"));
        ReflectionTestUtils.setField(authenticationService, "fieldDetailList", fieldDetailList);
        ReflectionTestUtils.setField(authenticationService, "fieldLang", "eng");
        ReflectionTestUtils.setField(authenticationService,"objectMapper",new ObjectMapper());
        KycAuthRequestDto kycAuthRequestDto = new KycAuthRequestDto();
        kycAuthRequestDto.setKbi("eyJmdWxsTmFtZSI6IlNpZGRoYXJ0aCBLIiwiZG9iIjoiMTk4Ny0xMS0yNSJ9");
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
    public void kycAuth_withInValidKbiChallenge_thenFail() {

        List<Map<String,String>> fieldDetailList = List.of(Map.of("id","individualId","type","text","format","")
                ,Map.of("id","fullName","type","text","format","")
                ,Map.of("id","dateOfBirth","type","date","format","yyyy-MM-dd"));
        ReflectionTestUtils.setField(authenticationService, "fieldDetailList", fieldDetailList);
        ReflectionTestUtils.setField(authenticationService, "fieldLang", "eng");
        ReflectionTestUtils.setField(authenticationService,"objectMapper",new ObjectMapper());

        KycAuthRequestDto kycAuthRequestDto = new KycAuthRequestDto();
        kycAuthRequestDto.setKbi("xsTmFtZSI6IlNpZG0aCBLIiwiZG9iIjoiMTk4Ny0xMS0yNSJ9");
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
    public void kycAuth2_withValidKbaChallenge_thenPass() throws Exception {

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

        KycAuthRequestDto kycAuthRequestDto = new KycAuthRequestDto();
        kycAuthRequestDto.setKba("eyJmdWxsTmFtZSI6IlNpZGRoYXJ0aCBLIE1hbnNvdXIiLCJkYXRlT2ZCaXJ0aCI6IjE5ODctMTEtMjUifQ==");
        kycAuthRequestDto.setIndividualId("individualId");
        kycAuthRequestDto.setTransactionId("transactionId");

        IdentityData identityData = new IdentityData();
        identityData.setDateOfBirth("1987/11/25");
        LanguageValue languageValueFullName = new LanguageValue();
        languageValueFullName.setLanguage("eng");
        languageValueFullName.setValue("Siddharth K Mansour");
        identityData.setFullName(List.of(languageValueFullName));

        LanguageValue languageValueName = new LanguageValue();
        languageValueName.setLanguage("eng");
        languageValueName.setValue("Siddharth");
        identityData.setName(List.of(languageValueName));

        identityData.setEncodedPhoto("encodedPhoto");
        identityData.setDateOfBirth("1987/11/25");
        identityData.setEmail("email@gmail.com");

        Mockito.when(identityService.getIdentity(Mockito.anyString())).thenReturn(identityData);

        Mockito.when(authRepository.save(Mockito.any())).thenReturn(new KycAuth());

        List<VerifiedClaim> verifiedClaimList =new ArrayList<>();
        //fill this verifiedClaimList with some data
        VerifiedClaim verifiedClaimName = new VerifiedClaim();
        verifiedClaimName.setTrustFramework("trustFramework");
        verifiedClaimName.setClaim("name");
        verifiedClaimName.setIndividualId("individualId");
        verifiedClaimName.setActive(true);
        verifiedClaimName.setVerifiedDateTime(LocalDateTime.now());

        VerifiedClaim verifiedClaimEmail = new VerifiedClaim();
        verifiedClaimEmail.setTrustFramework("trustFramework");
        verifiedClaimEmail.setClaim("email");
        verifiedClaimEmail.setIndividualId("individualId");
        verifiedClaimEmail.setActive(true);
        verifiedClaimEmail.setVerifiedDateTime(LocalDateTime.now());

        verifiedClaimList.add(verifiedClaimName);
        verifiedClaimList.add(verifiedClaimEmail);


        Optional<List<VerifiedClaim>> verifiedClaimsOptional = Optional.of(verifiedClaimList);
        Mockito.when(verifiedClaimRepository.findByIndividualIdAndActive(Mockito.anyString(),Mockito.anyBoolean())).thenReturn(verifiedClaimsOptional);

        KycAuthResponseDtoV2 kycAuthResponseDtoV2 = authenticationService.kycAuthV2("relyingPartyId", "clientId", kycAuthRequestDto);

        int oidcSupportedIdentityData =getOidcSupportedIdentityData(identityData,oidcClaimsMap);
        List<ClaimMetadata> claimMetadataList = kycAuthResponseDtoV2.getClaimMetadataList();
        Assert.assertEquals(claimMetadataList.size(),oidcSupportedIdentityData);

        Assert.assertTrue(claimMetadataList.stream()
                .anyMatch(metadata -> metadata.getClaim().equals("email")));
        Assert.assertTrue(kycAuthResponseDtoV2.isAuthStatus());

    }


    @Test
    public void kycAuth2_withValidKbaChallenge_and_withOutVerifiedClaim_thenPass() throws Exception {

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

        KycAuthRequestDto kycAuthRequestDto = new KycAuthRequestDto();
        kycAuthRequestDto.setKba("eyJmdWxsTmFtZSI6IlNpZGRoYXJ0aCBLIE1hbnNvdXIiLCJkYXRlT2ZCaXJ0aCI6IjE5ODctMTEtMjUifQ==");
        kycAuthRequestDto.setIndividualId("individualId");
        kycAuthRequestDto.setTransactionId("transactionId");

        IdentityData identityData = new IdentityData();
        identityData.setDateOfBirth("1987/11/25");
        LanguageValue languageValueFullName = new LanguageValue();
        languageValueFullName.setLanguage("eng");
        languageValueFullName.setValue("Siddharth K Mansour");
        identityData.setFullName(List.of(languageValueFullName));

        LanguageValue languageValueName = new LanguageValue();
        languageValueName.setLanguage("eng");
        languageValueName.setValue("Siddharth");
        identityData.setName(List.of(languageValueName));

        identityData.setEncodedPhoto("encodedPhoto");
        identityData.setDateOfBirth("1987/11/25");
        identityData.setEmail("email@gmail.com");

        Mockito.when(identityService.getIdentity(Mockito.anyString())).thenReturn(identityData);

        Mockito.when(authRepository.save(Mockito.any())).thenReturn(new KycAuth());

        Mockito.when(verifiedClaimRepository.findByIndividualIdAndActive(Mockito.anyString(),Mockito.anyBoolean())).thenReturn(Optional.empty());

        KycAuthResponseDtoV2 kycAuthResponseDtoV2 = authenticationService.kycAuthV2("relyingPartyId", "clientId", kycAuthRequestDto);

        int oidcSupportedIdentityData =getOidcSupportedIdentityData(identityData,oidcClaimsMap);
        List<ClaimMetadata> claimMetadataList = kycAuthResponseDtoV2.getClaimMetadataList();
        Assert.assertEquals(claimMetadataList.size(),oidcSupportedIdentityData);

        Assert.assertTrue(claimMetadataList.stream()
                .anyMatch(metadata -> metadata.getClaim().equals("email")));
        Assert.assertTrue(kycAuthResponseDtoV2.isAuthStatus());

    }

    private  int getOidcSupportedIdentityData(IdentityData identityData,Map<String,String> oidcClaimsMap) throws Exception {
        int oidcSupportedIdentityData=0;
        for(String claim :oidcClaimsMap.keySet()){
           if(getIdentityDataFieldValue(identityData,claim)!=null)oidcSupportedIdentityData++;
        }
     return oidcSupportedIdentityData;
    }


    private String getIdentityDataFieldValue(IdentityData identityData,String challengeField) throws Exception {
        Field field = identityData.getClass().getDeclaredField(challengeField);
        field.setAccessible(true);
        Object fieldValue = field.get(identityData);
        if(fieldValue instanceof List){
            List<LanguageValue> languageValues = (List<LanguageValue>) fieldValue;
            for(LanguageValue languageValue:languageValues){
                if(languageValue.getLanguage().equals("eng")){
                    return languageValue.getValue();
                }
            }
        }
        return (String) fieldValue;
    }
}
