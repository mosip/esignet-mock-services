/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at https://mozilla.org/MPL/2.0/.
 */
package io.mosip.esignet.mock.identitysystem.service;

import com.fasterxml.jackson.databind.JsonNode;
import io.mosip.esignet.mock.identitysystem.dto.VerifiedClaimRequestDto;
import io.mosip.esignet.mock.identitysystem.exception.MockIdentityException;

public interface IdentityService {

	public void addIdentity(JsonNode mockAuthDataRequest) throws MockIdentityException;

	public void updateIdentity(JsonNode mockAuthDataRequest) throws MockIdentityException;

    public  void addVerifiedClaim(VerifiedClaimRequestDto request) throws MockIdentityException;

	public JsonNode getIdentity(String individualId) throws MockIdentityException;

    public JsonNode getSchema();

	public JsonNode getUISpecification();
}
