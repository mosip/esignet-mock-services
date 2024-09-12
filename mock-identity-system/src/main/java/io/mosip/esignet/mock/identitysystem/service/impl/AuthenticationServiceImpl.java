/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at https://mozilla.org/MPL/2.0/.
 */
package io.mosip.esignet.mock.identitysystem.service.impl;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.node.ArrayNode;
import com.fasterxml.jackson.databind.node.ObjectNode;
import com.nimbusds.jose.jwk.RSAKey;
import io.mosip.esignet.mock.identitysystem.dto.*;
import io.mosip.esignet.mock.identitysystem.entity.KycAuth;
import io.mosip.esignet.mock.identitysystem.entity.VerifiedClaim;
import io.mosip.esignet.mock.identitysystem.exception.MockIdentityException;
import io.mosip.esignet.mock.identitysystem.repository.AuthRepository;
import io.mosip.esignet.mock.identitysystem.repository.VerifiedClaimRepository;
import io.mosip.esignet.mock.identitysystem.service.AuthenticationService;
import io.mosip.esignet.mock.identitysystem.service.IdentityService;
import io.mosip.esignet.mock.identitysystem.util.ErrorConstants;
import io.mosip.esignet.mock.identitysystem.util.HelperUtil;
import io.mosip.kernel.core.util.StringUtils;
import io.mosip.kernel.signature.dto.JWTSignatureRequestDto;
import io.mosip.kernel.signature.dto.JWTSignatureResponseDto;
import io.mosip.kernel.signature.service.SignatureService;
import lombok.extern.slf4j.Slf4j;

import org.jose4j.jwe.ContentEncryptionAlgorithmIdentifiers;
import org.jose4j.jwe.JsonWebEncryption;
import org.jose4j.jwe.KeyManagementAlgorithmIdentifiers;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.util.CollectionUtils;

import java.nio.charset.StandardCharsets;
import java.security.MessageDigest;
import java.security.NoSuchAlgorithmException;
import java.text.SimpleDateFormat;
import java.time.LocalDateTime;
import java.time.ZoneOffset;
import java.time.temporal.ChronoUnit;
import java.util.*;
import java.util.stream.Collectors;
import java.util.stream.StreamSupport;

import static io.mosip.esignet.mock.identitysystem.util.Constants.APPLICATION_ID;
import static io.mosip.esignet.mock.identitysystem.util.HelperUtil.ALGO_SHA3_256;


@Service
@Slf4j
public class AuthenticationServiceImpl implements AuthenticationService {

    private static final String PSUT_FORMAT = "%s%s";
    private static final String OTP_VALUE = "111111";

    private final String FIELD_ID_KEY="id";

    @Autowired
    private AuthRepository authRepository;

    @Autowired
    private IdentityService identityService;

    @Autowired
    private ObjectMapper objectMapper;

    @Autowired
    private SignatureService signatureService;

    @Autowired
    private VerifiedClaimRepository verifiedClaimRepository;

    @Value("${mosip.mock.ida.kyc.transaction-timeout-secs:60}")
    private int transactionTimeoutInSecs;

    @Value("${mosip.mock.ida.kyc.encrypt:false}")
    private boolean encryptKyc;
    
    @Value("${mosip.mock.ida.hash-algo:MD5}")
    private String hashAlgorithm;

    @Value("${mosip.mock.ida.kyc.default-language:eng}")
    private String defaultLanguage;

    @Value("${mosip.esignet.mock.authenticator.ida.otp-channels}")
    private List<String> otpChannels;

    @Value("#{${mosip.esignet.authenticator.auth-factor.kbi.field-details}}")
    private List<Map<String,String>> fieldDetailList;

    @Value("${mosip.mock.ida.kbi.default.field-language}")
    private String fieldLang;

    @Value("#{${mosip.mock.ida.identity-openid-claims-mapping}}")
    private Map<String,String> oidcClaimsMapping;

    ArrayList<String> trnHash = new ArrayList<>();

