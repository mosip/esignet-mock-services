package io.mosip.mock.identity.system.service;

import io.mosip.mock.identity.system.dto.MockAuthData;
import io.mosip.mock.identity.system.exception.MockAuthenticationException;

public interface MockAuthenticationService {

	public void saveIdentity(MockAuthData mockAuthDataRequest) throws MockAuthenticationException;
	
	public MockAuthData getIdentity(String individualId) throws MockAuthenticationException;
	
}
