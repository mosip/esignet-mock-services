package io.mosip.mock.identity.system.service;

import io.mosip.mock.identity.system.dto.MockAuthData;
import io.mosip.mock.identity.system.exception.MockIdentityException;

public interface MockIdentityService {

	public void saveIdentity(MockAuthData mockAuthDataRequest) throws MockIdentityException;
	
	public MockAuthData getIdentity(String individualId) throws MockIdentityException;
	
}
