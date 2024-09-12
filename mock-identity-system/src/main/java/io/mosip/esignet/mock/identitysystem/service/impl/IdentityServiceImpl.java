/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at https://mozilla.org/MPL/2.0/.
 */
package io.mosip.esignet.mock.identitysystem.service.impl;

import java.time.LocalDateTime;
import java.time.ZoneOffset;
import java.util.Map;
import java.util.Map.Entry;
import java.util.Optional;

import com.fasterxml.jackson.databind.JsonNode;
import io.mosip.esignet.mock.identitysystem.dto.VerifiedClaimRequestDto;
import io.mosip.esignet.mock.identitysystem.entity.VerifiedClaim;
import io.mosip.esignet.mock.identitysystem.repository.VerifiedClaimRepository;
import io.mosip.esignet.mock.identitysystem.util.HelperUtil;
import lombok.extern.slf4j.Slf4j;
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
import org.springframework.util.StringUtils;

import static io.mosip.esignet.mock.identitysystem.util.HelperUtil.ALGO_SHA3_256;

@Slf4j
@Service
public class IdentityServiceImpl implements IdentityService {

	@Value("${mosip.mock.ida.kbi.default.field-language}")
	private String fieldLang;

	@Value("#{${mosip.mock.ida.identity-openid-claims-mapping}}")
	private Map<String,String> oidcClaimsMapping;
	
	@Autowired
	ObjectMapper objectMapper;

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
			mockIdentity.setIdentityJson(objectMapper.writeValueAsString(identityData));
		} catch (JsonProcessingException e) {
			throw new MockIdentityException(ErrorConstants.JSON_PROCESSING_ERROR);
		}
		mockIdentity.setIndividualId(identityData.getIndividualId());
		identityRepository.save(mockIdentity);
	}

	@Override
	public void updateIdentity(IdentityData identityData) throws MockIdentityException {
		if (!identityRepository.findById(identityData.getIndividualId()).isPresent()) {
			throw new MockIdentityException(ErrorConstants.INVALID_INDIVIDUAL_ID);
		}
		MockIdentity mockIdentity = new MockIdentity();
		try {
			mockIdentity.setIdentityJson(objectMapper.writeValueAsString(identityData));
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
			identityData = objectMapper.readValue(mockIdentity.get().getIdentityJson(), IdentityData.class);
		} catch (JsonProcessingException e) {
			throw new MockIdentityException(ErrorConstants.JSON_PROCESSING_ERROR);
		}
		return identityData;
	}

	@Override
	public JsonNode getIdentityV2(String individualId) throws MockIdentityException {
		Optional<MockIdentity> mockIdentity = identityRepository.findById(individualId);
		if (!mockIdentity.isPresent()) {
			throw new MockIdentityException(ErrorConstants.INVALID_INDIVIDUAL_ID);
		}
		try {
			return objectMapper.readTree(mockIdentity.get().getIdentityJson());
		} catch (JsonProcessingException e) {
			throw new MockIdentityException(ErrorConstants.JSON_PROCESSING_ERROR);
		}
	}



	@Override
	public void addVerifiedClaim(VerifiedClaimRequestDto verifiedClaimRequestDto) throws MockIdentityException {
		JsonNode identity = getIdentityV2(verifiedClaimRequestDto.getIndividualId());

        for(Entry<String, JsonNode> entry : verifiedClaimRequestDto.getVerificationDetail().entrySet()){
			Object fieldValue = HelperUtil.getIdentityDataValue(identity, entry.getKey(), fieldLang);
			if(fieldValue==null){
				log.error("Verification data is not allowed for the claim with no data : {}", entry.getKey());
				throw new MockIdentityException(ErrorConstants.INVALID_CLAIM);
			}

			String trustFramework = entry.getValue().get("trust_framework").asText();
			if(StringUtils.isEmpty(trustFramework))
				throw new MockIdentityException(ErrorConstants.INVALID_REQUEST);

			String idHash= HelperUtil.generateB64EncodedHash(ALGO_SHA3_256, verifiedClaimRequestDto.getIndividualId()+
					trustFramework.toLowerCase() + entry.getKey());

			String oidcClaimName = oidcClaimsMapping.getOrDefault(entry.getKey(), entry.getKey());
			Optional<VerifiedClaim> result = verifiedClaimRepository.findById(idHash);
			VerifiedClaim verifiedClaim;
			if(result.isEmpty()) {
				verifiedClaim = new VerifiedClaim();
				verifiedClaim.setId(idHash);
				verifiedClaim.setClaim(oidcClaimName);
				verifiedClaim.setIndividualId(verifiedClaimRequestDto.getIndividualId());
				verifiedClaim.setTrustFramework(trustFramework);
				verifiedClaim.setCrDateTime(LocalDateTime.now(ZoneOffset.UTC));
			}
			else {
				verifiedClaim = result.get();
			}

			verifiedClaim.setDetail(entry.getValue().toString());
			verifiedClaim.setUpdDateTime(LocalDateTime.now(ZoneOffset.UTC));
			verifiedClaim.setIsActive(verifiedClaimRequestDto.isActive());
			verifiedClaimRepository.save(verifiedClaim);
		}
	}

}
