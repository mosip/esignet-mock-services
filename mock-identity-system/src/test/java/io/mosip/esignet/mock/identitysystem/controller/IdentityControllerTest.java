/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at https://mozilla.org/MPL/2.0/.
 */
package io.mosip.esignet.mock.identitysystem.controller;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.node.NullNode;
import com.fasterxml.jackson.databind.node.ObjectNode;
import io.mosip.esignet.mock.identitysystem.dto.IdentityData;
import io.mosip.esignet.mock.identitysystem.dto.LanguageValue;
import io.mosip.esignet.mock.identitysystem.dto.RequestWrapper;
import io.mosip.esignet.mock.identitysystem.dto.VerifiedClaimRequestDto;
import io.mosip.esignet.mock.identitysystem.service.IdentityService;
import io.mosip.esignet.mock.identitysystem.util.ErrorConstants;
import org.junit.jupiter.api.Assertions;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.Mockito;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.test.context.bean.override.mockito.MockitoBean;
import org.springframework.test.web.servlet.MockMvc;

import java.time.ZoneOffset;
import java.time.ZonedDateTime;
import java.time.format.DateTimeFormatter;
import java.util.*;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@WebMvcTest(value = IdentityController.class)
public class IdentityControllerTest {

	@Autowired
	MockMvc mockMvc;

	@MockitoBean
	IdentityService identityService;

	public static final String UTC_DATETIME_PATTERN = "yyyy-MM-dd'T'HH:mm:ss.SSS'Z'";

	ObjectMapper objectMapper = new ObjectMapper();

	ObjectNode identityRequest;

	@BeforeEach
	public void init() {
		IdentityData identityData = new IdentityData();
		identityData.setIndividualId("826741183");
		identityData.setEmail("test@gmail.com");

		List<LanguageValue> preferredNameList =new ArrayList<>();
		LanguageValue engLangValue= new LanguageValue();
		engLangValue.setValue("Siddharth K Mansour");
		engLangValue.setLanguage("eng");
		LanguageValue arabicLangValue= new LanguageValue();
		arabicLangValue.setLanguage("ara");
		arabicLangValue.setValue("سيدارت ك منصور");
		preferredNameList.add(engLangValue);
		preferredNameList.add(arabicLangValue);
		identityData.setFullName(preferredNameList);
		identityData.setPreferredUsername(preferredNameList);
		identityData.setFamilyName(preferredNameList);
		identityData.setGivenName(preferredNameList);
		identityData.setPreferredUsername(preferredNameList);
		identityData.setNickName(preferredNameList);
		identityData.setPreferredUsername(preferredNameList);
		identityData.setMiddleName(preferredNameList);

		LanguageValue mockLang = new LanguageValue();
		mockLang.setLanguage("eng");
		mockLang.setValue("mock");
		identityData.setGender(Arrays.asList(mockLang));
		identityData.setStreetAddress(Arrays.asList(mockLang));
		identityData.setLocality(Arrays.asList(mockLang));
		identityData.setRegion(Arrays.asList(mockLang));

		LanguageValue langValue = new LanguageValue();
		langValue.setLanguage("eng");
		langValue.setValue("ind");
		identityData.setCountry(Arrays.asList(langValue));

		identityData.setDateOfBirth("20021990");
		identityData.setEncodedPhoto("testencodedphoto");
		identityData.setGender(Arrays.asList(langValue));
		identityData.setLocality(Arrays.asList(langValue));
		identityData.setPostalCode("12011");
		identityData.setPin("1289001");
		identityData.setRegion(Arrays.asList(langValue));
		identityData.setFullName(Arrays.asList(langValue));
		identityData.setGivenName(Arrays.asList(langValue));
		identityData.setFamilyName(Arrays.asList(langValue));
		identityData.setStreetAddress(Arrays.asList(langValue));
		identityData.setPhone("9090909090");
		identityData.setPreferredLang("eng");
		identityData.setZoneInfo("local");
		identityData.setLocale("eng");
		identityData.setPassword("mock-password");

		identityRequest = objectMapper.valueToTree(identityData);
	}

	@Test
	public void createIdentity_withValidIdentity_returnSuccessResponse() throws Exception {
		RequestWrapper<JsonNode> requestWrapper = new RequestWrapper<JsonNode>();
		ZonedDateTime requestTime = ZonedDateTime.now(ZoneOffset.UTC);
		requestWrapper.setRequestTime(requestTime.format(DateTimeFormatter.ofPattern(UTC_DATETIME_PATTERN)));
		requestWrapper.setRequest(identityRequest);

		Mockito.doNothing().when(identityService).addIdentity(identityRequest);

		mockMvc.perform(post("/identity").content(objectMapper.writeValueAsString(requestWrapper))
						.contentType(MediaType.APPLICATION_JSON)).andExpect(status().isOk())
				.andExpect(jsonPath("$.response.status").value("mock identity data created successfully"));
	}