    @Override
    public KycAuthResponseDto kycAuth(String relyingPartyId, String clientId, KycAuthDto kycAuthDto) throws MockIdentityException {
        //TODO validate relying party Id and client Id

        JsonNode identityData = identityService.getIdentityV2(kycAuthDto.getIndividualId());
        if (identityData == null) {
            throw new MockIdentityException(ErrorConstants.INVALID_INDIVIDUAL_ID);
        }
        Boolean authStatus=doKycAuthentication(kycAuthDto,identityData);

        KycAuth kycAuth = saveKycAuthTransaction(kycAuthDto.getTransactionId(), relyingPartyId,
                kycAuthDto.getIndividualId());

        KycAuthResponseDto kycAuthResponseDto = new KycAuthResponseDto();
        kycAuthResponseDto.setAuthStatus(authStatus);
        kycAuthResponseDto.setKycToken(kycAuth.getKycToken());
        kycAuthResponseDto.setPartnerSpecificUserToken(kycAuth.getPartnerSpecificUserToken());

        if(kycAuthDto.isClaimMetadataRequired()) {
            kycAuthResponseDto.setClaimMetadata(getVerifiedClaimMetadata(kycAuthDto.getIndividualId(), identityData));
        }

        return kycAuthResponseDto;
    }

    private Map<String,List<JsonNode>> getVerifiedClaimMetadata(String individualId, JsonNode identityData) {
        Optional<List<VerifiedClaim>> result = verifiedClaimRepository.findByIndividualIdAndIsActive(individualId, true);
        Map<String, List<VerifiedClaim>> verifiedClaims = result.map(claims -> claims.stream()
                .collect(Collectors.groupingBy(VerifiedClaim::getClaim))).orElseGet(HashMap::new);

        Map<String,List<JsonNode>> claimMetadataMap = new HashMap<>();
        for(String fieldId : oidcClaimsMapping.keySet()) {
            if(identityData.hasNonNull(fieldId)) {
                List<JsonNode> verificationList = new ArrayList<>();
                for(VerifiedClaim verifiedClaim : verifiedClaims.getOrDefault(oidcClaimsMapping.get(fieldId), Collections.emptyList())) {
                    try {
                        verificationList.add(objectMapper.readTree(verifiedClaim.getDetail()));
                    } catch (Exception e) {
                        log.error("Failed to process the verification data : {}", verifiedClaim.getDetail(), e);
                    }
                }
                claimMetadataMap.put(oidcClaimsMapping.getOrDefault(fieldId, fieldId), verificationList);
            }
        }
        return claimMetadataMap;
    }

    @Override
    public KycExchangeResponseDto kycExchange(String relyingPartyId, String clientId, KycExchangeDto kycExchangeDto) throws MockIdentityException {
        //TODO validate relying party Id and client Id
        Optional<KycAuth> result = authRepository.findByKycTokenAndValidityAndTransactionIdAndIndividualId
                (kycExchangeDto.getKycToken(), Valid.ACTIVE, kycExchangeDto.getTransactionId(),
                        kycExchangeDto.getIndividualId());

        if (!result.isPresent())
            throw new MockIdentityException("mock-ida-006");

        LocalDateTime savedTime = result.get().getResponseTime();
        long seconds = savedTime.until(kycExchangeDto.getRequestDateTime(), ChronoUnit.SECONDS);
        if (seconds < 0 || seconds > transactionTimeoutInSecs) {
            result.get().setValidity(Valid.EXPIRED);
            authRepository.save(result.get());
            throw new MockIdentityException("mock-ida-007");
        }

        try {
            if(kycExchangeDto.getAcceptedClaimDetail() == null) { kycExchangeDto.setAcceptedClaimDetail(new HashMap<>()); }
            if(kycExchangeDto.getAcceptedClaims() != null) {
                for(String acceptedClaim : kycExchangeDto.getAcceptedClaims()) {
                    if(!kycExchangeDto.getAcceptedClaimDetail().containsKey(acceptedClaim)) {
                        kycExchangeDto.getAcceptedClaimDetail().put(acceptedClaim, null);
                    }
                }
            }

            JsonNode identityData = identityService.getIdentityV2(kycExchangeDto.getIndividualId());
            if (identityData == null) {
                throw new MockIdentityException("mock-ida-001");
            }
            Map<String, Object> kyc = buildKycDataBasedOnPolicy(kycExchangeDto.getIndividualId(), identityData,
                    kycExchangeDto.getAcceptedClaimDetail(), kycExchangeDto.getClaimLocales());
            kyc.put("sub", result.get().getPartnerSpecificUserToken());

            result.get().setValidity(Valid.PROCESSED);
            authRepository.save(result.get());

            String finalKyc = this.encryptKyc ? getJWE(relyingPartyId, signKyc(kyc)) : signKyc(kyc);
            KycExchangeResponseDto kycExchangeResponseDto = new KycExchangeResponseDto();
            kycExchangeResponseDto.setKyc(finalKyc);
            return kycExchangeResponseDto;
        } catch (Exception ex) {
            log.error("Failed to build kyc data", ex);
            throw new MockIdentityException("mock-ida-008");
        }
    }

