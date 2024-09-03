package io.mosip.esignet.mock.identitysystem.service.impl;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import io.mosip.esignet.mock.identitysystem.dto.IdentityData;
import io.mosip.esignet.mock.identitysystem.dto.VerifiedClaimRequestDto;
import io.mosip.esignet.mock.identitysystem.entity.MockIdentity;
import io.mosip.esignet.mock.identitysystem.exception.MockIdentityException;
import io.mosip.esignet.mock.identitysystem.repository.IdentityRepository;
import io.mosip.esignet.mock.identitysystem.repository.VerifiedClaimRepository;
import io.mosip.esignet.mock.identitysystem.util.ErrorConstants;
import org.junit.Assert;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.Mockito;
import org.mockito.junit.MockitoJUnitRunner;
import org.springframework.test.util.ReflectionTestUtils;

import java.time.LocalDateTime;
import java.util.Optional;

import static org.junit.Assert.assertEquals;
import static org.junit.Assert.assertThrows;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

@RunWith(MockitoJUnitRunner.class)
public class IdentityServiceTest {

    @Mock
    VerifiedClaimRepository verifiedClaimRepository;

    @Mock
    IdentityRepository identityRepository;

    @Mock
    ObjectMapper objectMapper;

    @InjectMocks
    IdentityServiceImpl identityService;


    
    @Test
    public void addVerifiedClaim_withValidDetails_thenPass() throws Exception {
        ReflectionTestUtils.setField(identityService, "fieldLang", "eng");
        ReflectionTestUtils.setField(identityService, "objectmapper", new ObjectMapper());
        VerifiedClaimRequestDto requestDto = new VerifiedClaimRequestDto();
        requestDto.setTrustFramework("trust_framework");
        requestDto.setClaim("email");
        requestDto.setIndividualId("123456");
        requestDto.setVerifiedDateTime(LocalDateTime.now());

        IdentityData identityData = new IdentityData();
        identityData.setEmail("email@gmail.com");
        identityData.setEncodedPhoto("encodedPhoto");

        MockIdentity mockIdentity = new MockIdentity();
        mockIdentity.setIndividualId("123456");
        mockIdentity.setIdentityJson("{\"individualId\":\"8267411571\",\"pin\":\"111111\",\"fullName\":[{\"language\":\"fra\",\"value\":\"Siddharth K Mansour\"},{\"language\":\"ara\",\"value\":\"تتگلدكنسَزقهِقِفل دسييسيكدكنوڤو\"},{\"language\":\"eng\",\"value\":\"Siddharth K Mansour\"}],\"email\":\"siddhartha.km@gmail.com\",\"phone\":\"+919427357934\"}");
        Mockito.when(verifiedClaimRepository.findById(Mockito.anyString())).thenReturn(Optional.empty());
        Mockito.when(identityRepository.findById(Mockito.anyString())).thenReturn(Optional.of(mockIdentity));
        identityService.addVerifiedClaim(requestDto);
    }

    @Test
    public void addVerifiedClaim_withInValidIndividualId_thenFail()  {
        VerifiedClaimRequestDto requestDto = new VerifiedClaimRequestDto();
        requestDto.setTrustFramework("trust_framework");
        requestDto.setClaim("claim");
        requestDto.setIndividualId("123456");
        requestDto.setVerifiedDateTime(LocalDateTime.now());

        Mockito.when(identityRepository.findById(Mockito.anyString())).thenReturn(Optional.empty());

        try{
            identityService.addVerifiedClaim(requestDto);
        }catch (MockIdentityException e){
            Assert.assertEquals(ErrorConstants.INVALID_INDIVIDUAL_ID,e.getErrorCode());
        }

    }

    @Test
    public void addIdentity_withValidDetails_thenPass() throws MockIdentityException, JsonProcessingException {
        IdentityData identityData = new IdentityData();
        identityData.setEmail("email@gmail.com");
        identityData.setEncodedPhoto("encodedPhoto");
        when(identityRepository.findById(identityData.getIndividualId())).thenReturn(Optional.empty());
        when(objectMapper.writeValueAsString(identityData)).thenReturn("{}");
        identityService.addIdentity(identityData);
        verify(identityRepository).save(any(MockIdentity.class));
    }

    @Test
    public void addIdentity_throwsJsonProcessingException_thenFail() throws JsonProcessingException {
        IdentityData identityData = new IdentityData();
        identityData.setEmail("email@gmail.com");
        identityData.setEncodedPhoto("encodedPhoto");
        when(objectMapper.writeValueAsString(identityData)).thenThrow(JsonProcessingException.class);
        MockIdentityException exception = assertThrows(MockIdentityException.class, () -> {
            identityService.addIdentity(identityData);
        });
        assertEquals(ErrorConstants.JSON_PROCESSING_ERROR, exception.getMessage());
    }

    @Test
    public void getIdentity_withValidDetails_thenPass() throws MockIdentityException, JsonProcessingException {
        IdentityData identityData = new IdentityData();
        identityData.setEmail("email@gmail.com");
        identityData.setEncodedPhoto("encodedPhoto");
        MockIdentity mockIdentity = new MockIdentity();
        mockIdentity.setIndividualId("123456");
        mockIdentity.setIdentityJson("{\"individualId\":\"8267411571\",\"pin\":\"111111\",\"fullName\":[{\"language\":\"fra\",\"value\":\"Siddharth K Mansour\"},{\"language\":\"ara\",\"value\":\"تتگلدكنسَزقهِقِفل دسييسيكدكنوڤو\"},{\"language\":\"eng\",\"value\":\"Siddharth K Mansour\"}],\"email\":\"siddhartha.km@gmail.com\",\"phone\":\"+919427357934\"}");
        mockIdentity.setIdentityJson("{}");
        when(identityRepository.findById(identityData.getIndividualId())).thenReturn(Optional.of(mockIdentity));
        when(objectMapper.readValue(mockIdentity.getIdentityJson(), IdentityData.class)).thenReturn(identityData);
        IdentityData result = identityService.getIdentity(identityData.getIndividualId());

        assertEquals(identityData.getIndividualId(), result.getIndividualId());
    }

    @Test
    public void getIdentity_withInvalidId_thenFail() {
        IdentityData identityData = new IdentityData();
        identityData.setEmail("email@gmail.com");
        identityData.setEncodedPhoto("encodedPhoto");
        MockIdentityException exception = assertThrows(MockIdentityException.class, () -> {
            identityService.getIdentity(identityData.getIndividualId());
        });
        assertEquals(ErrorConstants.INVALID_INDIVIDUAL_ID, exception.getMessage());
    }

    @Test
    public void getIdentity_throwsJsonProcessingException_thenFail() throws JsonProcessingException {
        IdentityData identityData = new IdentityData();
        identityData.setEmail("email@gmail.com");
        identityData.setEncodedPhoto("encodedPhoto");
        MockIdentity mockIdentity = new MockIdentity();
        when(identityRepository.findById(identityData.getIndividualId())).thenReturn(Optional.of(mockIdentity));
        when(objectMapper.readValue(mockIdentity.getIdentityJson(), IdentityData.class)).thenThrow(JsonProcessingException.class);
        MockIdentityException exception = assertThrows(MockIdentityException.class, () -> {
            identityService.getIdentity(identityData.getIndividualId());
        });

        assertEquals(ErrorConstants.JSON_PROCESSING_ERROR, exception.getMessage());
    }
}