package io.mosip.esignet.mock.identitysystem.service.impl;

import java.io.FileReader;
import java.time.temporal.ChronoUnit;

import com.fasterxml.jackson.core.JsonProcessingException;
import io.mosip.esignet.mock.identitysystem.entity.KycAuth;
import io.mosip.esignet.mock.identitysystem.repository.AuthRepository;
import io.mosip.kernel.keymanagerservice.dto.KeyPairGenerateRequestDto;
import io.mosip.kernel.signature.dto.JWTSignatureRequestDto;
import io.mosip.kernel.signature.dto.JWTSignatureResponseDto;
import io.mosip.kernel.signature.dto.JWTSignatureVerifyResponseDto;
import org.json.simple.JSONObject;
import org.json.simple.parser.*;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.jayway.jsonpath.JsonPath;
import com.nimbusds.jose.jwk.RSAKey;
import com.nimbusds.jwt.JWT;
import com.nimbusds.jwt.JWTClaimsSet;
import com.nimbusds.jwt.JWTParser;
import com.nimbusds.jwt.proc.DefaultJWTClaimsVerifier;
import com.nimbusds.jwt.proc.JWTClaimsSetVerifier;
import io.mosip.idp.core.dto.*;
import io.mosip.idp.core.dto.Error;
import io.mosip.idp.core.exception.*;
import io.mosip.idp.core.spi.AuthenticationWrapper;
import io.mosip.idp.core.util.Constants;
import io.mosip.idp.core.util.IdentityProviderUtil;
import io.mosip.kernel.signature.dto.JWTSignatureVerifyRequestDto;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import io.mosip.kernel.signature.service.SignatureService;
import io.mosip.kernel.keymanagerservice.service.KeymanagerService;
import com.jayway.jsonpath.DocumentContext;
import org.apache.commons.io.FileUtils;
import org.jose4j.jwe.ContentEncryptionAlgorithmIdentifiers;
import org.jose4j.jwe.JsonWebEncryption;
import org.jose4j.jwe.KeyManagementAlgorithmIdentifiers;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.validation.annotation.Validated;
import javax.validation.Valid;
import javax.validation.constraints.NotBlank;
import javax.validation.constraints.NotNull;
import java.io.File;
import java.io.IOException;
import java.text.ParseException;
import java.time.LocalDateTime;
import java.util.*;
import java.util.stream.Collectors;
import io.mosip.esignet.mock.identitysystem.dto.PathInfo;
import static io.mosip.idp.core.util.ErrorConstants.INVALID_INPUT;
import static io.mosip.idp.core.util.IdentityProviderUtil.ALGO_SHA3_256;

@Slf4j
@Service
@RequiredArgsConstructor
public class MockAuthenticationService implements AuthenticationWrapper {

    private static final String APPLICATION_ID = "MOCK_AUTH_WRAPPER";
    private static final String PSUT_FORMAT = "%s%s";
    private static final String CID_CLAIM = "cid";
    private static final String RID_CLAIM = "rid";
    private static final String PSUT_CLAIM = "psut";
    private static final String SUB_CLAIM = "sub";
    private static final String ISS_CLAIM = "iss";
    private static final String AUD_CLAIM = "aud";
    private static final String IAT_CLAIM = "iat";
    private static final String EXP_CLAIM = "exp";
    private static final String INDIVIDUAL_FILE_NAME_FORMAT = "%s.json";
    private static final String POLICY_FILE_NAME_FORMAT = "%s_policy.json";
    private static Map<String, List<String>> policyContextMap;
    private static Map<String, RSAKey> relyingPartyPublicKeys;
    private static Map<String, String> localesMapping;
    private static Set<String> REQUIRED_CLAIMS;
    private int tokenExpireInSeconds;
    @Autowired
    private SignatureService signatureService;
    @Autowired
    private ObjectMapper objectMapper;
    @Autowired
    private KeymanagerService keymanagerService;
    private DocumentContext mappingDocumentContext;
    @Value("${mosip.exchange.time}")
    private int timevalidity;
    @Value("${mosip.authwrapper.personaDir}")
    private File personaDir;
    @Value("${mosip.authwrapper.policyDir}")
    private File policyDir;

    private boolean encryptKyc;

