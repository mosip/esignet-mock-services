/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at https://mozilla.org/MPL/2.0/.
 */
package io.mosip.esignet.mock.integration.service;

import java.io.IOException;
import java.net.URI;
import java.net.URISyntaxException;
import java.security.GeneralSecurityException;
import java.security.Key;
import java.time.LocalDateTime;
import java.time.ZoneId;
import java.time.ZoneOffset;
import java.time.ZonedDateTime;
import java.time.format.DateTimeFormatter;
import java.util.Arrays;
import java.util.Date;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Objects;

import javax.crypto.Cipher;

import io.mosip.esignet.api.exception.VCIExchangeException;
import io.mosip.esignet.api.util.ErrorConstants;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.autoconfigure.condition.ConditionalOnProperty;
import org.springframework.cache.CacheManager;
import org.springframework.stereotype.Component;
import org.springframework.web.client.RestTemplate;

import foundation.identity.jsonld.ConfigurableDocumentLoader;
import foundation.identity.jsonld.JsonLDException;
import foundation.identity.jsonld.JsonLDObject;
import info.weboftrust.ldsignatures.LdProof;
import info.weboftrust.ldsignatures.canonicalizer.URDNA2015Canonicalizer;
import io.mosip.esignet.api.dto.VCRequestDto;
import io.mosip.esignet.api.dto.VCResult;
import io.mosip.esignet.api.spi.VCIssuancePlugin;
import io.mosip.esignet.core.dto.OIDCTransaction;
import io.mosip.esignet.core.dto.vci.ParsedAccessToken;
import io.mosip.esignet.core.exception.EsignetException;
import io.mosip.esignet.core.util.IdentityProviderUtil;
import io.mosip.kernel.core.keymanager.spi.KeyStore;
import io.mosip.kernel.core.util.CryptoUtil;
import io.mosip.kernel.keymanagerservice.constant.KeymanagerConstant;
import io.mosip.kernel.keymanagerservice.entity.KeyAlias;
import io.mosip.kernel.keymanagerservice.helper.KeymanagerDBHelper;
import io.mosip.kernel.signature.dto.JWTSignatureRequestDto;
import io.mosip.kernel.signature.dto.JWTSignatureResponseDto;
import io.mosip.kernel.signature.service.SignatureService;
import lombok.extern.slf4j.Slf4j;

@ConditionalOnProperty(value = "mosip.esignet.integration.vci-plugin", havingValue = "MockVCIssuancePlugin")
@Component
@Slf4j
public class MockVCIssuancePlugin implements VCIssuancePlugin {
	@Autowired
	private SignatureService signatureService;

	@Autowired
	private ParsedAccessToken parsedAccessToken;

	@Autowired
	private CacheManager cacheManager;

	@Autowired
	private KeyStore keyStore;

	@Autowired
	private KeymanagerDBHelper dbHelper;

	private ConfigurableDocumentLoader confDocumentLoader = null;

	@Value("${mosip.esignet.mock.vciplugin.verification-method}")
	private String verificationMethod;

	@Value("${mosip.esignet.mock.authenticator.get-identity-url}")
	private String getIdentityUrl;

	@Value("${mosip.esignet.cache.security.secretkey.reference-id}")
	private String cacheSecretKeyRefId;

	@Value("${mosip.esignet.cache.security.algorithm-name}")
	private String aesECBTransformation;

	@Value("${mosip.esignet.cache.secure.individual-id}")
	private boolean secureIndividualId;

	@Value("${mosip.esignet.cache.store.individual-id}")
	private boolean storeIndividualId;

	@Value("#{${mosip.esignet.mock.vciplugin.vc-credential-contexts:{'https://www.w3.org/2018/credentials/v1','https://schema.org/'}}}")
	private List<String> vcCredentialContexts;

	public static final String UTC_DATETIME_PATTERN = "yyyy-MM-dd'T'HH:mm:ss.SSS'Z'";

