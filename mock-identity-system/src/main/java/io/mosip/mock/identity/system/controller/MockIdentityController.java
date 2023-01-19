package io.mosip.mock.identity.system.controller;

import javax.validation.Valid;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.MediaType;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import io.mosip.mock.identity.system.dto.MockAuthData;
import io.mosip.mock.identity.system.dto.MockAuthDataResponse;
import io.mosip.mock.identity.system.dto.RequestWrapper;
import io.mosip.mock.identity.system.dto.ResponseWrapper;
import io.mosip.mock.identity.system.exception.MockIdentityException;
import io.mosip.mock.identity.system.service.MockIdentityService;
import io.mosip.mock.identity.system.util.MockIdentityUtil;


@RestController
@RequestMapping("/")
public class MockIdentityController {

	@Autowired
	private MockIdentityService mockIdentityService;

	@PostMapping(value = "mock-identity", consumes = { MediaType.APPLICATION_JSON_VALUE }, produces = {
			MediaType.APPLICATION_JSON_VALUE })
	public ResponseWrapper<MockAuthDataResponse> createMockIdentity
	(@Valid @RequestBody RequestWrapper<MockAuthData> requestWrapper) throws MockIdentityException {

		ResponseWrapper response = new ResponseWrapper<MockAuthDataResponse>();
		MockAuthDataResponse mockAuthDataResponse = new MockAuthDataResponse();
		mockIdentityService.saveIdentity(requestWrapper.getRequest());
		mockAuthDataResponse.setStatus("mock auth data created successfully");
		response.setResponse(mockAuthDataResponse);
		response.setResponseTime(MockIdentityUtil.getUTCDateTime());
		return response;
	}
	
	@GetMapping(value = "mock-identity/{virtual-id}")
	public ResponseWrapper<MockAuthData> getMockIdentity(@PathVariable(value = "virtual-id") String virtualId)
			throws MockIdentityException {
		ResponseWrapper<MockAuthData> response = new ResponseWrapper<>();
		response.setResponse(mockIdentityService.getIdentity(virtualId));
		response.setResponseTime(MockIdentityUtil.getUTCDateTime());
		return response;	
	}
}
