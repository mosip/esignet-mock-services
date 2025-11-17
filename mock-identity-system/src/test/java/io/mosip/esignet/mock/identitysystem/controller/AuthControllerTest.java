/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at https://mozilla.org/MPL/2.0/.
 */
package io.mosip.esignet.mock.identitysystem.controller;

import com.fasterxml.jackson.databind.ObjectMapper;
import io.mosip.esignet.mock.identitysystem.dto.*;
import io.mosip.esignet.mock.identitysystem.service.impl.AuthenticationServiceImpl;
import io.mosip.kernel.keymanagerservice.dto.AllCertificatesDataResponseDto;
import io.mosip.kernel.keymanagerservice.service.impl.KeymanagerServiceImpl;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.http.MediaType;
import org.springframework.test.context.bean.override.mockito.MockitoBean;
import org.springframework.test.web.servlet.MockMvc;

import java.util.Arrays;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@WebMvcTest(value = AuthController.class)
public class AuthControllerTest {

    @MockitoBean
    private AuthenticationServiceImpl authenticationService;

    @MockitoBean
    private KeymanagerServiceImpl keymanagerService;

    @Autowired
    MockMvc mockMvc;

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
        KycAuthRequestDtoV2 requestDto = new KycAuthRequestDtoV2();
        KycAuthResponseDto responseDto = new KycAuthResponseDto();
        when(authenticationService.kycAuth(any(), any(), any())).thenReturn(responseDto);
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
        when(authenticationService.kycExchange(any(), any(), any())).thenReturn(responseDto);
        mockMvc.perform(post("/v2/kyc-exchange/relyingPartyId/clientId")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(new ObjectMapper().writeValueAsString(requestDtoV2)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.response").exists());
    }

    @Test
    public void kycExchangeV3_withValidDetails_thenPass() throws Exception {
        KycExchangeRequestDtoV3 requestDtoV2 = new KycExchangeRequestDtoV3();
        KycExchangeResponseDto responseDto = new KycExchangeResponseDto();
        when(authenticationService.kycExchange(any(), any(), any())).thenReturn(responseDto);
        mockMvc.perform(post("/v3/kyc-exchange/relyingPartyId/clientId")
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

    @Test
    public void getAllKeys_withValidDetails_thenPass() throws Exception {
        when(keymanagerService.getAllCertificates(any(), any())).thenReturn(new AllCertificatesDataResponseDto());
        mockMvc.perform(get("/keys.json")
                        .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.response").exists());
    }

}