    @Override
    public SendOtpResult sendOtp(String relyingPartyId, String clientId, SendOtpDto sendOtpDto) throws MockIdentityException {
        //TODO validate relying party Id and client Id

        IdentityData identityData = identityService.getIdentity(sendOtpDto.getIndividualId());
        if (identityData == null) {
            log.error("Provided individual Id not found {}", sendOtpDto.getIndividualId());
            throw new MockIdentityException("invalid_individual_id");
        }

        if (!sendOtpDto.getOtpChannels().stream().allMatch(this::isSupportedOtpChannel)) {
            log.error("Invalid Otp Channels");
            throw new MockIdentityException("invalid_otp_channel");
        }

        String maskedEmailId = null;
        String maskedMobile = null;
        for (String channel : sendOtpDto.getOtpChannels()) {
            if (channel.equalsIgnoreCase("email")) {
                maskedEmailId = HelperUtil.maskEmail(identityData.getEmail());
            }
            if (channel.equalsIgnoreCase("phone") || channel.equalsIgnoreCase("mobile")) {
                maskedMobile = HelperUtil.maskMobile(identityData.getPhone());
            }
        }

        if(org.springframework.util.StringUtils.isEmpty(maskedEmailId) &&
                org.springframework.util.StringUtils.isEmpty(maskedMobile)) {
            log.error("neither email id nor mobile number found for the given individualId");
            throw new MockIdentityException("no_email_mobile_found");
        }

        var trn_token_hash = HelperUtil.generateB64EncodedHash(ALGO_SHA3_256,
                String.format(sendOtpDto.getTransactionId(), sendOtpDto.getIndividualId(), OTP_VALUE));

        trnHash.add(trn_token_hash);
        return new SendOtpResult(sendOtpDto.getTransactionId(), maskedEmailId, maskedMobile);
    }

    private Boolean doKycAuthentication(KycAuthDto kycAuthDto, JsonNode identityData){
        boolean authStatus=false;
        if (kycAuthDto.getOtp() != null) {
            //check if the trn is available and active
            if (StringUtils.isEmpty(kycAuthDto.getTransactionId())) {
                log.error("Invalid transaction Id");
                throw new MockIdentityException("invalid_transaction_id");
            }

            var trn_hash = HelperUtil.generateB64EncodedHash(ALGO_SHA3_256,
                    String.format(kycAuthDto.getTransactionId(), kycAuthDto.getIndividualId(), OTP_VALUE));

            var isValid = trnHash.contains(trn_hash);
            if (isValid) {
                authStatus = kycAuthDto.getOtp().equals(OTP_VALUE);
                if (authStatus)
                    trnHash.remove(trn_hash);
                else
                    throw new MockIdentityException("auth_failed");
            } else {
                throw new MockIdentityException("invalid_transaction");
            }
        }

        if (kycAuthDto.getPin() != null) {
            authStatus = kycAuthDto.getPin().equals(HelperUtil.getIdentityDataValue(identityData,"pin",defaultLanguage));
            if (!authStatus)
                throw new MockIdentityException("auth_failed");
        }

        if (kycAuthDto.getBiometrics() != null) {
            authStatus = true; //TODO
        }

        if(kycAuthDto.getKbi()!=null){
            authStatus=validateKnowledgeBasedAuth(kycAuthDto,identityData);
        }

        if(kycAuthDto.getPassword()!=null){
            authStatus=validatePasswordAuth(kycAuthDto,identityData);
        }

        if (!CollectionUtils.isEmpty(kycAuthDto.getTokens())) {
            authStatus = !StringUtils.isEmpty(kycAuthDto.getTokens().get(0));
            if (!authStatus)
                throw new MockIdentityException("auth_failed");
        }
        return authStatus;
    }

