package io.mosip.esignet.mock.integration.service;

import com.fasterxml.jackson.databind.ObjectMapper;
import io.mosip.esignet.api.dto.KycExchangeResult;
import io.mosip.esignet.api.dto.VerifiedKycExchangeDto;
import io.mosip.esignet.api.dto.claim.FilterCriteria;
import io.mosip.esignet.api.dto.claim.VerificationFilter;
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

import java.util.*;

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



        Map<String, List<VerificationFilter>> acceptedVerifiedClaims=new HashMap<>();

        List<VerificationFilter> verificationFilterList1 = new ArrayList<>();
        VerificationFilter verificationFilter= new VerificationFilter();
        FilterCriteria trustFramework = new FilterCriteria();
        trustFramework.setValue("PWD");
        verificationFilter.setTrust_framework(trustFramework);

        VerificationFilter verificationFilter2= new VerificationFilter();
        FilterCriteria trustFramework2 = new FilterCriteria();
        trustFramework2.setValue("PWD");
        verificationFilter2.setTrust_framework(trustFramework2);
        verificationFilterList1.add(verificationFilter2);
        verificationFilterList1.add(verificationFilter2);


        List<VerificationFilter> verificationFilterList3 = new ArrayList<>();
        VerificationFilter verificationFilter3= new VerificationFilter();
        FilterCriteria trustFramework3 = new FilterCriteria();
        trustFramework3.setValue("Income-tax");
        verificationFilter3.setTrust_framework(trustFramework3);
        verificationFilterList3.add(verificationFilter3);

        acceptedVerifiedClaims.put("name", verificationFilterList1);
        acceptedVerifiedClaims.put("email", verificationFilterList3);

        dto.setAcceptedVerifiedClaims(acceptedVerifiedClaims);
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


        Map<String, List<VerificationFilter>> acceptedVerifiedClaims=new HashMap<>();
        List<VerificationFilter> verificationFilters= new ArrayList<>();
        VerificationFilter verificationFilter= new VerificationFilter();
        FilterCriteria trustFramework = new FilterCriteria();
        trustFramework.setValue("PWD");
        verificationFilter.setTrust_framework(trustFramework);

        verificationFilters.add(verificationFilter);

        acceptedVerifiedClaims.put("name", verificationFilters);

        List<VerificationFilter> verificationFilters2= new ArrayList<>();
        VerificationFilter verificationFilter2= new VerificationFilter();
        FilterCriteria trustFramework2 = new FilterCriteria();
        trustFramework.setValue("Income-tax");
        verificationFilter2.setTrust_framework(trustFramework2);
        verificationFilters.add(verificationFilter2);

        acceptedVerifiedClaims.put("email", verificationFilters2);

        dto.setAcceptedVerifiedClaims(acceptedVerifiedClaims);
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
