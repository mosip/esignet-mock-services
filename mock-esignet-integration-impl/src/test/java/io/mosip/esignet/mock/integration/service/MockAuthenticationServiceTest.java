package io.mosip.esignet.mock.integration.service;

import com.fasterxml.jackson.databind.ObjectMapper;
import io.mosip.esignet.api.dto.KycExchangeResult;
import io.mosip.esignet.api.dto.VerifiedKycExchangeDto;
import io.mosip.esignet.api.dto.claim.ClaimMetadata;
import io.mosip.esignet.api.exception.KycExchangeException;
import io.mosip.esignet.api.util.ErrorConstants;
import io.mosip.esignet.mock.integration.dto.KycExchangeResponseDto;
import io.mosip.kernel.core.http.ResponseWrapper;
import org.junit.Assert;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.Mockito;
import org.mockito.junit.MockitoJUnitRunner;
import org.springframework.core.ParameterizedTypeReference;
import org.springframework.http.HttpStatus;
import org.springframework.http.RequestEntity;
import org.springframework.http.ResponseEntity;
import org.springframework.test.util.ReflectionTestUtils;
import org.springframework.web.client.RestTemplate;

import java.util.Arrays;
import java.util.HashMap;
import java.util.Map;

@RunWith(MockitoJUnitRunner.class)
public class MockAuthenticationServiceTest {

    @InjectMocks
    private MockAuthenticationService mockAuthenticationService;

    @Mock
    private RestTemplate restTemplate;

    @Test
    public void doVerifiedKycExchange_withValidDetails_thenPass() throws KycExchangeException {
        ReflectionTestUtils.setField(mockAuthenticationService, "kycExchangeUrl", "http://localhost:8080/kyc/exchange");
        ReflectionTestUtils.setField(mockAuthenticationService, "objectMapper", new ObjectMapper());

        VerifiedKycExchangeDto dto = new VerifiedKycExchangeDto();
        dto.setKycToken("kycToken");
        dto.setAcceptedClaims(Arrays.asList("name", "gender"));
        dto.setClaimsLocales(new String[]{"eng", "hin"});

        Map<String, ClaimMetadata> verifiedClaims = new HashMap<>();
        ClaimMetadata claimMetadata = new ClaimMetadata();
        claimMetadata.setTrustFramework("PWD");
        claimMetadata.setAssuranceLevel("assuranceLevel");
        verifiedClaims.put("address",claimMetadata);

        ClaimMetadata claimMetadata1 = new ClaimMetadata();
        claimMetadata1.setTrustFramework("PWD");
        claimMetadata1.setAssuranceLevel("assuranceLevel");
        verifiedClaims.put("gender",claimMetadata1);

        ClaimMetadata claimMetadata2= new ClaimMetadata();
        claimMetadata2.setTrustFramework("Income-tax");
        claimMetadata2.setAssuranceLevel("assuranceLevel4");
        verifiedClaims.put("email",claimMetadata2);

        dto.setAcceptedVerifiedClaims(verifiedClaims);
        KycExchangeResponseDto kycExchangeResponseDto = new KycExchangeResponseDto();
        kycExchangeResponseDto.setKyc("responseKyc");
        ResponseWrapper responseWrapper = new ResponseWrapper();
        responseWrapper.setResponse(kycExchangeResponseDto);
        ResponseEntity<ResponseWrapper<KycExchangeResponseDto>> responseEntity = new ResponseEntity(responseWrapper, HttpStatus.OK);
        Mockito.when(restTemplate.exchange(
                Mockito.any(RequestEntity.class),
                Mockito.eq(new ParameterizedTypeReference<ResponseWrapper<KycExchangeResponseDto>>() {
                })
        )).thenReturn(responseEntity);

        KycExchangeResult kycExchangeResult = mockAuthenticationService.doVerifiedKycExchange("RP", "CL", dto);
        Assert.assertEquals(kycExchangeResponseDto.getKyc(), kycExchangeResult.getEncryptedKyc());

    }

    @Test
    public void doVerifiedKycExchange_withEmptyResponse_thenFail() {
        ReflectionTestUtils.setField(mockAuthenticationService, "kycExchangeUrl", "http://localhost:8080/kyc/exchange");
        ReflectionTestUtils.setField(mockAuthenticationService, "objectMapper", new ObjectMapper());

        VerifiedKycExchangeDto dto = new VerifiedKycExchangeDto();
        dto.setKycToken("kycToken");
        dto.setAcceptedClaims(Arrays.asList("name", "gender"));
        dto.setClaimsLocales(new String[]{"eng", "hin"});

        Map<String, ClaimMetadata> verifiedClaims = new HashMap<>();
        ClaimMetadata claimMetadata = new ClaimMetadata();
        claimMetadata.setTrustFramework("PWD");
        claimMetadata.setAssuranceLevel("assuranceLevel");
        verifiedClaims.put("address", claimMetadata);

        ClaimMetadata claimMetadata1 = new ClaimMetadata();
        claimMetadata1.setTrustFramework("PWD");
        claimMetadata1.setAssuranceLevel("assuranceLevel");
        verifiedClaims.put("gender", claimMetadata1);

        ClaimMetadata claimMetadata2 = new ClaimMetadata();
        claimMetadata2.setTrustFramework("Income-tax");
        claimMetadata2.setAssuranceLevel("assuranceLevel4");
        verifiedClaims.put("email", claimMetadata2);

        dto.setAcceptedVerifiedClaims(verifiedClaims);
        ResponseWrapper responseWrapper = new ResponseWrapper();
        responseWrapper.setResponse(null);
        ResponseEntity<ResponseWrapper<KycExchangeResponseDto>> responseEntity = new ResponseEntity(responseWrapper, HttpStatus.OK);
        Mockito.when(restTemplate.exchange(
                Mockito.any(RequestEntity.class),
                Mockito.eq(new ParameterizedTypeReference<ResponseWrapper<KycExchangeResponseDto>>() {
                })
        )).thenReturn(responseEntity);
        try {
            mockAuthenticationService.doVerifiedKycExchange("RP", "CL", dto);
        } catch (KycExchangeException e) {
            Assert.assertEquals(e.getErrorCode(), ErrorConstants.DATA_EXCHANGE_FAILED);
        }
    }
}
