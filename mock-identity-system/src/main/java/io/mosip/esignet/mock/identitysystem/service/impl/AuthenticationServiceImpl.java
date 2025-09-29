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
import com.nimbusds.jose.jwk.JWK;
import com.nimbusds.jose.jwk.RSAKey;
import io.mosip.esignet.mock.identitysystem.dto.*;
import io.mosip.esignet.mock.identitysystem.entity.KycAuth;
import io.mosip.esignet.mock.identitysystem.entity.PartnerData;
import io.mosip.esignet.mock.identitysystem.entity.VerifiedClaim;
import io.mosip.esignet.mock.identitysystem.exception.MockIdentityException;
import io.mosip.esignet.mock.identitysystem.repository.AuthRepository;
import io.mosip.esignet.mock.identitysystem.repository.PartnerDataRepository;
import io.mosip.esignet.mock.identitysystem.repository.VerifiedClaimRepository;
import io.mosip.esignet.mock.identitysystem.service.AuthenticationService;
import io.mosip.esignet.mock.identitysystem.service.IdentityService;
import io.mosip.esignet.mock.identitysystem.util.CacheUtilService;
import io.mosip.esignet.mock.identitysystem.util.ErrorConstants;
import io.mosip.esignet.mock.identitysystem.util.HelperUtil;
import io.mosip.kernel.core.util.HMACUtils2;
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
import java.security.NoSuchAlgorithmException;
import java.text.ParseException;
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

    @Autowired
    private PartnerDataRepository partnerDataRepository;

    @Autowired
    private CacheUtilService cacheUtilService;

    @Value("${mosip.mock.ida.kyc.transaction-timeout-secs:180}")
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

    @Value("${mosip.mock.ida.kyc.psut.field:psut}")
    private String psutField;

    @Value("${mosip.mockidentitysystem.esignet.issuer-id}")
    private String issuerId;


    @Override
    public KycAuthResponseDto kycAuth(String relyingPartyId, String clientId, KycAuthDto kycAuthDto) throws MockIdentityException {
        //TODO validate relying party Id and client Id

        JsonNode identityData = identityService.getIdentityV2(kycAuthDto.getIndividualId());
        if (identityData == null) {
            throw new MockIdentityException(ErrorConstants.INVALID_INDIVIDUAL_ID);
        }
        Boolean authStatus=doKycAuthentication(kycAuthDto,identityData);
        if(!authStatus) {
            KycAuthResponseDto kycAuthResponseDto = new KycAuthResponseDto();
            kycAuthResponseDto.setAuthStatus(authStatus);
            return kycAuthResponseDto;
        }

        KycAuth kycAuth = saveKycAuthTransaction(kycAuthDto.getTransactionId(), relyingPartyId,
                kycAuthDto.getIndividualId());

        KycAuthResponseDto kycAuthResponseDto = new KycAuthResponseDto();
        kycAuthResponseDto.setAuthStatus(authStatus);
        kycAuthResponseDto.setKycToken(kycAuth.getKycToken());
        if (psutField.equals("psut")) {
            kycAuthResponseDto.setPartnerSpecificUserToken(kycAuth.getPartnerSpecificUserToken());
        } else {
            kycAuthResponseDto.setPartnerSpecificUserToken(HelperUtil.getIdentityDataValue(identityData, psutField, defaultLanguage));
        }
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

            ObjectNode kyc = buildKycData(kycExchangeDto.getIndividualId(), identityData,
                    kycExchangeDto.getAcceptedClaimDetail(), kycExchangeDto.getClaimLocales());
            kyc.put("sub", result.get().getPartnerSpecificUserToken());
            kyc.put("iss", issuerId);
            kyc.put("aud", clientId);

            result.get().setValidity(Valid.PROCESSED);
            authRepository.save(result.get());
            String finalKyc;
            String userInfoResponseType = kycExchangeDto.getRespType();
            finalKyc = "JWE".equals(userInfoResponseType) ? getJWE(relyingPartyId, clientId, signKyc(kyc)) : signKyc(kyc);
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

        JsonNode identityData = identityService.getIdentityV2(sendOtpDto.getIndividualId());
        if (identityData == null) {
            throw new MockIdentityException(ErrorConstants.INVALID_INDIVIDUAL_ID);
        }

        if (!sendOtpDto.getOtpChannels().stream().allMatch(this::isSupportedOtpChannel)) {
            log.error("Invalid Otp Channels");
            throw new MockIdentityException("invalid_otp_channel");
        }

        String maskedEmailId = null;
        String maskedMobile = null;
        for (String channel : sendOtpDto.getOtpChannels()) {
            if (channel.equalsIgnoreCase("email")) {
                maskedEmailId = HelperUtil.maskEmail(getChannelValue("email", identityData));
            }
            if (channel.equalsIgnoreCase("phone") || channel.equalsIgnoreCase("mobile")) {
                maskedMobile = HelperUtil.maskMobile(getChannelValue("phone_number", identityData));
            }
        }

        if(org.springframework.util.StringUtils.isEmpty(maskedEmailId) &&
                org.springframework.util.StringUtils.isEmpty(maskedMobile)) {
            log.error("neither email id nor mobile number found for the given individualId");
            throw new MockIdentityException("no_email_mobile_found");
        }

        var trn_token_hash = HelperUtil.generateB64EncodedHash(ALGO_SHA3_256,
                String.format(sendOtpDto.getTransactionId(), sendOtpDto.getIndividualId(), OTP_VALUE));

        cacheUtilService.setTransactionHash(trn_token_hash);
        return new SendOtpResult(sendOtpDto.getTransactionId(), maskedEmailId, maskedMobile);
    }

    private String getChannelValue(String oidcClaimName, JsonNode identityData) {
        Optional<Map.Entry<String, String>> entryResult = oidcClaimsMapping.entrySet().stream()
                .filter(e -> e.getValue().equals(oidcClaimName)).findFirst();
        if(entryResult.isPresent() && identityData.hasNonNull(entryResult.get().getKey())) {
            return identityData.hasNonNull(entryResult.get().getKey()) ?
                    identityData.get(entryResult.get().getKey()).asText() : null;
        }
        return null;
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

            var isValid = cacheUtilService.getTransactionHash(trn_hash);
            if (isValid) {
                authStatus = kycAuthDto.getOtp().equals(OTP_VALUE);
                if (authStatus)
                    cacheUtilService.removeTransactionHash(trn_hash);
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
        try {
            return passwordHash != null && passwordHash.equals(HMACUtils2.digestAsPlainText(kycAuthDto.getPassword().getBytes()));
        } catch (NoSuchAlgorithmException e) {
            log.error("Failed to decode PWD challenge or compare it with IdentityData", e);
            throw new MockIdentityException("auth-failed");
        }
    }

    private String signKyc(ObjectNode kyc) throws JsonProcessingException {
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

    private String getJWE(String relyingPartyId, String clientId, String signedJwt) throws Exception {
        JsonWebEncryption jsonWebEncryption = new JsonWebEncryption();
        jsonWebEncryption.setAlgorithmHeaderValue(KeyManagementAlgorithmIdentifiers.RSA_OAEP_256);
        jsonWebEncryption.setEncryptionMethodHeaderParameter(ContentEncryptionAlgorithmIdentifiers.AES_256_GCM);
        jsonWebEncryption.setPayload(signedJwt);
        jsonWebEncryption.setContentTypeHeaderValue("JWT");
        RSAKey rsaKey = getRelyingPartyPublicKey(relyingPartyId, clientId);
        jsonWebEncryption.setKey(rsaKey.toPublicKey());
        jsonWebEncryption.setKeyIdHeaderValue(rsaKey.getKeyID());
        return jsonWebEncryption.getCompactSerialization();
    }

    private RSAKey getRelyingPartyPublicKey(String relyingPartyId, String clientId) {
        PartnerData partnerData = partnerDataRepository.findByPartnerIdAndClientId(relyingPartyId, clientId)
                .orElseThrow(() -> {
                    log.error("Public key not found for relying party: {}", relyingPartyId);
                    return new MockIdentityException("mock-ida-008");
                });
        try {
            String jwkJson = partnerData.getPublicKey();
            JWK jwk = JWK.parse(jwkJson);
            if (!(jwk instanceof RSAKey)) {
                log.error("Stored key is not an RSA key for relying party: {}", relyingPartyId);
                throw new MockIdentityException("mock-ida-008");
            }
            return (RSAKey) jwk;
        } catch (ParseException e) {
            log.error("Failed to parse JWK public key for relying party: {}", relyingPartyId, e);
            throw new MockIdentityException("mock-ida-008");
        }
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

    private ObjectNode buildKycData(String individualId, JsonNode identityData, Map<String, JsonNode> claimsParam, List<String> claimLocales) {
        ObjectNode kyc = objectMapper.createObjectNode();
        List<String> locales = (claimLocales != null && !claimLocales.isEmpty())
                ? claimLocales
                : List.of(defaultLanguage);

        Set<String> requestedClaims = new HashSet<>();
        JsonNode verifiedClaimsNode = null; // can be object or array

        for(String claim : claimsParam.keySet()) {
            if("verified_claims".equals(claim)) {
                verifiedClaimsNode = claimsParam.get(claim);
            } else {
                requestedClaims.add(claim);
            }
        }

        // Add requested standard claims
        for (String claimName : requestedClaims) {
            addClaimToKyc(claimName, identityData, locales, kyc);
        }

        // Handle verified_claims as object or array
        if (verifiedClaimsNode != null) {
            Optional<List<VerifiedClaim>> claimsByVerificationMetadataResult = verifiedClaimRepository.findByIndividualIdAndIsActive(individualId, true);
            if(claimsByVerificationMetadataResult.isEmpty())
                return kyc;

            if (verifiedClaimsNode.isArray()) {
                // multiple verified_claims requests
                List<ObjectNode> verifiedList = new ArrayList<>();
                for (JsonNode singleReq : verifiedClaimsNode) {
                    ObjectNode objectNode = buildVerifiedClaimsObject(singleReq, locales,
                            identityData, claimsByVerificationMetadataResult.get(), kyc);
                    if(!objectNode.isEmpty()) {
                        verifiedList.add(objectNode);
                    }
                }
                if(!verifiedList.isEmpty()) {
                    kyc.set("verified_claims", objectMapper.valueToTree(verifiedList));
                }
            } else if (verifiedClaimsNode.isObject()) {
                // single verified_claims request
                ObjectNode objectNode = buildVerifiedClaimsObject(verifiedClaimsNode, locales,
                        identityData, claimsByVerificationMetadataResult.get(), kyc);
                if(!objectNode.isEmpty()) {
                    kyc.set("verified_claims", objectNode);
                }
            }
        }

        return kyc;
    }

    private void addClaimToKyc(String claimName, JsonNode identityData, List<String> locales, ObjectNode kyc) {
        if("address".equals(claimName)) {
            addAddressClaimToKyc(claimName, identityData, locales, kyc);
            return;
        }

        Optional<Map.Entry<String, String>> keyMappingEntry = oidcClaimsMapping.entrySet().stream()
                .filter(entry -> entry.getValue().equals(claimName))
                .findFirst();
        if(keyMappingEntry.isEmpty())
            return;

        String fieldName = keyMappingEntry.get().getKey();

        List<LanguageValue> filteredValues = getLanguageValuesList(identityData.get(fieldName), locales);
        if(filteredValues.isEmpty()) {
            log.warn("No data found for the claim: {} for the requested locales: {}", claimName, locales);
            JsonNode valueNode = identityData.get(fieldName);
            if(valueNode == null || valueNode.isNull())
                return;

            kyc.put(claimName, valueNode.asText());
            return;
        }

        for (LanguageValue languageValue : filteredValues) {
            String key = (filteredValues.size() > 1) ? claimName + "#" + languageValue.getLanguage() : claimName;
            kyc.put(key, languageValue.getValue());
        }
    }

    private void addAddressClaimToKyc(String claimName, JsonNode identityData, List<String> locales, ObjectNode kyc) {
        List<Map.Entry<String, String>> addressKeyMappingEntries = oidcClaimsMapping.entrySet().stream()
                .filter(entry -> entry.getValue().startsWith("address."))
                .collect(Collectors.toList());
        if(addressKeyMappingEntries.isEmpty())
            return;

        ObjectNode addressNode = objectMapper.createObjectNode();
        for(Map.Entry<String, String> entry : addressKeyMappingEntries) {
            String field = entry.getKey();
            String oidcSubClaimName = entry.getValue().substring("address.".length());
            List<LanguageValue> filteredValues = getLanguageValuesList(identityData.get(field), locales);
            for (LanguageValue languageValue : filteredValues) {
                String key = (filteredValues.size() > 1) ? oidcSubClaimName + "#" + languageValue.getLanguage() : oidcSubClaimName;
                addressNode.put(key, languageValue.getValue());
            }
        }
        if(!addressNode.isEmpty()) {
            kyc.set(claimName, addressNode);
        }
    }

    private List<LanguageValue> getLanguageValuesList(JsonNode fieldValue, List<String> locales) {
        if(fieldValue == null || !fieldValue.isArray())
            return Collections.emptyList();
        List<LanguageValue> languageValues=new ArrayList<>();
        for (JsonNode node : (ArrayNode)fieldValue) {
            String language = node.get("language").asText();
            if(locales.contains(language)) {
                String value = node.get("value").asText();
                LanguageValue languageValue = new LanguageValue();
                languageValue.setLanguage(language);
                languageValue.setValue(value);
                languageValues.add(languageValue);
            }
        }
        return languageValues;
    }

    /**
     * Build a single verified_claims object with verification/evidence and filtered claims.
     */
    private ObjectNode buildVerifiedClaimsObject(
            JsonNode requestNode,
            List<String> locales,
            JsonNode identityData,
            List<VerifiedClaim> claimsByVerificationMetadata,
            ObjectNode kyc) {

        JsonNode requestedVerification = requestNode.get("verification");
        JsonNode requestedVerifiedClaims = requestNode.get("claims");

        List<VerifiedClaim> matchedEntries = claimsByVerificationMetadata.stream()
                .filter(vc -> isClaimMatchingValueOrValuesCriteria(vc.getTrustFramework(), requestedVerification.get("trust_framework")))
                .collect(Collectors.toList());

        // Collect claims present in verification metadata & requested
        ObjectNode verifiedValues = objectMapper.createObjectNode();
        for(VerifiedClaim verifiedClaim : matchedEntries) {
            requestedVerifiedClaims.fieldNames().forEachRemaining(
                    fieldName -> {
                        if(fieldName.equals(verifiedClaim.getClaim())) {
                            addClaimToKyc(verifiedClaim.getClaim(), identityData, locales, verifiedValues);
                        }
                    }
            );
        }

        ObjectNode verifiedClaimDetail = objectMapper.createObjectNode();
        if(!verifiedValues.isEmpty()) {
            ObjectNode verification = objectMapper.createObjectNode();
            verification.put("trust_framework", matchedEntries.get(0).getTrustFramework());
            verification.put("time", String.valueOf(matchedEntries.get(0).getUpdDateTime())); // TODO: format time

            verifiedClaimDetail.set("verification", verification);
            verifiedClaimDetail.set("claims", verifiedValues);

            // Remove these claims from standard claims
            Iterator<String> fieldNames = verifiedValues.fieldNames();
            while (fieldNames.hasNext()) {
                String fieldName = fieldNames.next();
                kyc.remove(fieldName);
            }
        }
        return verifiedClaimDetail;
    }

    private boolean isClaimMatchingValueOrValuesCriteria(String claimValue, JsonNode requestedClaimDetail) {
        return requestedClaimDetail == null ||
                ( requestedClaimDetail.hasNonNull("value") ? claimValue.equals(requestedClaimDetail.get("value").asText()) :
                        ( !requestedClaimDetail.hasNonNull("values") || StreamSupport.stream(requestedClaimDetail.get("values").spliterator(), false)
                                .anyMatch(node -> node.asText().equals(claimValue)) ) );
    }

    public boolean isSupportedOtpChannel(String channel) {
        return channel != null && otpChannels.contains(channel.toLowerCase());
    }
}
