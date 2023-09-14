package io.mosip.esignet.mock.integration.service;

import java.io.IOException;
import java.net.URI;
import java.net.URISyntaxException;
import java.security.GeneralSecurityException;
import java.time.LocalDateTime;
import java.time.ZoneId;
import java.time.ZoneOffset;
import java.time.ZonedDateTime;
import java.time.format.DateTimeFormatter;
import java.util.Arrays;
import java.util.Date;
import java.util.HashMap;
import java.util.Map;

import io.mosip.esignet.api.exception.VCIExchangeException;
import io.mosip.esignet.api.util.ErrorConstants;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.autoconfigure.condition.ConditionalOnProperty;
import org.springframework.stereotype.Component;

import foundation.identity.jsonld.ConfigurableDocumentLoader;
import foundation.identity.jsonld.JsonLDException;
import foundation.identity.jsonld.JsonLDObject;
import info.weboftrust.ldsignatures.LdProof;
import info.weboftrust.ldsignatures.canonicalizer.URDNA2015Canonicalizer;
import io.mosip.esignet.api.dto.VCRequestDto;
import io.mosip.esignet.api.dto.VCResult;
import io.mosip.esignet.api.spi.VCIssuancePlugin;
import io.mosip.kernel.core.util.CryptoUtil;
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

	private ConfigurableDocumentLoader confDocumentLoader = null;

	@Value("${mosip.esignet.mock.vciplugin.verification-method}")
	private String verificationMethod;

	public static final String UTC_DATETIME_PATTERN = "yyyy-MM-dd'T'HH:mm:ss.SSS'Z'";

	public static final String OIDC_SERVICE_APP_ID = "OIDC_SERVICE";

	@Override
	public VCResult<JsonLDObject> getVerifiableCredentialWithLinkedDataProof(VCRequestDto vcRequestDto, String holderId,
			Map<String, Object> identityDetails) throws VCIExchangeException {
		JsonLDObject vcJsonLdObject = null;
		try {
			VCResult vcResult = new VCResult();
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
		Map<String, Object> formattedMap = new HashMap<>();
		formattedMap.put("id", holderId);
		formattedMap.put("name", "John Doe");
		formattedMap.put("email", "john.doe@mail.com");
		formattedMap.put("gender", "Male");

		Map<String, Object> verCredJsonObject = new HashMap<>();
		verCredJsonObject.put("@context", Arrays.asList("https://www.w3.org/2018/credentials/v1", "https://schema.org/"));
		verCredJsonObject.put("type", Arrays.asList("VerifiableCredential", "Person"));
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

	private static String getUTCDateTime() {
		return ZonedDateTime.now(ZoneOffset.UTC).format(DateTimeFormatter.ofPattern(UTC_DATETIME_PATTERN));
	}

	@Override
	public VCResult<String> getVerifiableCredential(VCRequestDto vcRequestDto, String holderId,
			Map<String, Object> identityDetails) throws VCIExchangeException {
		throw new VCIExchangeException(ErrorConstants.NOT_IMPLEMENTED);
	}

}