    static {
        REQUIRED_CLAIMS = new HashSet<>();
        REQUIRED_CLAIMS.add("sub");
        REQUIRED_CLAIMS.add("aud");
        REQUIRED_CLAIMS.add("iss");
        REQUIRED_CLAIMS.add("iat");
        REQUIRED_CLAIMS.add("exp");
        REQUIRED_CLAIMS.add(CID_CLAIM);
        REQUIRED_CLAIMS.add(RID_CLAIM);

        policyContextMap = new HashMap<>();
        relyingPartyPublicKeys = new HashMap<>();
    }
    public MockAuthenticationService(File personaDir){
        this.personaDir=personaDir;
    }
    @Autowired
    private AuthRepository authRepository;
    @Validated
    @Override
    public KycAuthResult doKycAuth(@NotBlank String relyingPartyId, @NotBlank String clientId,
                                   @NotNull @Valid KycAuthDto kycAuthDto) throws KycAuthException {
        KycAuthResult kycAuthResult = new KycAuthResult();
        kycAuthResult.setErrors(new ArrayList<>());
        List<String> authMethods = resolveAuthMethods(relyingPartyId);
        boolean result = kycAuthDto.getChallengeList()
                .stream()
                .allMatch(authChallenge -> authMethods.contains(authChallenge.getAuthFactorType()) &&
                        authenticateUser(kycAuthDto.getIndividualId(), authChallenge,kycAuthResult));
        log.info("Auth methods as per partner policy : {}, KYC auth result : {}",authMethods, result);
        if(!result) {
            //TODO - set appropriate err code and msg
            kycAuthResult.getErrors().add(new Error("err 002","Auth Failed"));
            return kycAuthResult;
        }
        String psut;
        try {
            psut = IdentityProviderUtil.generateB64EncodedHash(ALGO_SHA3_256,
                    String.format(PSUT_FORMAT, kycAuthDto.getIndividualId(), relyingPartyId));
        } catch (IdPException e) {
            log.error("Failed to generate PSUT",authMethods, e);
            kycAuthResult.getErrors().add(new Error("mock-ida-006",
                    "Failed to generate Partner specific user token"));
            return kycAuthResult;
        }
        String kycToken = getKycToken(kycAuthDto.getIndividualId(), clientId, relyingPartyId, psut);
        kycAuthResult.setKycToken(kycToken);
        kycAuthResult.setPartnerSpecificUserToken(psut);
        if(kycToken.isEmpty()){kycAuthResult.setKycStatus(false);}
        kycAuthResult.setKycStatus(true);
        kycAuthResult.setResponseTime(LocalDateTime.now());
        KycAuth kycAuth =new KycAuth(kycAuthResult.getKycToken(),
                kycAuthResult.getPartnerSpecificUserToken(),kycAuthResult.getResponseTime(),
                io.mosip.esignet.mock.identitysystem.dto.Valid.ACTIVE,
                kycAuthDto.getTransactionId(),kycAuthDto.getIndividualId());
        authRepository.save(kycAuth);
        return kycAuthResult;
    }
    private List<String> resolveAuthMethods(String relyingPartyId) {
        //TODO - Need to check the policy to resolve supported auth methods
        return Arrays.asList("PIN", "OTP", "BIO");
    }
    private boolean authenticateUser(String individualId, AuthChallenge authChallenge,KycAuthResult kycAuthResult) {
        switch (authChallenge.getAuthFactorType()) {
            case "PIN" :
                return authenticateIndividualWithPin(individualId, authChallenge.getChallenge(),kycAuthResult);
            case "OTP" :
                return authenticateIndividualWithOTP(individualId, authChallenge.getChallenge());
            case "BIO" :
                return authenticateIndividualWithBio(individualId);
        }
        return false;
    }
    private boolean authenticateIndividualWithPin(String individualId, String pin,KycAuthResult kycAuthResult) {
        String filename = String.format(INDIVIDUAL_FILE_NAME_FORMAT, individualId);
        try {
            DocumentContext context = JsonPath.parse(FileUtils.getFile(personaDir, filename));
            String savedPin = context.read("$.pin", String.class);
            return pin.equals(savedPin);
        } catch (IOException e) {
            kycAuthResult.getErrors().add(new Error("mock-ida-001", "Incorrect PIN"));
        }
        return false;
    }
    private boolean authenticateIndividualWithOTP(String individualId, String OTP) {
        String filename = String.format(INDIVIDUAL_FILE_NAME_FORMAT, individualId);
        try {
            return FileUtils.directoryContains(personaDir, new File(new File("src/main/resources").getAbsolutePath(), filename))
                    && OTP.equals("111111");
        } catch (IOException e) {
            log.error("authenticateIndividualWithOTP failed {}", filename, e);
        }
        return false;
    }
    private boolean authenticateIndividualWithBio(String individualId) {
        String filename = String.format(INDIVIDUAL_FILE_NAME_FORMAT, individualId);
        try {
            return FileUtils.directoryContains(personaDir, new File(personaDir.getAbsolutePath(), filename));
        } catch (IOException e) {
            log.error("authenticateIndividualWithBio failed {}", filename, e);
        }
        return false;
    }
    private String getKycToken(String individualId, String clientId, String relyingPartyId, @NotBlank String psut) {
        UUID uuid = UUID.randomUUID();
        String uuidFinal=IdentityProviderUtil.generateB64EncodedHash(ALGO_SHA3_256,uuid.toString());
        return uuidFinal;
    }


