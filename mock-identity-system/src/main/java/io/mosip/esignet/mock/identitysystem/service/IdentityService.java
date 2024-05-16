package io.mosip.esignet.mock.identitysystem.service;

import io.mosip.esignet.mock.identitysystem.dto.IdentityData;
import io.mosip.esignet.mock.identitysystem.dto.VerifiedClaimRequestDto;
import io.mosip.esignet.mock.identitysystem.exception.MockIdentityException;

public interface IdentityService {

	public void addIdentity(IdentityData mockAuthDataRequest) throws MockIdentityException;
	
	public IdentityData getIdentity(String individualId) throws MockIdentityException;

    void addVerifiedClaim(VerifiedClaimRequestDto request) throws MockIdentityException;
}
