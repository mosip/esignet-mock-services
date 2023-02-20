package io.mosip.esignet.mock.identitysystem;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.autoconfigure.domain.EntityScan;
import org.springframework.data.jpa.repository.config.EnableJpaRepositories;

@EnableJpaRepositories(basePackages = {"io.mosip.esignet.mock.identitysystem.repository",
		"io.mosip.kernel.keymanagerservice.repository"})
@EntityScan(basePackages = {"io.mosip.esignet.mock.identitysystem.entity",
		"io.mosip.kernel.keymanagerservice.entity"})
@SpringBootApplication(scanBasePackages = { "io.mosip.esignet.mock.identitysystem",
		"io.mosip.kernel.keymanagerservice.*",
		"io.mosip.kernel.signature.*",
		"io.mosip.kernel.keymanager.*",
		"io.mosip.kernel.keygenerator.*",
		"io.mosip.kernel.crypto",
		"io.mosip.kernel.cryptomanager.*",
		"io.mosip.kernel.partnercertservice.*" })
public class MockIdentitySystemApplication 
{
	public static void main(String[] args) {
		SpringApplication.run(MockIdentitySystemApplication.class, args);
	}
}