    @Override
    public KycExchangeResult doKycExchange(@NotBlank String relyingPartyId, @NotBlank String clientId,
                                           @NotNull @Valid KycExchangeDto kycExchangeDto)
            throws KycExchangeException {
        KeyPairGenerateRequestDto requestROOT=new KeyPairGenerateRequestDto();
        requestROOT.setApplicationId("ROOT");
        try{
            keymanagerService.generateMasterKey("CSR",requestROOT);
        }catch (Exception e){
            e.printStackTrace();
        }
        KycExchangeResult kycExchangeResult = new KycExchangeResult();
        kycExchangeResult.setId("mosip.identity.kycexchange");
        kycExchangeResult.setVersion("1.0");
        List errorList = new ArrayList<Error>();
        Optional<KycAuth> kycAuthDto = authRepository.findByKycTokenAndValidityAndTransactionIdAndIndividualId
                (kycExchangeDto
                                .getKycToken(), io.mosip.esignet.mock.identitysystem.dto.Valid.ACTIVE,
                        kycExchangeDto.getTransactionId(), kycExchangeDto.getIndividualId());
        if (!(kycAuthDto.isPresent())) {
            errorList.add(new Error("err Id", "invalid token/not present"));
            kycExchangeResult.setErrors(errorList);
            kycAuthDto.get().setValidity(io.mosip.esignet.mock.identitysystem.dto.Valid.EXPIRED);
            authRepository.save(kycAuthDto.get());
            return kycExchangeResult;
        }
        LocalDateTime savedTime = kycAuthDto.get().getResponseTime();
        long seconds = savedTime.until(kycExchangeDto.getRequestTime(), ChronoUnit.SECONDS);
        if ((seconds > timevalidity && seconds < 1)) {
            errorList.add(new Error("err Id", "Token expired"));
            kycExchangeResult.setErrors(errorList);
            return kycExchangeResult;
        }
        Map<String, Object> kyc = null;
        try {
            kyc = buildKycDataBasedOnPolicy(relyingPartyId,
                    kycExchangeDto.getIndividualId(),
                    kycExchangeDto.getConsentObtained(), kycExchangeDto.getClaimsLocales());
            //kyc.put(SUB_CLAIM, jwtClaimsSet.getStringClaim(PSUT_CLAIM));
        } catch (Exception e) {
            e.printStackTrace();
        }
        kycAuthDto.get().setValidity(io.mosip.esignet.mock.identitysystem.dto.Valid.PROCESSED);
        authRepository.save(kycAuthDto.get());
        try {
            kycExchangeResult.setEncryptedKyc(this.encryptKyc ? getJWE(relyingPartyId, signKyc(kyc)) : signKyc(kyc));
        } catch (Exception e) {
            System.out.println(e);
        }
        kycExchangeResult.setErrors(errorList);
        kycExchangeResult.setResponseTime(LocalDateTime.now());
        return kycExchangeResult;
    }
    private String signKyc(Map<String,Object> kyc) throws JsonProcessingException {
        setupMockIDAKey();
        String payload = objectMapper.writeValueAsString(kyc);
        JWTSignatureRequestDto jwtSignatureRequestDto = new JWTSignatureRequestDto();
        jwtSignatureRequestDto.setApplicationId(APPLICATION_ID);
        jwtSignatureRequestDto.setReferenceId("");
        jwtSignatureRequestDto.setIncludePayload(true);
        jwtSignatureRequestDto.setIncludeCertificate(false);
        jwtSignatureRequestDto.setDataToSign(IdentityProviderUtil.b64Encode(payload));
        jwtSignatureRequestDto.setIncludeCertHash(false);
        JWTSignatureResponseDto responseDto = signatureService.jwtSign(jwtSignatureRequestDto);
        return responseDto.getJwtSignedData();
    }


