package io.mosip.esignet.mock.identitysystem.service.impl;

import java.time.LocalDateTime;
import java.util.Optional;

import io.mosip.esignet.mock.identitysystem.dto.VerifiedClaimRequestDto;
import io.mosip.esignet.mock.identitysystem.entity.VerifiedClaim;
import io.mosip.esignet.mock.identitysystem.repository.VerifiedClaimRepository;
import io.mosip.esignet.mock.identitysystem.service.AuthenticationService;
import io.mosip.esignet.mock.identitysystem.util.HelperUtil;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;

import io.mosip.esignet.mock.identitysystem.dto.IdentityData;
import io.mosip.esignet.mock.identitysystem.entity.MockIdentity;
import io.mosip.esignet.mock.identitysystem.exception.MockIdentityException;
import io.mosip.esignet.mock.identitysystem.repository.IdentityRepository;
import io.mosip.esignet.mock.identitysystem.service.IdentityService;
import io.mosip.esignet.mock.identitysystem.util.ErrorConstants;

import static io.mosip.esignet.mock.identitysystem.util.HelperUtil.ALGO_SHA3_256;

@Service
public class IdentityServiceImpl implements IdentityService {

	@Value("${mosip.mock.ida.kbi.default.field-language}")
	private String fieldLang;
	
	@Autowired
	ObjectMapper objectmapper;

	@Autowired
	IdentityRepository identityRepository;

	@Autowired
	VerifiedClaimRepository verifiedClaimRepository;

	@Override
	public void addIdentity(IdentityData identityData) throws MockIdentityException {
		if (identityRepository.findById(identityData.getIndividualId()).isPresent()) {
			throw new MockIdentityException(ErrorConstants.DUPLICATE_INDIVIDUAL_ID);
		}
		MockIdentity mockIdentity = new MockIdentity();
		try {
			mockIdentity.setIdentityJson(objectmapper.writeValueAsString(identityData));
		} catch (JsonProcessingException e) {
			throw new MockIdentityException(ErrorConstants.JSON_PROCESSING_ERROR);
		}
		mockIdentity.setIndividualId(identityData.getIndividualId());
		identityRepository.save(mockIdentity);
	}

	@Override
	public IdentityData getIdentity(String individualId) throws MockIdentityException {
		Optional<MockIdentity> mockIdentity = identityRepository.findById(individualId);
		if (!mockIdentity.isPresent()) {
			throw new MockIdentityException(ErrorConstants.INVALID_INDIVIDUAL_ID);
		}
		IdentityData identityData = new IdentityData();
		try {
			identityData = objectmapper.readValue(mockIdentity.get().getIdentityJson(), IdentityData.class);
		} catch (JsonProcessingException e) {
			throw new MockIdentityException(ErrorConstants.JSON_PROCESSING_ERROR);
		}
		return identityData;
	}

	@Override
	public void addVerifiedClaim(VerifiedClaimRequestDto verifiedClaimRequestDto) throws MockIdentityException {
		VerifiedClaim verifiedClaim =null;
		IdentityData identity = getIdentity(verifiedClaimRequestDto.getIndividualId());
		Object fieldValue= HelperUtil.getIdentityDataFieldValue(identity, verifiedClaimRequestDto.getClaim(),fieldLang);
		if(fieldValue==null){
			throw new MockIdentityException(ErrorConstants.INVALID_CLAIM);
		}
		String idHash= HelperUtil.generateB64EncodedHash(ALGO_SHA3_256, verifiedClaimRequestDto.getIndividualId()+ verifiedClaimRequestDto.getTrustFramework().toLowerCase()+ verifiedClaimRequestDto.getClaim());
		Optional<VerifiedClaim> verifiedClaimOptional=verifiedClaimRepository.findById(idHash);
		if(verifiedClaimOptional.isPresent()){
			throw new MockIdentityException(ErrorConstants.CLAIM_ALREADY_EXISTS);
		}
		verifiedClaim = new VerifiedClaim();
		verifiedClaim.setId(idHash);
		verifiedClaim.setClaim(verifiedClaimRequestDto.getClaim());
		verifiedClaim.setIndividualId(verifiedClaimRequestDto.getIndividualId());
		verifiedClaim.setVerifiedDateTime(verifiedClaimRequestDto.getVerifiedDateTime());
		verifiedClaim.setTrustFramework(verifiedClaimRequestDto.getTrustFramework());
		verifiedClaim.setCrDateTime(LocalDateTime.now());
		verifiedClaim.setActive(true);
		verifiedClaimRepository.save(verifiedClaim);
	}

}