    private boolean validateKnowledgeBasedAuth(KycAuthDto kycAuthDto, JsonNode identityData){
        if(CollectionUtils.isEmpty(fieldDetailList) || StringUtils.isEmpty(fieldLang)){
            log.error("KBI field details not configured");
            throw new MockIdentityException("auth-failed");
        }
        String encodedChallenge= kycAuthDto.getKbi();
        try{
            byte[] decodedBytes = Base64.getUrlDecoder().decode(encodedChallenge);
            String challenge = new String(decodedBytes, StandardCharsets.UTF_8);
            Map<String, String> challengeMap = objectMapper.readValue(challenge, Map.class);

            for(Map<String,String> fieldDetail:fieldDetailList){
                if(challengeMap.containsKey(fieldDetail.get(FIELD_ID_KEY))) {
                    String challengeField = fieldDetail.get(FIELD_ID_KEY);
                    String challengeValue = challengeMap.get(challengeField);
                    if(challengeField.equals("dateOfBirth")) {
                        challengeValue = new SimpleDateFormat("yyyy/MM/dd").format(
                                new SimpleDateFormat(fieldDetail.get("format")).parse(challengeValue));
                    }
                    String identityDataValue = HelperUtil.getIdentityDataValue(identityData, challengeField, fieldLang);
                    if(!identityDataValue.equals(challengeValue)) {
                        return false;
                    }
                }
            }
        }catch (Exception e){
            log.error("Failed to decode KBI challenge or compare it with IdentityData", e);
            throw new MockIdentityException("auth-failed");
        }
        return true;
    }

    private boolean validatePasswordAuth(KycAuthDto kycAuthDto, JsonNode identityData){
        String passwordHash = identityData.hasNonNull("password") ? identityData.get("password").asText() : null;
        return passwordHash != null && passwordHash.equals(generateHash(kycAuthDto.getPassword()));
    }

    private String signKyc(Map<String, Object> kyc) throws JsonProcessingException {
        String payload = objectMapper.writeValueAsString(kyc);
        JWTSignatureRequestDto jwtSignatureRequestDto = new JWTSignatureRequestDto();
        jwtSignatureRequestDto.setApplicationId(APPLICATION_ID);
        jwtSignatureRequestDto.setReferenceId("");
        jwtSignatureRequestDto.setIncludePayload(true);
        jwtSignatureRequestDto.setIncludeCertificate(false);
        jwtSignatureRequestDto.setDataToSign(HelperUtil.b64Encode(payload));
        jwtSignatureRequestDto.setIncludeCertHash(false);
        JWTSignatureResponseDto responseDto = signatureService.jwtSign(jwtSignatureRequestDto);
        return responseDto.getJwtSignedData();
    }

    private String getJWE(String relyingPartyId, String signedJwt) throws Exception {
        JsonWebEncryption jsonWebEncryption = new JsonWebEncryption();
        jsonWebEncryption.setAlgorithmHeaderValue(KeyManagementAlgorithmIdentifiers.RSA_OAEP_256);
        jsonWebEncryption.setEncryptionMethodHeaderParameter(ContentEncryptionAlgorithmIdentifiers.AES_256_GCM);
        jsonWebEncryption.setPayload(signedJwt);
        jsonWebEncryption.setContentTypeHeaderValue("JWT");
        RSAKey rsaKey = getRelyingPartyPublicKey(relyingPartyId);
        jsonWebEncryption.setKey(rsaKey.toPublicKey());
        jsonWebEncryption.setKeyIdHeaderValue(rsaKey.getKeyID());
        return jsonWebEncryption.getCompactSerialization();
    }

