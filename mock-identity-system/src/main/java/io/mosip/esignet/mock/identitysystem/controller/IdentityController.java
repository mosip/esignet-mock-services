/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at https://mozilla.org/MPL/2.0/.
 */
package io.mosip.esignet.mock.identitysystem.controller;

import javax.validation.Valid;

import io.mosip.esignet.mock.identitysystem.dto.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.MediaType;
import org.springframework.web.bind.annotation.*;

import io.mosip.esignet.mock.identitysystem.exception.MockIdentityException;
import io.mosip.esignet.mock.identitysystem.service.IdentityService;
import io.mosip.esignet.mock.identitysystem.util.HelperUtil;

import java.util.List;


@RestController
@RequestMapping("/")
public class IdentityController {

	@Autowired
	private IdentityService identityService;

	@PostMapping(value = "identity", consumes = { MediaType.APPLICATION_JSON_VALUE }, produces = {
			MediaType.APPLICATION_JSON_VALUE })
	public ResponseWrapper<IdentityStatus> createIdentity
	(@Valid @RequestBody RequestWrapper<IdentityData> requestWrapper) throws MockIdentityException {

		ResponseWrapper response = new ResponseWrapper<IdentityStatus>();
		IdentityStatus identityStatus = new IdentityStatus();
		identityService.addIdentity(requestWrapper.getRequest());
		identityStatus.setStatus("mock identity data created successfully");
		response.setResponse(identityStatus);
		response.setResponseTime(HelperUtil.getCurrentUTCDateTime());
		return response;
	}

	@PutMapping(value = "identity", consumes = { MediaType.APPLICATION_JSON_VALUE }, produces = {
			MediaType.APPLICATION_JSON_VALUE })
	public ResponseWrapper<IdentityStatus> updateIdentity
			(@Valid @RequestBody RequestWrapper<IdentityData> requestWrapper) throws MockIdentityException {

		ResponseWrapper response = new ResponseWrapper<IdentityStatus>();
		IdentityStatus identityStatus = new IdentityStatus();
		identityService.updateIdentity(requestWrapper.getRequest());
		identityStatus.setStatus("mock Identity data updated successfully");
		response.setResponse(identityStatus);
		response.setResponseTime(HelperUtil.getCurrentUTCDateTime());
		return response;
	}
	
	@GetMapping(value = "identity/{individualId}")
	public ResponseWrapper<IdentityData> getIdentity(@PathVariable(value = "individualId") String individualId)
			throws MockIdentityException {
		ResponseWrapper<IdentityData> response = new ResponseWrapper<>();
		response.setResponse(identityService.getIdentity(individualId));
		response.setResponseTime(HelperUtil.getCurrentUTCDateTime());
		return response;	
	}

	@PostMapping(value = "identity/add-verified-claim")
	public ResponseWrapper<VerifiedClaimStatus> createVerifiedClaim(@Valid @RequestBody RequestWrapper<VerifiedClaimRequestDto> requestWrapper) throws MockIdentityException {
		ResponseWrapper<VerifiedClaimStatus> response = new ResponseWrapper<>();
		VerifiedClaimStatus verifiedClaimStatus = new VerifiedClaimStatus();
		identityService.addVerifiedClaim(requestWrapper.getRequest());
		verifiedClaimStatus.setStatus("Verified Claim added successfully");
		response.setResponseTime(HelperUtil.getCurrentUTCDateTime());
		response.setResponse(verifiedClaimStatus);
		return response;

	}
}
