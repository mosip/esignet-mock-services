package io.mosip.esignet.mock.identitysystem.advice;


import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.json.JsonMapper;
import com.fasterxml.jackson.datatype.jsr310.JavaTimeModule;
import com.fasterxml.jackson.module.afterburner.AfterburnerModule;
import io.mosip.kernel.keymanagerservice.dto.KeyPairGenerateRequestDto;
import io.mosip.kernel.keymanagerservice.service.KeymanagerService;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.ApplicationArguments;
import org.springframework.boot.ApplicationRunner;
import org.springframework.boot.autoconfigure.domain.EntityScan;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.data.jpa.repository.config.EnableJpaRepositories;


@Slf4j
@EnableJpaRepositories(basePackages = {"io.mosip.esignet.mock.identitysystem.repository",
        "io.mosip.kernel.keymanagerservice.repository"})
@EntityScan(basePackages = {"io.mosip.esignet.mock.identitysystem.entity",
        "io.mosip.kernel.keymanagerservice.entity"})
@Configuration
public class AppConfig implements ApplicationRunner {

    private static final String APPLICATION_ID = "MOCK_AUTHENTICATION_SERVICE";

    @Autowired
    private KeymanagerService keymanagerService;

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
        rootKeyRequest.setApplicationId("ROOT");
        keymanagerService.generateMasterKey(objectType, rootKeyRequest);

        log.info("===================== MOCK_AUTHENTICATION_SERVICE MASTER KEY CHECK ========================");
        KeyPairGenerateRequestDto masterKeyRequest = new KeyPairGenerateRequestDto();
        masterKeyRequest.setApplicationId(APPLICATION_ID);
        keymanagerService.generateMasterKey(objectType, masterKeyRequest);
    }
}
