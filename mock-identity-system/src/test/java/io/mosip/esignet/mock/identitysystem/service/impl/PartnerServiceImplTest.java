/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at https://mozilla.org/MPL/2.0/.
 */
package io.mosip.esignet.mock.identitysystem.service.impl;

import static org.mockito.Mockito.*;

import io.mosip.esignet.mock.identitysystem.exception.MockIdentityException;
import io.mosip.esignet.mock.identitysystem.repository.PartnerDataRepository;
import org.junit.Assert;
import org.junit.jupiter.api.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import io.mosip.esignet.mock.identitysystem.dto.PartnerDto;
import org.junit.jupiter.api.extension.ExtendWith;

@ExtendWith(MockitoExtension.class)
public class PartnerServiceImplTest {

    @InjectMocks
    private PartnerServiceImpl partnerServiceImpl;

    @Mock
    private PartnerDataRepository partnerRepository; // Assuming you have a repository

    @Test
    void upsertPartner_withInvalidKey_thenFail() {
        PartnerDto partnerDto = new PartnerDto();
        try {
            partnerServiceImpl.upsertPartner(partnerDto);
            Assert.fail();
        } catch (MockIdentityException e) {
            Assert.assertEquals("mock-ida-008", e.getErrorCode());
        }
        verify(partnerRepository, times(0)).save(any());
    }

    @Test
    void upsertPartner_withValidInput_thenPass() {
        PartnerDto partnerDto = new PartnerDto();
        partnerDto.setPartnerId("validPartnerId");
        partnerDto.setClientId("validClientId");
        partnerDto.setKey("{\n" +
                "    \"kty\": \"RSA\",\n" +
                "    \"e\": \"AQAB\",\n" +
                "    \"use\": \"enc\",\n" +
                "    \"alg\": \"RSA-OAEP\",\n" +
                "    \"n\": \"hrXBfpt0T5vMrxfvUB_tYc4zscGAvtmb2O1YZghxScXDOmq3FUQ07oozx26mQnRh06el9h76RjKNPIEyh3QdUTEtWqnPaD5nxmQkAP2Bt21Mnc25AaTCaVJSUsOCIiFzlp4SNS9PpXuw4BI-PaxiR5jpx9HV5F8Pa1aTJkM5uGcpDvNQa4C2r9q9uc2rWmJq6QQ8tH662xXBv3pJF0qCEtz0T6o0M3iSh-uaAdkQcruRPTCYhwj9sk8vQ_2AHLMSIOOvN6rW6g3bdFYw82xxrOdzPnvKGATv4xXfaUkTR0SgKekfHYLHG5kEjmU6FTJioNWDAaPE_Jc7FIo0FbqDew\"\n" +
                "}");
        partnerDto.setStatus("ACTIVE");
        partnerServiceImpl.upsertPartner(partnerDto);
        verify(partnerRepository, times(1)).save(any());
    }
}