	@Test
	public void createIdentity_withInvalidIdentity_returnErrorResponse() throws Exception {
		RequestWrapper<ObjectNode> requestWrapper = new RequestWrapper<ObjectNode>();
		ZonedDateTime requestTime = ZonedDateTime.now(ZoneOffset.UTC);
		requestWrapper.setRequestTime(requestTime.format(DateTimeFormatter.ofPattern(UTC_DATETIME_PATTERN)));
		identityRequest.put("individualId", NullNode.getInstance());
		requestWrapper.setRequest(identityRequest);

		Mockito.doNothing().when(identityService).addIdentity(identityRequest);

		mockMvc.perform(post("/identity").content(objectMapper.writeValueAsString(requestWrapper))
						.contentType(MediaType.APPLICATION_JSON)).andExpect(status().isOk())
				.andExpect(jsonPath("$.errors").isNotEmpty())
				.andExpect(jsonPath("$.errors[0].errorCode").value("invalid_individualid"));
	}

	@Test
	public void createIdentity_withInvalidNameAndLocale_returnErrorResponse() throws Exception {
		RequestWrapper<ObjectNode> requestWrapper = new RequestWrapper<>();
		ZonedDateTime requestTime = ZonedDateTime.now(ZoneOffset.UTC);
		requestWrapper.setRequestTime(requestTime.format(DateTimeFormatter.ofPattern(UTC_DATETIME_PATTERN)));
		identityRequest.put("fullName", NullNode.getInstance());
		identityRequest.put("locale", NullNode.getInstance());
		requestWrapper.setRequest(identityRequest);

		Mockito.doNothing().when(identityService).addIdentity(identityRequest);
		mockMvc.perform(post("/identity").content(objectMapper.writeValueAsString(requestWrapper))
						.contentType(MediaType.APPLICATION_JSON)).andExpect(status().isOk())
				.andExpect(jsonPath("$.errors").isNotEmpty())
				.andExpect(jsonPath("$.errors.size()").value(2));
	}

	@Test
	public void createIdentity_withInvalidFullName_returnErrorResponse() throws Exception {
		RequestWrapper<ObjectNode> requestWrapper = new RequestWrapper<>();
		ZonedDateTime requestTime = ZonedDateTime.now(ZoneOffset.UTC);
		requestWrapper.setRequestTime(requestTime.format(DateTimeFormatter.ofPattern(UTC_DATETIME_PATTERN)));

		List<LanguageValue> nameList=new ArrayList<>();
		LanguageValue engLangValue= new LanguageValue();
		engLangValue.setValue("Siddharth K سيدارت");
		engLangValue.setLanguage("eng");
		LanguageValue arabicLangValue= new LanguageValue();
		arabicLangValue.setLanguage("ara");
		arabicLangValue.setValue("سيدارت ك منصور");
		nameList.add(engLangValue);
		nameList.add(arabicLangValue);
		identityRequest.put("fullName", objectMapper.valueToTree(nameList));
		requestWrapper.setRequest(identityRequest);

		Mockito.doNothing().when(identityService).addIdentity(identityRequest);
		mockMvc.perform(post("/identity").content(objectMapper.writeValueAsString(requestWrapper))
						.contentType(MediaType.APPLICATION_JSON)).andExpect(status().isOk())
				.andExpect(jsonPath("$.errors").isNotEmpty())
				.andExpect(jsonPath("$.errors[0].errorCode").value("invalid_fullname"));
	}

	@Test
	public void getIdentity_withValidId_returnSuccessResponse() throws Exception {
		identityRequest.put("individualId", "123456789");
		Mockito.when(identityService.getIdentity(Mockito.anyString())).thenReturn(identityRequest);

		mockMvc.perform(get("/identity/{individualId}", "123456789")
						.contentType(MediaType.APPLICATION_JSON)).andExpect(status().isOk())
				.andExpect(jsonPath("$.response.individualId").value("123456789"));
	}

	@Test
	public void addVerifiedClaims_withValidDetails_returnSuccessResponse() throws Exception {

		RequestWrapper<VerifiedClaimRequestDto> requestWrapper = new RequestWrapper<VerifiedClaimRequestDto>();
		ZonedDateTime requestTime = ZonedDateTime.now(ZoneOffset.UTC);
		requestWrapper.setRequestTime(requestTime.format(DateTimeFormatter.ofPattern(UTC_DATETIME_PATTERN)));

		VerifiedClaimRequestDto verifiedClaimRequestDto = new  VerifiedClaimRequestDto();
		verifiedClaimRequestDto.setActive(true);
		verifiedClaimRequestDto.setIndividualId("123456789");
		Map<String, JsonNode> verificationDetail = new HashMap<>();

		ObjectNode emailVerification = objectMapper.createObjectNode();
		emailVerification.put("trust_framework", "testTrustFramework");
		verificationDetail.put("testClaim", emailVerification);
		verifiedClaimRequestDto.setVerificationDetail(verificationDetail);

		requestWrapper.setRequest(verifiedClaimRequestDto);

		Mockito.doNothing().when(identityService).addVerifiedClaim(verifiedClaimRequestDto);
		Mockito.when(identityService.getIdentity(Mockito.anyString())).thenReturn(identityRequest);

		mockMvc.perform(post("/identity/add-verified-claim").content(objectMapper.writeValueAsString(requestWrapper))
						.contentType(MediaType.APPLICATION_JSON)).andExpect(status().isOk())
				.andExpect(jsonPath("$.response.status").value("Verified Claim added successfully"));
	}

