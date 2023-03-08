package io.mosip.esignet.mock.identitysystem;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

@SpringBootApplication(scanBasePackages = "io.mosip.esignet.mock.identitysystem,"+
		"io.mosip.kernel.crypto," +
				"io.mosip.kernel.keymanager.hsm," +
				"io.mosip.kernel.cryptomanager.util," +
				"io.mosip.kernel.keymanagerservice.helper," +
				"io.mosip.kernel.keymanagerservice.service," +
				"io.mosip.kernel.keymanagerservice.util," +
				"io.mosip.kernel.keygenerator.bouncycastle," +
				"io.mosip.kernel.signature.service," +
				"io.mosip.kernel.partnercertservice.service," +
				"io.mosip.kernel.partnercertservice.helper" )
public class MockIdentitySystemApplication 
{
	public static void main(String[] args) {
		SpringApplication.run(MockIdentitySystemApplication.class, args);
	}
}