	public static final String OIDC_SERVICE_APP_ID = "OIDC_SERVICE";

	@Override
	public VCResult<JsonLDObject> getVerifiableCredentialWithLinkedDataProof(VCRequestDto vcRequestDto, String holderId,
			Map<String, Object> identityDetails) throws VCIExchangeException {
		JsonLDObject vcJsonLdObject = null;
		try {
			VCResult<JsonLDObject> vcResult = new VCResult<>();
			vcJsonLdObject = buildDummyJsonLDWithLDProof(holderId);
			vcResult.setCredential(vcJsonLdObject);
			vcResult.setFormat("ldp_vc");
			return vcResult;
		} catch (Exception e) {
			log.error("Failed to build mock VC", e);
		}
		throw new VCIExchangeException();
	}

	private JsonLDObject buildDummyJsonLDWithLDProof(String holderId)
			throws IOException, GeneralSecurityException, JsonLDException, URISyntaxException {
		OIDCTransaction transaction = getUserInfoTransaction(parsedAccessToken.getAccessTokenHash());
		Map<String, Object> formattedMap = null;
		try{
			formattedMap = getIndividualData(transaction);
		} catch(Exception e) {
			log.error("Unable to get KYC exchange data from MOCK", e);
		}

		Map<String, Object> verCredJsonObject = new HashMap<>();
		verCredJsonObject.put("@context", vcCredentialContexts);
		verCredJsonObject.put("type", Arrays.asList("VerifiableCredential", "MOSIPVerifiableCredential"));
		verCredJsonObject.put("id", "urn:uuid:3978344f-8596-4c3a-a978-8fcaba3903c5");
		verCredJsonObject.put("issuer", "did:example:123456789");
		verCredJsonObject.put("issuanceDate", getUTCDateTime());
		verCredJsonObject.put("credentialSubject", formattedMap);

		JsonLDObject vcJsonLdObject = JsonLDObject.fromJsonObject(verCredJsonObject);
		vcJsonLdObject.setDocumentLoader(confDocumentLoader);
		// vc proof
		Date created = Date
				.from(LocalDateTime
						.parse((String) verCredJsonObject.get("issuanceDate"),
								DateTimeFormatter.ofPattern(UTC_DATETIME_PATTERN))
						.atZone(ZoneId.systemDefault()).toInstant());
		LdProof vcLdProof = LdProof.builder().defaultContexts(false).defaultTypes(false).type("RsaSignature2018")
				.created(created).proofPurpose("assertionMethod")
				.verificationMethod(URI.create(verificationMethod))
				.build();

		URDNA2015Canonicalizer canonicalizer = new URDNA2015Canonicalizer();
		byte[] vcSignBytes = canonicalizer.canonicalize(vcLdProof, vcJsonLdObject);
		String vcEncodedData = CryptoUtil.encodeToURLSafeBase64(vcSignBytes);

		JWTSignatureRequestDto jwtSignatureRequestDto = new JWTSignatureRequestDto();
		jwtSignatureRequestDto.setApplicationId(OIDC_SERVICE_APP_ID);
		jwtSignatureRequestDto.setReferenceId("");
		jwtSignatureRequestDto.setIncludePayload(false);
		jwtSignatureRequestDto.setIncludeCertificate(true);
		jwtSignatureRequestDto.setIncludeCertHash(true);
		jwtSignatureRequestDto.setDataToSign(vcEncodedData);
		JWTSignatureResponseDto responseDto = signatureService.jwtSign(jwtSignatureRequestDto);
		LdProof ldProofWithJWS = LdProof.builder().base(vcLdProof).defaultContexts(false)
				.jws(responseDto.getJwtSignedData()).build();
		ldProofWithJWS.addToJsonLDObject(vcJsonLdObject);
		return vcJsonLdObject;
	}

