package io.mosip.esignet.mock.identitysystem.service.impl;

import com.fasterxml.jackson.databind.ObjectMapper;
import io.mosip.esignet.mock.identitysystem.dto.IdentityData;
import io.mosip.esignet.mock.identitysystem.dto.KycAuthRequestDto;
import io.mosip.esignet.mock.identitysystem.dto.KycAuthResponseDto;
import io.mosip.esignet.mock.identitysystem.dto.LanguageValue;
import io.mosip.esignet.mock.identitysystem.entity.KycAuth;
import io.mosip.esignet.mock.identitysystem.exception.MockIdentityException;
import io.mosip.esignet.mock.identitysystem.repository.AuthRepository;
import io.mosip.esignet.mock.identitysystem.service.IdentityService;
import org.junit.Assert;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.Mockito;
import org.mockito.junit.MockitoJUnitRunner;
import org.springframework.test.util.ReflectionTestUtils;

import java.util.List;
import java.util.Map;

@RunWith(MockitoJUnitRunner.class)
public class AuthenticationServiceImplTest {

    @Mock
    IdentityService identityService;

    @Mock
    AuthRepository authRepository;

    @InjectMocks
    AuthenticationServiceImpl authenticationService;

    @Test
    public void kycAuth_withValidKbaChallenge_thenPass() {

        List<Map<String,String>> fieldDetailList = List.of(Map.of("id","policyNumber","type","string","format","string")
                ,Map.of("id","fullName","type","string","format","string")
                ,Map.of("id","dateOfBirth","type","string","format","date"));
        ReflectionTestUtils.setField(authenticationService, "fieldDetailList", fieldDetailList);
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

        List<Map<String,String>> fieldDetailList = List.of(Map.of("id","policyNumber","type","string","format","string")
                ,Map.of("id","fullName","type","string","format","string")
                ,Map.of("id","dateOfBirth","type","string","format","date"));
        ReflectionTestUtils.setField(authenticationService, "fieldDetailList", fieldDetailList);
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

        List<Map<String,String>> fieldDetailList = List.of(Map.of("id","policyNumber","type","string","format","string")
                ,Map.of("id","fullName","type","string","format","string")
                ,Map.of("id","dateOfBirth","type","string","format","date"));
        ReflectionTestUtils.setField(authenticationService, "fieldDetailList", fieldDetailList);
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
}
