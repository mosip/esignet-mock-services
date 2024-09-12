/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at https://mozilla.org/MPL/2.0/.
 */
package io.mosip.esignet.mock.identitysystem.service.impl;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.node.ObjectNode;
import io.mosip.esignet.mock.identitysystem.dto.IdentityData;
import io.mosip.esignet.mock.identitysystem.dto.VerifiedClaimRequestDto;
import io.mosip.esignet.mock.identitysystem.entity.MockIdentity;
import io.mosip.esignet.mock.identitysystem.exception.MockIdentityException;
import io.mosip.esignet.mock.identitysystem.repository.IdentityRepository;
import io.mosip.esignet.mock.identitysystem.repository.VerifiedClaimRepository;
import io.mosip.esignet.mock.identitysystem.util.ErrorConstants;
import org.junit.Assert;
import org.junit.Before;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.Mockito;
import org.mockito.junit.MockitoJUnitRunner;
import org.springframework.test.util.ReflectionTestUtils;

import java.util.*;

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

    ObjectMapper objectMapper = new ObjectMapper();

    @InjectMocks
    IdentityServiceImpl identityService;

    @Before
    public void setup() {
        ReflectionTestUtils.setField(identityService, "fieldLang", "eng");
        ReflectionTestUtils.setField(identityService, "objectMapper", objectMapper);

        Map<String, String> mapping = new HashMap<>();
        mapping.put("fullName", "name");
        mapping.put("email", "email");
        mapping.put("phone", "phone");
        mapping.put("gender", "gender");
        ReflectionTestUtils.setField(identityService, "oidcClaimsMapping", mapping);
    }



    @Test
    public void addVerifiedClaim_withValidDetails_thenPass() {

        VerifiedClaimRequestDto verifiedClaimRequestDto = new  VerifiedClaimRequestDto();
        verifiedClaimRequestDto.setActive(true);
        verifiedClaimRequestDto.setIndividualId("123456");
        Map<String, JsonNode> verificationDetail = new HashMap<>();

        ObjectNode emailVerification = objectMapper.createObjectNode();
        emailVerification.put("trust_framework", "trust_framework");
        verificationDetail.put("email", emailVerification);
        verifiedClaimRequestDto.setVerificationDetail(verificationDetail);

        IdentityData identityData = new IdentityData();
        identityData.setEmail("email@gmail.com");
        identityData.setEncodedPhoto("encodedPhoto");

        MockIdentity mockIdentity = new MockIdentity();
        mockIdentity.setIndividualId("123456");
        mockIdentity.setIdentityJson("{\"individualId\":\"8267411571\",\"pin\":\"111111\",\"fullName\":[{\"language\":\"fra\",\"value\":\"Siddharth K Mansour\"},{\"language\":\"ara\",\"value\":\"تتگلدكنسَزقهِقِفل دسييسيكدكنوڤو\"},{\"language\":\"eng\",\"value\":\"Siddharth K Mansour\"}],\"email\":\"siddhartha.km@gmail.com\",\"phone\":\"+919427357934\"}");
        Mockito.when(verifiedClaimRepository.findById(Mockito.anyString())).thenReturn(Optional.empty());
        Mockito.when(identityRepository.findById(Mockito.anyString())).thenReturn(Optional.of(mockIdentity));
        identityService.addVerifiedClaim(verifiedClaimRequestDto);
    }

    @Test
    public void addVerifiedClaim_withInValidIndividualId_thenFail()  {
        VerifiedClaimRequestDto verifiedClaimRequestDto = new  VerifiedClaimRequestDto();
        verifiedClaimRequestDto.setActive(true);
        verifiedClaimRequestDto.setIndividualId("123456");
        Map<String, JsonNode> verificationDetail = new HashMap<>();

        ObjectNode emailVerification = objectMapper.createObjectNode();
        emailVerification.put("trust_framework", "trust_framework");
        verificationDetail.put("claim", emailVerification);
        verifiedClaimRequestDto.setVerificationDetail(verificationDetail);

        Mockito.when(identityRepository.findById(Mockito.anyString())).thenReturn(Optional.empty());

        try{
            identityService.addVerifiedClaim(verifiedClaimRequestDto);
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
        identityService.addIdentity(identityData);
        verify(identityRepository).save(any(MockIdentity.class));
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
}