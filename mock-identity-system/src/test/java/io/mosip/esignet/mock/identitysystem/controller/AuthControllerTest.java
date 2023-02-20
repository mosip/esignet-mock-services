package io.mosip.esignet.mock.identitysystem.controller;

import io.mosip.esignet.mock.identitysystem.service.impl.MockAuthenticationService;
import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import io.mosip.idp.core.dto.*;
import io.mosip.idp.core.dto.Error;
import org.junit.jupiter.api.AfterEach;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.result.MockMvcResultHandlers;
import org.springframework.test.web.servlet.setup.MockMvcBuilders;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@ExtendWith(MockitoExtension.class)
public class AuthControllerTest {
    @Autowired
    private MockMvc mockMvc;
    @Mock
    private MockAuthenticationService mockAuthenticationService;
    private KycAuthResult kycAuthResult;
    private KycAuthResult kycAuthResult1;
    private KycExchangeResult kycExchangeResult;
    private List<AuthChallenge> challengeList;
    private List<Error> errorList;
    private List dateTime=new ArrayList<>();
    @InjectMocks
    private AuthController authController;
    @BeforeEach
    public void setUp(){
        List errList=new ArrayList<Error>();
        errList=null;
        challengeList=new ArrayList<>();
        challengeList.add(new AuthChallenge());
        kycAuthResult=new KycAuthResult("o7-dsTeUR73g7UKaUcZQ0JxR1e_j7B4p1oTczg2B_SE",
                "G1Ty7yKYSl-Wc-I8IHBZukZkRUef3X-IJ31jzTSe2ak",
                true,null, LocalDateTime.parse("2023-01-10T15:41:58.871755"));
        errorList=new ArrayList<Error>();
        errorList.add(new Error("err Id","error"));
        mockMvc= MockMvcBuilders.standaloneSetup(authController).build();

    }
    @AfterEach
    public void tearDown(){
        kycAuthResult=null;
        dateTime=null;
    }
    @Test
    public void givenKycAuthDtoPINToReturnSaveSuccess()throws Exception{
        when(mockAuthenticationService.doKycAuth(any(),any(),any())).thenReturn(kycAuthResult);
        int[] dateTime1=new int[]{2023,1,10,15,41,58,871755000};
        dateTime= Arrays.asList(dateTime1);
        mockMvc.perform(post("/kyc-auth/abc/1234")
                        .contentType(MediaType.APPLICATION_JSON).content(jsonToString(kycAuthResult)))
                .andExpect(status().isAccepted())
                .andExpect(jsonPath("$.kycToken").
                        value("o7-dsTeUR73g7UKaUcZQ0JxR1e_j7B4p1oTczg2B_SE"))
                .andExpect(jsonPath("$.partnerSpecificUserToken").
                        value("G1Ty7yKYSl-Wc-I8IHBZukZkRUef3X-IJ31jzTSe2ak"))
                .andExpect(jsonPath("$.kycStatus")
                        .value(true))
                .andExpect(jsonPath("$.errors").isEmpty())
                .andExpect(jsonPath("$.responseTime")
                        .exists());
        verify(mockAuthenticationService,times(1)).doKycAuth(any(),
                any(),any());
    }
    @Test
    public void givenKycAuthDtoOTPToReturnSaveSuccess()throws Exception{
        when(mockAuthenticationService.doKycAuth(any(),any(),any())).thenReturn(kycAuthResult);
        int[] dateTime1=new int[]{2023,1,10,15,41,58,871755000};
        dateTime= Arrays.asList(dateTime1);
        mockMvc.perform(post("/kyc-auth/abc/1234")
                        .contentType(MediaType.APPLICATION_JSON).content(jsonToString(kycAuthResult)))
                .andExpect(status().isAccepted())
                .andExpect(jsonPath("$.kycToken").
                        value("o7-dsTeUR73g7UKaUcZQ0JxR1e_j7B4p1oTczg2B_SE"))
                .andExpect(jsonPath("$.partnerSpecificUserToken").
                        value("G1Ty7yKYSl-Wc-I8IHBZukZkRUef3X-IJ31jzTSe2ak"))
                .andExpect(jsonPath("$.kycStatus")
                        .value(true))
                .andExpect(jsonPath("$.errors").isEmpty())
                .andExpect(jsonPath("$.responseTime")
                        .exists());
        verify(mockAuthenticationService,times(1)).doKycAuth(any(),
                any(),any());
    }
    @Test
    public void givenKycExchangeDtoReturnSuccess() throws Exception{
        kycAuthResult1=new KycAuthResult("o7-dsTeUR73g7UKaUcZQ0JxR1e_j7B4p1oTczg2B_S",
                "G1Ty7yKYSl-Wc-I8IHBZukZkRUef3X-IJ31jzTSe2ak",
                false,errorList
                ,LocalDateTime.now());
        kycExchangeResult=new KycExchangeResult();
        kycExchangeResult.setId("mosip.identity.kycexchange");
        kycExchangeResult.setEncryptedKyc("H3MryjADWUgKVjzvCxxzebYnYvpBRaIFVgPnldajX50");
        kycExchangeResult.setVersion("1.0");
        kycExchangeResult.setErrors(null);
        kycExchangeResult.setResponseTime(null);
        when(mockAuthenticationService.doKycExchange(any(),any(),any())).thenReturn(kycExchangeResult);
        mockMvc.perform(post("/kyc-exchange/abc/1234")
                        .contentType(MediaType.APPLICATION_JSON).content(jsonToString(kycExchangeResult)))
                .andExpect(status().isAccepted())
                .andExpect(jsonPath("$.id").value("mosip.identity.kycexchange"))
                .andExpect(jsonPath("$.version").value("1.0"))
                .andExpect(jsonPath("$.encryptedKyc").value("H3MryjADWUgKVjzvCxxzebYnYvpBRaIFVgPnldajX50"))
                .andExpect(jsonPath("$.errors").isEmpty())
                .andDo(MockMvcResultHandlers.print());
    }
    @Test
    public void givenInvalidTransactionIdReturnError() throws Exception{
        kycAuthResult1=new KycAuthResult("o7-dsTeUR73g7UKaUcZQ0JxR1e_j7B4p1oTczg2B_S",
                "G1Ty7yKYSl-Wc-I8IHBZukZkRUef3X-IJ31jzTSe2ak",
                false,errorList
                ,LocalDateTime.now());
        kycExchangeResult=new KycExchangeResult();
        kycExchangeResult.setId("mosip.identity.kycexchange");
        kycExchangeResult.setEncryptedKyc("H3MryjADWUgKVjzvCxxzebYnYvpBRaIFVgPnldajX50");
        kycExchangeResult.setVersion("1.0");
        kycExchangeResult.setErrors(null);
        kycExchangeResult.setResponseTime(null);
        when(mockAuthenticationService.doKycExchange(any(),any(),any())).thenReturn(kycExchangeResult);
        mockMvc.perform(post("/kyc-exchange/abc/1234")
                        .contentType(MediaType.APPLICATION_JSON).content(jsonToString(kycExchangeResult)))
                .andExpect(status().isAccepted())
                .andExpect(jsonPath("$.id").value("mosip.identity.kycexchange"))
                .andExpect(jsonPath("$.version").value("1.0"))
                .andExpect(jsonPath("$.encryptedKyc").value("H3MryjADWUgKVjzvCxxzebYnYvpBRaIFVgPnldajX50"))
                .andExpect(jsonPath("$.errors").isEmpty())
                .andDo(MockMvcResultHandlers.print());
    }
    private static String jsonToString(final Object ob)throws JsonProcessingException {
        String result;
        try{
            ObjectMapper mapper=new ObjectMapper();
            String jsonContent=mapper.writeValueAsString(ob);
            System.out.println("Json that is posted "+jsonContent);
            result=jsonContent;
        }catch(JsonProcessingException e){
            result="Json processing error";
        }
        return result;
    }
}

