package io.mosip.esignet.mock.identitysystem.controller;

import com.fasterxml.jackson.databind.ObjectMapper;
import io.mosip.esignet.mock.identitysystem.dto.*;
import io.mosip.esignet.mock.identitysystem.service.AuthenticationService;
import org.junit.Test;
import org.junit.jupiter.api.BeforeEach;
import org.junit.runner.RunWith;
import org.mockito.MockitoAnnotations;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.http.MediaType;
import org.springframework.test.context.junit4.SpringRunner;
import org.springframework.test.web.servlet.MockMvc;

import java.util.Arrays;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@RunWith(SpringRunner.class)
@WebMvcTest(value = AuthController.class)
public class AuthControllerTest {

    @MockBean
    private AuthenticationService authenticationService;

    @Autowired
    MockMvc mockMvc;

    @BeforeEach
    public void setUp() {
        MockitoAnnotations.initMocks(this);
    }

    @Test
    public void kycAuth_withValidDetails_thenPass() throws Exception {
        KycAuthRequestDto requestDto = new KycAuthRequestDto();
        KycAuthResponseDto responseDto = new KycAuthResponseDto();
        when(authenticationService.kycAuth(any(), any(), any())).thenReturn(responseDto);
        mockMvc.perform(post("/kyc-auth/relyingPartyId/clientId")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(new ObjectMapper().writeValueAsString(requestDto)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.response").exists());
    }

    @Test
    public void kycAuthV2_withValidDetails_thenPass() throws Exception {
        KycAuthRequestDto requestDto = new KycAuthRequestDto();
        KycAuthResponseDtoV2 responseDtoV2 = new KycAuthResponseDtoV2();
        when(authenticationService.kycAuthV2(any(), any(), any())).thenReturn(responseDtoV2);
        mockMvc.perform(post("/v2/kyc-auth/relyingPartyId/clientId")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(new ObjectMapper().writeValueAsString(requestDto)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.response").exists());
    }

    @Test
    public void kycExchange_withValidDetails_thenPass() throws Exception {
        KycExchangeRequestDto requestDto = new KycExchangeRequestDto();
        KycExchangeResponseDto responseDto = new KycExchangeResponseDto();
        when(authenticationService.kycExchange(any(), any(), any())).thenReturn(responseDto);
        mockMvc.perform(post("/kyc-exchange/relyingPartyId/clientId")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(new ObjectMapper().writeValueAsString(requestDto)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.response").exists());
    }

    @Test
    public void kycExchangeV2_withValidDetails_thenPass() throws Exception {
        KycExchangeRequestDtoV2 requestDtoV2 = new KycExchangeRequestDtoV2();
        KycExchangeResponseDto responseDto = new KycExchangeResponseDto();
        when(authenticationService.kycExchangeV2(any(), any(), any())).thenReturn(responseDto);
        mockMvc.perform(post("/v2/kyc-exchange/relyingPartyId/clientId")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(new ObjectMapper().writeValueAsString(requestDtoV2)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.response").exists());
    }

    @Test
    public void sendOtp_withValidDetails_thenPass() throws Exception {
        SendOtpDto sendOtpDto = new SendOtpDto();
        sendOtpDto.setTransactionId("validTransactionId");
        sendOtpDto.setIndividualId("validIndividualId");
        sendOtpDto.setOtpChannels(Arrays.asList("email", "phone"));
        SendOtpResult result = new SendOtpResult("validTransactionId", "maskedEmail", "maskedPhone");
        when(authenticationService.sendOtp(any(), any(), any())).thenReturn(result);
        mockMvc.perform(post("/send-otp/relyingPartyId/clientId")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(new ObjectMapper().writeValueAsString(sendOtpDto)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.response").exists())
                .andExpect(jsonPath("$.response.transactionId").value("validTransactionId"))
                .andExpect(jsonPath("$.response.maskedEmail").value("maskedEmail"));
    }

}
