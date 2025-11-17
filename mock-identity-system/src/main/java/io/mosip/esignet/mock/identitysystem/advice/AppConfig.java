/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at https://mozilla.org/MPL/2.0/.
 */
package io.mosip.esignet.mock.identitysystem.advice;


import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.json.JsonMapper;
import com.fasterxml.jackson.datatype.jsr310.JavaTimeModule;
import com.fasterxml.jackson.module.afterburner.AfterburnerModule;
import io.mosip.kernel.keymanagerservice.dto.KeyPairGenerateRequestDto;
import io.mosip.kernel.keymanagerservice.dto.SymmetricKeyGenerateRequestDto;
import io.mosip.kernel.keymanagerservice.service.KeymanagerService;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.ApplicationArguments;
import org.springframework.boot.ApplicationRunner;
import org.springframework.boot.autoconfigure.domain.EntityScan;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.data.jpa.repository.config.EnableJpaRepositories;
import org.springframework.util.StringUtils;

import static io.mosip.esignet.mock.identitysystem.util.Constants.APPLICATION_ID;


@Slf4j
@EnableJpaRepositories(basePackages = {"io.mosip.esignet.mock.identitysystem.repository",
        "io.mosip.kernel.keymanagerservice.repository"})
@EntityScan(basePackages = {"io.mosip.esignet.mock.identitysystem.entity",
        "io.mosip.kernel.keymanagerservice.entity"})
@Configuration
public class AppConfig implements ApplicationRunner {

    @Autowired
    private KeymanagerService keymanagerService;

    @Value("${mosip.kernel.keymgr.hsm.healthkey.ref-id}")
    private String cacheSecretKeyRefId;

    @Bean
    public ObjectMapper objectMapper() {
        return JsonMapper.builder()
                .addModule(new AfterburnerModule())
                .addModule(new JavaTimeModule())
                .build();
    }

    @Override
    public void run(ApplicationArguments args) throws Exception {
        log.info("===================== MOCK_AUTHENTICATION_SERVICE ROOT KEY CHECK ========================");
        String objectType = "CSR";
        KeyPairGenerateRequestDto rootKeyRequest = new KeyPairGenerateRequestDto();
        rootKeyRequest.setReferenceId("");
        rootKeyRequest.setApplicationId("ROOT");
        keymanagerService.generateMasterKey(objectType, rootKeyRequest);

        log.info("===================== MOCK_AUTHENTICATION_SERVICE MASTER KEY CHECK ========================");
        KeyPairGenerateRequestDto masterKeyRequest = new KeyPairGenerateRequestDto();
        masterKeyRequest.setReferenceId("");
        masterKeyRequest.setApplicationId(APPLICATION_ID);
        keymanagerService.generateMasterKey(objectType, masterKeyRequest);

        if(!StringUtils.isEmpty(cacheSecretKeyRefId)) {
            SymmetricKeyGenerateRequestDto symmetricKeyGenerateRequestDto = new SymmetricKeyGenerateRequestDto();
            symmetricKeyGenerateRequestDto.setApplicationId(APPLICATION_ID);
            symmetricKeyGenerateRequestDto.setReferenceId(cacheSecretKeyRefId);
            symmetricKeyGenerateRequestDto.setForce(false);
            keymanagerService.generateSymmetricKey(symmetricKeyGenerateRequestDto);
            log.info("============= IDP_SERVICE CACHE SYMMETRIC KEY CHECK COMPLETED =============");
        }
    }
}