    private void setupMockIDAKey() {
        KeyPairGenerateRequestDto mockIDAMasterKeyRequest = new KeyPairGenerateRequestDto();
        mockIDAMasterKeyRequest.setApplicationId(APPLICATION_ID); //appid-ROOT;
        keymanagerService.generateMasterKey("CSR", mockIDAMasterKeyRequest);
        log.info("===================== MOCK_IDA_SERVICES MASTER KEY SETUP COMPLETED ========================");
    }
    private String[] getClaimsAndLocales(String filename)throws Exception{
        Object obj = new JSONParser().parse(new FileReader(filename));
        System.out.println(obj);
        DocumentContext context = JsonPath.parse(new File(filename));
        Map<String, String> claims = context.read("$.claims");
        System.out.println(claims.keySet());
        String[] claimsAttributes= claims.keySet().toArray(new String[0]);
        return claimsAttributes;
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
    private RSAKey getRelyingPartyPublicKey(String relyingPartyId) throws IOException, ParseException {
        if(!relyingPartyPublicKeys.containsKey(relyingPartyId)) {
            String filename = String.format(POLICY_FILE_NAME_FORMAT, relyingPartyId);
            DocumentContext context = JsonPath.parse(new File(policyDir, filename));
            Map<String, String> publicKey = context.read("$.publicKey");
            relyingPartyPublicKeys.put(relyingPartyId,
                    RSAKey.parse(new JSONObject(publicKey).toJSONString()));
        }
        return relyingPartyPublicKeys.get(relyingPartyId);
    }
    private Map<String, Object> buildKycDataBasedOnPolicy(String relyingPartyId, String individualId,
                                                          List<String> claims, String[] locales) {
        Map<String, Object> kyc = new HashMap<>();
        String persona = String.format(INDIVIDUAL_FILE_NAME_FORMAT, individualId);
        try {
            DocumentContext personaContext = JsonPath.parse(new File(personaDir, persona));
            List<String> allowedAttributes = getPolicyKycAttributes(relyingPartyId);
            DocumentContext mappingContext=JsonPath.parse(new File(personaDir,
                    "claims_attributes_mapping.json"));
            log.info("Allowed kyc attributes as per policy : {}", allowedAttributes);
            Map<String, PathInfo> kycAttributeMap = claims.stream()
                    .distinct()
                    .collect(Collectors.toMap(claim -> claim, claim ->
                            mappingContext.read("$.claims."+claim)))
                    .entrySet()
                    .stream()
                    .filter( e -> isValidAttributeName((String) e.getValue()) && allowedAttributes.contains((String)e.getValue()))
                    .collect(Collectors.toMap(e -> e.getKey(), e -> mappingContext.read("$.attributes."+e.getValue(), PathInfo.class)))
                    .entrySet()
                    .stream()
                    .filter( e -> e.getValue() != null && e.getValue().getPath() != null && !e.getValue().getPath().isBlank() )
                    .collect(Collectors.toMap(e -> e.getKey(), e -> e.getValue()));
            System.out.println(kycAttributeMap);
            log.info("Final kyc attribute map : {}", kycAttributeMap);

            for(Map.Entry<String, PathInfo> entry : kycAttributeMap.entrySet()) {
                Map<String, String> langResult = Arrays.stream( (locales == null || locales.length == 0) ? new String[]{"en"} : locales)
                        .filter( locale -> getKycValue(personaContext, entry.getValue(), locale) != null)
                        .collect(Collectors.toMap(locale -> locale,
                                locale -> getKycValue(personaContext, entry.getValue(), locale)));

                if(langResult.isEmpty())
                    continue;

                if(langResult.size() == 1)
                    kyc.put(entry.getKey(), langResult.values().stream().findFirst().get());
                else {
                    //Handling the language tagging based on the requested claims_locales
                    kyc.putAll(langResult.entrySet()
                            .stream()
                            .collect(Collectors.toMap(e -> entry.getKey()+"#"+e.getKey(), e-> e.getValue())));
                }
            }
        } catch (Exception e) {
            log.error("Failed to load kyc for : {}", persona, e);
        }
        return kyc;
    }
    private String getKycValue(DocumentContext persona, PathInfo pathInfo, String locale) {
        try {
            String path =  pathInfo.getPath();
            String jsonPath = locale == null ? path : path.replace("_LOCALE_",
                    getLocalesMapping(locale, pathInfo.getDefaultLocale()));
            var value = persona.read(jsonPath);
            System.out.println(value);
            if(value instanceof List)
                return (String) ((List)value).get(0);
            } catch (Exception ex) {
            log.error("Failed to get kyc value with path {}", pathInfo, ex);
        }
        return null;
    }
    private String  getLocalesMapping(String locale, String defaultLocale) throws IOException {
        if(localesMapping == null || localesMapping.isEmpty()) {
            DocumentContext context = JsonPath.parse(FileUtils.getFile(personaDir, "claims_attributes_mapping.json"));
            localesMapping = context.read("$.locales");
        }
        return localesMapping.getOrDefault(locale, defaultLocale);
    }
    private boolean isValidAttributeName(String attribute) {
        return attribute != null && !attribute.isBlank();
    }
    private List<String> getPolicyKycAttributes(String relyingPartyId) throws IOException {
        String filename = String.format(POLICY_FILE_NAME_FORMAT, relyingPartyId);
        if(!policyContextMap.containsKey(relyingPartyId)) {
            DocumentContext context = JsonPath.parse(new File(policyDir, filename));
            List<String> allowedAttributes = context.read("$.allowedKycAttributes.*.attributeName");
            policyContextMap.put(relyingPartyId, allowedAttributes);
        }
        return policyContextMap.get(relyingPartyId);
    }

    private JWTClaimsSet verifyAndGetClaims(String kycToken) throws IdPException {
        JWTSignatureVerifyRequestDto signatureVerifyRequestDto = new JWTSignatureVerifyRequestDto();
        signatureVerifyRequestDto.setApplicationId(APPLICATION_ID);
        signatureVerifyRequestDto.setReferenceId("");
        signatureVerifyRequestDto.setJwtSignatureData(kycToken);
        JWTSignatureVerifyResponseDto responseDto = signatureService.jwtVerify(signatureVerifyRequestDto);
        if(!responseDto.isSignatureValid()) {
            log.error("Kyc token verification failed");
            throw new IdPException(INVALID_INPUT);
        }
        try {
            JWT jwt = JWTParser.parse(kycToken);
            JWTClaimsSetVerifier claimsSetVerifier = new DefaultJWTClaimsVerifier(new JWTClaimsSet.Builder()
                    .audience(Constants.IDP_SERVICE_APP_ID)
                    .issuer(APPLICATION_ID)
                    .build(), REQUIRED_CLAIMS);
            ((DefaultJWTClaimsVerifier<?>) claimsSetVerifier).setMaxClockSkew(5);
            claimsSetVerifier.verify(jwt.getJWTClaimsSet(), null);
            return jwt.getJWTClaimsSet();
        } catch (Exception e) {
            log.error("kyc token claims verification failed", e);
            throw new NotAuthenticatedException();
        }
    }

    @Override
    public SendOtpResult sendOtp(String relyingPartyId, String clientId, SendOtpDto sendOtpDto) throws SendOtpException {
        return null;
    }

    @Override
    public boolean isSupportedOtpChannel(String channel) {
        return false;
    }

    @Override
    public List<KycSigningCertificateData> getAllKycSigningCertificates() {
        return null;
    }
}

