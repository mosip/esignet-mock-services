/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at https://mozilla.org/MPL/2.0/.
 */
package io.mosip.esignet.mock.identitysystem.controller;

import javax.validation.ConstraintViolation;
import javax.validation.ConstraintViolationException;
import javax.validation.Valid;

import com.fasterxml.jackson.databind.JsonNode;
import io.mosip.esignet.mock.identitysystem.dto.*;
import io.mosip.esignet.mock.identitysystem.dto.Error;
import io.mosip.esignet.mock.identitysystem.validator.IdentitySchema;
import io.mosip.kernel.core.exception.ErrorResponse;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;

import io.mosip.esignet.mock.identitysystem.exception.MockIdentityException;
import io.mosip.esignet.mock.identitysystem.service.IdentityService;
import io.mosip.esignet.mock.identitysystem.util.HelperUtil;

import java.util.ArrayList;
import java.util.List;
import java.util.Set;


@RestController
@RequestMapping("/")
public class IdentityController {

	@Autowired
	private IdentityService identityService;

	@PostMapping(value = "identity", consumes = { MediaType.APPLICATION_JSON_VALUE }, produces = {
			MediaType.APPLICATION_JSON_VALUE })
	public ResponseWrapper<IdentityStatus> createIdentity
	(@RequestBody @Valid RequestWrapper<CreateIdentity> requestWrapper) throws MockIdentityException {

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
			(@RequestBody @Valid RequestWrapper<UpdateIdentity> requestWrapper) throws MockIdentityException {

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

	@ExceptionHandler(ConstraintViolationException.class)
	public ResponseEntity handleMethodArgumentNotValidException(ConstraintViolationException ex) {
		List<Error> errors = new ArrayList<>();
		if(ex != null) {
			Set<ConstraintViolation<?>> violations = ((ConstraintViolationException) ex).getConstraintViolations();
			for(ConstraintViolation<?> cv : violations) {
				errors.add(new Error(cv.getMessage(), cv.getPropertyPath().toString() + ": " + cv.getMessage()));
			}
			return new ResponseEntity<ResponseWrapper>(getResponseWrapper(errors), HttpStatus.OK);
		}
		return ResponseEntity.status(HttpStatus.BAD_REQUEST)
				.body(errors);
	}

	@GetMapping("identity/ui-spec")
	public ResponseWrapper<JsonNode> getUiSpec() {
		ResponseWrapper<JsonNode> responseWrapper = new ResponseWrapper<>();
		responseWrapper.setResponse(identityService.getSchema());
		return responseWrapper;
	}

	private ResponseWrapper getResponseWrapper(List<Error> errors) {
		ResponseWrapper responseWrapper = new ResponseWrapper<>();
		responseWrapper.setResponseTime(HelperUtil.getCurrentUTCDateTime());
		responseWrapper.setErrors(errors);
		return responseWrapper;
	}
}