	@Test
	public void addVerifiedClaim_withInvalidClaim_returnErrorResponse() throws  Exception {
		RequestWrapper<VerifiedClaimRequestDto> requestWrapper = new RequestWrapper<VerifiedClaimRequestDto>();
		ZonedDateTime requestTime = ZonedDateTime.now(ZoneOffset.UTC);
		requestWrapper.setRequestTime(requestTime.format(DateTimeFormatter.ofPattern(UTC_DATETIME_PATTERN)));

		VerifiedClaimRequestDto verifiedClaimRequestDto = new  VerifiedClaimRequestDto();
		verifiedClaimRequestDto.setActive(true);
		verifiedClaimRequestDto.setIndividualId("123456789");
		Map<String, JsonNode> verificationDetail = new HashMap<>();
		verifiedClaimRequestDto.setVerificationDetail(verificationDetail);

		requestWrapper.setRequest(verifiedClaimRequestDto);

		Mockito.doNothing().when(identityService).addVerifiedClaim(verifiedClaimRequestDto);

		mockMvc.perform(post("/identity/add-verified-claim").content(objectMapper.writeValueAsString(requestWrapper))
						.contentType(MediaType.APPLICATION_JSON)).andExpect(status().isOk())
				.andExpect(jsonPath("$.errors").isNotEmpty())
				.andExpect(jsonPath("$.errors[0].errorCode").value(ErrorConstants.INVALID_REQUEST));
	}

	@Test
	public void updateIdentity_withValidIdentity_thenPass() throws Exception {
		RequestWrapper<JsonNode> requestWrapper = new RequestWrapper<>();
		ZonedDateTime requestTime = ZonedDateTime.now(ZoneOffset.UTC);
		requestWrapper.setRequestTime(requestTime.format(DateTimeFormatter.ofPattern(UTC_DATETIME_PATTERN)));
		requestWrapper.setRequest(identityRequest);

		Mockito.doNothing().when(identityService).updateIdentity(identityRequest);

		mockMvc.perform(put("/identity").content(objectMapper.writeValueAsString(requestWrapper))
						.contentType(MediaType.APPLICATION_JSON)).andExpect(status().isOk())
				.andExpect(jsonPath("$.response.status").value("mock Identity data updated successfully"));
	}

	@Test
	public void updateIdentity_withInValidIdentity_thenFail() throws Exception {
		RequestWrapper<ObjectNode> requestWrapper = new RequestWrapper<>();
		ZonedDateTime requestTime = ZonedDateTime.now(ZoneOffset.UTC);
		requestWrapper.setRequestTime(requestTime.format(DateTimeFormatter.ofPattern(UTC_DATETIME_PATTERN)));
		identityRequest.put("fullName", NullNode.getInstance());
		requestWrapper.setRequest(identityRequest);

		Mockito.doNothing().when(identityService).updateIdentity(identityRequest);
		mockMvc.perform(put("/identity").content(objectMapper.writeValueAsString(requestWrapper))
						.contentType(MediaType.APPLICATION_JSON)).andExpect(status().isOk())
				.andExpect(jsonPath("$.errors").isNotEmpty())
				.andExpect(jsonPath("$.errors[0].errorCode").value("invalid_fullname"));
	}

	@Test
	public void getUiSpec_withValidRequest_thenPass() throws Exception {
		// Create mock schema JsonNode
		ObjectNode mockSchema = objectMapper.createObjectNode();
		mockSchema.put("schemaVersion", "1.0");
		mockSchema.put("type", "object");
		ObjectNode properties = objectMapper.createObjectNode();
		properties.put("individualId", "string");
		mockSchema.set("properties", properties);
		Mockito.when(identityService.getUISpecification()).thenReturn(mockSchema);
		mockMvc.perform(get("/identity/ui-spec")
						.contentType(MediaType.APPLICATION_JSON))
				.andExpect(status().isOk())
				.andExpect(jsonPath("$.response.schemaVersion").value("1.0"))
				.andExpect(jsonPath("$.response.type").value("object"));
	}

	@Test
	public void handleMethodArgumentNotValidException_withNull_thenPass() {
		IdentityController controller = new IdentityController();
		ResponseEntity response = controller.handleMethodArgumentNotValidException(null);
		Assertions.assertEquals(HttpStatus.BAD_REQUEST, response.getStatusCode());
		Assertions.assertTrue(response.getBody() instanceof List);
		Assertions.assertTrue(((List<?>) response.getBody()).isEmpty());
	}
}
