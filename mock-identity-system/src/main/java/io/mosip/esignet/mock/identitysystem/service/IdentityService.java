/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at https://mozilla.org/MPL/2.0/.
 */
package io.mosip.esignet.mock.identitysystem.service;

import com.fasterxml.jackson.databind.JsonNode;
import io.mosip.esignet.mock.identitysystem.dto.IdentityData;
import io.mosip.esignet.mock.identitysystem.dto.VerifiedClaimRequestDto;
import io.mosip.esignet.mock.identitysystem.exception.MockIdentityException;

public interface IdentityService {

	public void addIdentity(IdentityData mockAuthDataRequest) throws MockIdentityException;

	public void updateIdentity(IdentityData mockAuthDataRequest) throws MockIdentityException;
	
	public IdentityData getIdentity(String individualId) throws MockIdentityException;

    public  void addVerifiedClaim(VerifiedClaimRequestDto request) throws MockIdentityException;

	public JsonNode getIdentityV2(String individualId) throws MockIdentityException;
}