    private RSAKey getRelyingPartyPublicKey(String relyingPartyId) {
        //TODO where to store relying-party public key
        throw new MockIdentityException("jwe-not-implemented");
    }

    private KycAuth saveKycAuthTransaction(String transactionId, String relyingPartyId, String individualId) {
        String kycToken = HelperUtil.generateB64EncodedHash(ALGO_SHA3_256, UUID.randomUUID().toString());
        String psut;
        try {
            psut = HelperUtil.generateB64EncodedHash(ALGO_SHA3_256,
                    String.format(PSUT_FORMAT, individualId, relyingPartyId));
        } catch (Exception e) {
            log.error("Failed to generate PSUT", e);
            throw new MockIdentityException("mock-ida-004");
        }

        KycAuth kycAuth = new KycAuth(kycToken, psut, LocalDateTime.now(ZoneOffset.UTC), Valid.ACTIVE, transactionId,
                individualId);
        return authRepository.save(kycAuth);
    }

    private Map<String, Object> buildKycDataBasedOnPolicy(String individualId, JsonNode identityData, Map<String, JsonNode> claims, List<String> locales) {
        Map<String, Object> kyc = new HashMap<>();
        if (CollectionUtils.isEmpty(locales)) {
            locales = Arrays.asList(defaultLanguage);
        }

        for (Map.Entry<String, JsonNode> claimDetail : claims.entrySet()) {

            Optional<Map.Entry<String, String>> keyMappingEntry = oidcClaimsMapping.entrySet().stream().filter(entry -> entry.getValue().equals(claimDetail.getKey()) ).findFirst();

            switch (claimDetail.getKey()) {
                case "verified_claims":
                    if(claimDetail.getValue().isArray()) {
                        Iterator<JsonNode> itr = claimDetail.getValue().iterator();
                        while(itr.hasNext()) {
                            Map<String, Object> result = getVerificationDetail(individualId, itr.next(), identityData, locales);
                            if(result.isEmpty())
                                continue;

                            List<Object> list = (List<Object>) kyc.getOrDefault("verified_claims", new ArrayList<Object>());
                            list.add(result);
                        }
                    }
                    else {
                        Map<String, Object> result = getVerificationDetail(individualId, claimDetail.getValue(), identityData, locales);
                        kyc.put("verified_claims", result);
                    }
                    break;

                case "address":
                    Map<String, Object> addressValues = new HashMap<>();
                    addressValues.putAll(getKycValues(locales, "street_address", HelperUtil.getLanguageValuesList((ArrayNode) identityData.get("streetAddress")),
                            claimDetail.getValue()));
                    addressValues.putAll(getKycValues(locales, "locality", HelperUtil.getLanguageValuesList((ArrayNode) identityData.get("locality")),
                            claimDetail.getValue()));
                    addressValues.putAll(getKycValues(locales, "region", HelperUtil.getLanguageValuesList((ArrayNode) identityData.get("region")),
                            claimDetail.getValue()));
                    addressValues.putAll(getKycValues(locales, "country", HelperUtil.getLanguageValuesList((ArrayNode) identityData.get("country")),
                            claimDetail.getValue()));
                    if (identityData.hasNonNull("postalCode")) {
                        addressValues.put("postal_code", identityData.get("postalCode").asText());
                    }
                    kyc.put("address", addressValues);
                    break;

                default:

                    if(keyMappingEntry.isEmpty() || !identityData.hasNonNull(keyMappingEntry.get().getKey())) { break; }

                    if(identityData.get(keyMappingEntry.get().getKey()).isArray()) {
                        List<LanguageValue> languageValues = HelperUtil.getLanguageValuesList((ArrayNode) identityData.get(keyMappingEntry.get().getKey()));
                        kyc.putAll(getKycValues(locales, keyMappingEntry.get().getValue(), languageValues, claimDetail.getValue()));
                    }
                    else {
                        String value = identityData.get(keyMappingEntry.get().getKey()).asText();
                        if (isClaimMatchingValueOrValuesCriteria(value, claimDetail.getValue())) {
                            kyc.put(claimDetail.getKey(), value);
                        }
                    }
                    break;
            }
        }
        return kyc;
    }

