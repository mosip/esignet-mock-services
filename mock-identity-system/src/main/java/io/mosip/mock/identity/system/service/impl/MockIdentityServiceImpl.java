package io.mosip.mock.identity.system.service.impl;

import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;

import io.mosip.mock.identity.system.dto.MockAuthData;
import io.mosip.mock.identity.system.entity.MockIdentity;
import io.mosip.mock.identity.system.exception.MockIdentityException;
import io.mosip.mock.identity.system.repository.MockIdentityRepository;
import io.mosip.mock.identity.system.service.MockIdentityService;
import io.mosip.mock.identity.system.util.ErrorConstants;

@Service
public class MockIdentityServiceImpl implements MockIdentityService {
	
	@Autowired
	ObjectMapper objectmapper;

	@Autowired
	MockIdentityRepository mockIdentityRepository;

	@Override
	public void saveIdentity(MockAuthData mockAuthDataRequest) throws MockIdentityException {
		MockIdentity mockIdentity = new MockIdentity();
		try {
			mockIdentity.setIdentityJson(objectmapper.writeValueAsString(mockAuthDataRequest));
		} catch (JsonProcessingException e) {
			throw new MockIdentityException(ErrorConstants.JSON_PROCESSING_ERROR);
		}
		mockIdentity.setIndividualId(mockAuthDataRequest.getVirtualId());
		mockIdentityRepository.save(mockIdentity);
	}

	@Override
	public MockAuthData getIdentity(String individualId) throws MockIdentityException {
		Optional<MockIdentity> mockIdentity = mockIdentityRepository.findById(individualId);
		if (!mockIdentity.isPresent()) {
			throw new MockIdentityException(ErrorConstants.INVALID_VIRTUAL_ID);
		}
		MockAuthData mockAuthData = new MockAuthData();
		try {
			mockAuthData = objectmapper.readValue(mockIdentity.get().getIdentityJson(), MockAuthData.class);
		} catch (JsonProcessingException e) {
			throw new MockIdentityException(ErrorConstants.JSON_PROCESSING_ERROR);
		}
		return mockAuthData;
	}

}
