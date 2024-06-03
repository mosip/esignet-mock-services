package io.mosip.esignet.mock.identitysystem.service.impl;

import com.fasterxml.jackson.databind.ObjectMapper;
import io.mosip.esignet.mock.identitysystem.dto.VerifiedClaimRequestDto;
import io.mosip.esignet.mock.identitysystem.entity.MockIdentity;
import io.mosip.esignet.mock.identitysystem.exception.MockIdentityException;
import io.mosip.esignet.mock.identitysystem.repository.AuthRepository;
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

import java.time.LocalDateTime;
import java.util.Optional;

@RunWith(MockitoJUnitRunner.class)
public class IdentityServiceTest {

    @Mock
    AuthRepository authRepository;

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
        VerifiedClaimRequestDto requestDto = new VerifiedClaimRequestDto();
        requestDto.setTrustFramework("trust_framework");
        requestDto.setClaim("claim");
        requestDto.setIndividualId("123456");
        requestDto.setVerifiedDateTime(LocalDateTime.now());

        Mockito.when(verifiedClaimRepository.findById(Mockito.anyString())).thenReturn(Optional.empty());
        Mockito.when(identityRepository.findById(Mockito.anyString())).thenReturn(Optional.of(new MockIdentity()));

        identityService.addVerifiedClaim(requestDto);
    }

    @Test
    public void addVerifiedClaim_withInValidIndividualId_thenPass() throws Exception {
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
}
