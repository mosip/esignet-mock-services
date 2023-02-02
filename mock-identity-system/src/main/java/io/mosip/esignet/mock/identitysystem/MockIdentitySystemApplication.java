package io.mosip.esignet.mock.identitysystem;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

@SpringBootApplication(scanBasePackages = { "io.mosip.esignet.mock.identitysystem" })
public class MockIdentitySystemApplication 
{
	public static void main(String[] args) {
		SpringApplication.run(MockIdentitySystemApplication.class, args);
	}
}
