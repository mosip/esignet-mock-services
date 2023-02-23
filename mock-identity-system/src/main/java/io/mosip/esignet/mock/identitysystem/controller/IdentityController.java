package io.mosip.esignet.mock.identitysystem.controller;

import javax.validation.Valid;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.MediaType;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import io.mosip.esignet.mock.identitysystem.dto.IdentityData;
import io.mosip.esignet.mock.identitysystem.dto.IdentityStatus;
import io.mosip.esignet.mock.identitysystem.dto.RequestWrapper;
import io.mosip.esignet.mock.identitysystem.dto.ResponseWrapper;
import io.mosip.esignet.mock.identitysystem.exception.MockIdentityException;
import io.mosip.esignet.mock.identitysystem.service.IdentityService;
import io.mosip.esignet.mock.identitysystem.util.HelperUtil;


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
	
	@GetMapping(value = "identity/{individualId}")
	public ResponseWrapper<IdentityData> getIdentity(@PathVariable(value = "individualId") String individualId)
			throws MockIdentityException {
		ResponseWrapper<IdentityData> response = new ResponseWrapper<>();
		response.setResponse(identityService.getIdentity(individualId));
		response.setResponseTime(HelperUtil.getCurrentUTCDateTime());
		return response;	
	}
}
