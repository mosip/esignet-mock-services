/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at https://mozilla.org/MPL/2.0/.
 */
package io.mosip.esignet.mock.identitysystem.controller;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.mockito.Mockito.*;

import io.mosip.esignet.mock.identitysystem.dto.RequestWrapper;
import io.mosip.esignet.mock.identitysystem.service.PartnerService;
import io.mosip.esignet.mock.identitysystem.util.HelperUtil;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.test.context.bean.override.mockito.MockitoBean;
import org.springframework.test.web.servlet.MockMvc;
import io.mosip.esignet.mock.identitysystem.dto.PartnerDto;
import com.fasterxml.jackson.databind.ObjectMapper;

@WebMvcTest(PartnerController.class)
public class PartnerControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @MockitoBean
    private PartnerService partnerService;

    @Autowired
    private ObjectMapper objectMapper;

    @Test
    void upsertPartner_invalidRequest_thenFail() throws Exception {
        PartnerDto partnerDto = new PartnerDto();
        RequestWrapper requestWrapper = new RequestWrapper<PartnerDto>();
        requestWrapper.setRequest(partnerDto);
        requestWrapper.setRequestTime(HelperUtil.getCurrentUTCDateTime());

        mockMvc.perform(post("/partner")
                        .contentType("application/json")
                        .content(objectMapper.writeValueAsString(requestWrapper)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.errors").isArray())
                .andExpect(jsonPath("$.errors").isNotEmpty());

        verify(partnerService, times(0)).upsertPartner(any(PartnerDto.class));
    }

    @Test
    void upsertPartner_validInput_thenPass() throws Exception {

        PartnerDto partnerDto = new PartnerDto();
        partnerDto.setPartnerId("validPartnerId");
        partnerDto.setClientId("validClientId");
        partnerDto.setKey("""
                {
                    "kty": "RSA",
                    "e": "AQAB",
                    "use": "enc",
                    "alg": "RSA-OAEP",
                    "n": "hrXBfpt0T5vMrxfvUB_tYc4zscGAvtmb2O1YZghxScXDOmq3FUQ07oozx26mQnRh06el9h76RjKNPIEyh3QdUTEtWqnPaD5nxmQkAP2Bt21Mnc25AaTCaVJSUsOCIiFzlp4SNS9PpXuw4BI-PaxiR5jpx9HV5F8Pa1aTJkM5uGcpDvNQa4C2r9q9uc2rWmJq6QQ8tH662xXBv3pJF0qCEtz0T6o0M3iSh-uaAdkQcruRPTCYhwj9sk8vQ_2AHLMSIOOvN6rW6g3bdFYw82xxrOdzPnvKGATv4xXfaUkTR0SgKekfHYLHG5kEjmU6FTJioNWDAaPE_Jc7FIo0FbqDew"
                }\
                """);
        partnerDto.setStatus("ACTIVE");

        RequestWrapper requestWrapper = new RequestWrapper<PartnerDto>();
        requestWrapper.setRequest(partnerDto);
        requestWrapper.setRequestTime(HelperUtil.getCurrentUTCDateTime());

        mockMvc.perform(post("/partner")
                        .contentType("application/json")
                        .content(objectMapper.writeValueAsString(requestWrapper)))
                .andExpect(status().isOk());

        verify(partnerService, times(1)).upsertPartner(any(PartnerDto.class));
    }
}