	private Map<String, Object> getIndividualData(OIDCTransaction transaction){
		String individualId = getIndividualId(transaction);
		if (individualId!=null){
			Map<String, Object> res = new RestTemplate().getForObject(
				getIdentityUrl+"/"+individualId,
				HashMap.class);
			res = (Map<String, Object>)res.get("response");
			Map<String, Object> ret = new HashMap<>();
			ret.put("vcVer", "VC-V1");
			ret.put("id", getIdentityUrl+"/"+individualId);
			ret.put("UIN", individualId);
			ret.put("name", res.get("name"));
			ret.put("fullName", res.get("fullName"));
			ret.put("gender", res.get("gender"));
			ret.put("dateOfBirth", res.get("dateOfBirth"));
			ret.put("email", res.get("email"));
			ret.put("phone", res.get("phone"));
			ret.put("addressLine1", res.get("streetAddress"));
			ret.put("province", res.get("locality"));
			ret.put("region", res.get("region"));
			ret.put("postalCode", res.get("postalCode"));
			ret.put("face", res.get("encodedPhoto"));
			return ret;
		} else {
			return new HashMap<>();
		}
	}

	protected String getIndividualId(OIDCTransaction transaction) {
		if(!storeIndividualId)
			return null;
		return secureIndividualId ? decryptIndividualId(transaction.getIndividualId()) : transaction.getIndividualId();
	}

	private String decryptIndividualId(String encryptedIndividualId) {
		try {
			Cipher cipher = Cipher.getInstance(aesECBTransformation);
			byte[] decodedBytes = IdentityProviderUtil.b64Decode(encryptedIndividualId);
			cipher.init(Cipher.DECRYPT_MODE, getSecretKeyFromHSM());
			return new String(cipher.doFinal(decodedBytes, 0, decodedBytes.length));
		} catch(Exception e) {
			log.error("Error Cipher Operations of provided secret data.", e);
			throw new EsignetException(io.mosip.esignet.core.constants.ErrorConstants.AES_CIPHER_FAILED);
		}
	}

	private Key getSecretKeyFromHSM() {
		String keyAlias = getKeyAlias(OIDC_SERVICE_APP_ID, cacheSecretKeyRefId);
		if (Objects.nonNull(keyAlias)) {
			return keyStore.getSymmetricKey(keyAlias);
		}
		throw new EsignetException(io.mosip.esignet.core.constants.ErrorConstants.NO_UNIQUE_ALIAS);
	}

	private String getKeyAlias(String keyAppId, String keyRefId) {
		Map<String, List<KeyAlias>> keyAliasMap = dbHelper.getKeyAliases(keyAppId, keyRefId, LocalDateTime.now(ZoneOffset.UTC));
		List<KeyAlias> currentKeyAliases = keyAliasMap.get(KeymanagerConstant.CURRENTKEYALIAS);
		if (!currentKeyAliases.isEmpty() && currentKeyAliases.size() == 1) {
			return currentKeyAliases.get(0).getAlias();
		}
		log.error("CurrentKeyAlias is not unique. KeyAlias count: {}", currentKeyAliases.size());
		throw new EsignetException(io.mosip.esignet.core.constants.ErrorConstants.NO_UNIQUE_ALIAS);
	}

	private static String getUTCDateTime() {
		return ZonedDateTime.now(ZoneOffset.UTC).format(DateTimeFormatter.ofPattern(UTC_DATETIME_PATTERN));
	}

	@Override
	public VCResult<String> getVerifiableCredential(VCRequestDto vcRequestDto, String holderId,
			Map<String, Object> identityDetails) throws VCIExchangeException {
		throw new VCIExchangeException(ErrorConstants.NOT_IMPLEMENTED);
	}

	public OIDCTransaction getUserInfoTransaction(String accessTokenHash) {
		return cacheManager.getCache(io.mosip.esignet.core.constants.Constants.USERINFO_CACHE).get(accessTokenHash, OIDCTransaction.class);
	}
}
