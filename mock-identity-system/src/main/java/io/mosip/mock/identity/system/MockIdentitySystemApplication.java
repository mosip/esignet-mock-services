package io.mosip.mock.identity.system;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

@SpringBootApplication(scanBasePackages = { "io.mosip.mock.identity.system" })
public class MockIdentitySystemApplication 
{
	public static void main(String[] args) {
		SpringApplication.run(MockIdentitySystemApplication.class, args);
	}
}
