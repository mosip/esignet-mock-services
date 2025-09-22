/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at https://mozilla.org/MPL/2.0/.
 */
package io.mosip.esignet.mock.identitysystem.service.impl;

import com.nimbusds.jose.jwk.JWK;
import com.nimbusds.jose.jwk.RSAKey;
import io.mosip.esignet.mock.identitysystem.dto.PartnerDto;
import io.mosip.esignet.mock.identitysystem.entity.PartnerData;
import io.mosip.esignet.mock.identitysystem.exception.MockIdentityException;
import io.mosip.esignet.mock.identitysystem.repository.PartnerDataRepository;
import io.mosip.esignet.mock.identitysystem.service.PartnerService;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

import java.time.LocalDateTime;
import java.time.ZoneOffset;
import java.util.Optional;

@Slf4j
@Component
public class PartnerServiceImpl implements PartnerService {

    @Autowired
    private PartnerDataRepository partnerDataRepository;

    @Override
    public void upsertPartner(PartnerDto partnerDto) {
        Optional<PartnerData> result = partnerDataRepository.findByPartnerIdAndClientId(partnerDto.getPartnerId(),
                partnerDto.getClientId());
        PartnerData partnerData = result.orElseGet(PartnerData::new);
        partnerData.setClientId(partnerDto.getClientId());
        partnerData.setPartnerId(partnerDto.getPartnerId());

        try {
            JWK jwk =  JWK.parse(partnerDto.getKey());
            if (!(jwk instanceof RSAKey)) {
               throw new MockIdentityException("mock-ida-008");
            }
        } catch (Exception e) {
            log.error("key is invalid", e);
            throw new MockIdentityException("mock-ida-008");
        }

        partnerData.setPublicKey(partnerDto.getKey());
        partnerData.setStatus(partnerDto.getStatus());
        partnerData.setCreatedtimes(LocalDateTime.now(ZoneOffset.UTC));
        partnerDataRepository.save(partnerData);
        log.info("Partner data created successfully for partnerId: {}", partnerDto.getPartnerId());
    }
}