    private Map<String, Object> getKycValues(List<String> locales, String claimName, List<LanguageValue> values, JsonNode requestedClaimDetail) {
        if (values == null) {
            return Collections.emptyMap();
        }
        boolean isSingleLanguage = locales.size() == 1;
        Map<String,Object> map=new HashMap<>();
        for (String locale : locales) {
             map.putAll(values.stream()
                        .filter(v -> v.getLanguage().equalsIgnoreCase(locale) || v.getLanguage().startsWith(locale))
                        .filter(v -> isClaimMatchingValueOrValuesCriteria(v.getValue(), requestedClaimDetail) )
                        .collect(Collectors.toMap(v -> isSingleLanguage ? claimName : claimName + "#" + locale, LanguageValue::getValue)));
        }
        return map;
    }

    private boolean isClaimMatchingValueOrValuesCriteria(String claimValue, JsonNode requestedClaimDetail) {
        return requestedClaimDetail == null ||
                ( requestedClaimDetail.hasNonNull("value") ? claimValue.equals(requestedClaimDetail.get("value").asText()) :
                        ( !requestedClaimDetail.hasNonNull("values") || StreamSupport.stream(requestedClaimDetail.get("values").spliterator(), false)
                                .anyMatch(node -> node.asText().equals(claimValue)) ) );
    }

    private Map<String,Object> getVerificationDetail(String individualId, JsonNode requestedVerificationMetadata, JsonNode identityData, List<String> locales) {
        if (requestedVerificationMetadata == null) {
            return Collections.emptyMap();
        }

        ObjectNode matchedVerificationDetail = objectMapper.createObjectNode();
        Map<String, JsonNode> matchedVerifiedClaims = new HashMap<>();
        JsonNode requestedVerification = requestedVerificationMetadata.get("verification");
        JsonNode requestedVerifiedClaims = requestedVerificationMetadata.get("claims");
        Iterator<Map.Entry<String, JsonNode>> it = requestedVerifiedClaims.fields();
        while (it.hasNext()) {
            Map.Entry<String, JsonNode> entry = it.next();
            Optional<List<VerifiedClaim>> result = verifiedClaimRepository.findByIndividualIdAndClaimAndIsActive(individualId, entry.getKey(), true);
            if(result.isEmpty()) { continue; }

            Optional<VerifiedClaim> matchedEntry = result.get().stream().
                    filter(vc -> isClaimMatchingValueOrValuesCriteria(vc.getTrustFramework(), requestedVerification.get("trust_framework"))).findFirst();
            if(matchedEntry.isPresent()) {
                matchedVerificationDetail.put("trust_framework", matchedEntry.get().getTrustFramework());
                matchedVerificationDetail.put("time", String.valueOf(matchedEntry.get().getUpdDateTime()));//TODO need to format
                matchedVerifiedClaims.put(entry.getKey(), entry.getValue());
            }
        }

        if(matchedVerifiedClaims.isEmpty() || matchedVerificationDetail.isEmpty())
            return Collections.emptyMap();

        Map<String,Object> result = new HashMap<>();
        result.put("verification", matchedVerificationDetail);
        Map<String, Object> kyc = buildKycDataBasedOnPolicy(individualId, identityData, matchedVerifiedClaims, locales);
        result.put("claims", kyc);
        return result;
    }
    
    private String generateHash(String password) {
    	try 
	    {
		  MessageDigest md = MessageDigest.getInstance(hashAlgorithm);
		  md.update(password.getBytes(StandardCharsets.UTF_8));
		  return Base64.getEncoder().encodeToString(md.digest());
	    } catch (NoSuchAlgorithmException e) {
	      log.error("Failed to generate hash", e);
	    }
	    return null;
    }

    public boolean isSupportedOtpChannel(String channel) {
        return channel != null && otpChannels.contains(channel.toLowerCase());
    }
}
