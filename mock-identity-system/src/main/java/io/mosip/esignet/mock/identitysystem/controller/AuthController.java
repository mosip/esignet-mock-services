/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at https://mozilla.org/MPL/2.0/.
 */
package io.mosip.esignet.mock.identitysystem.controller;

import io.mosip.esignet.mock.identitysystem.dto.*;
import io.mosip.esignet.mock.identitysystem.service.AuthenticationService;
import io.mosip.esignet.mock.identitysystem.util.HelperUtil;
import io.mosip.kernel.keymanagerservice.dto.AllCertificatesDataResponseDto;
import io.mosip.kernel.keymanagerservice.service.KeymanagerService;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.MediaType;
import org.springframework.web.bind.annotation.*;

import jakarta.validation.Valid;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

import java.util.Optional;

import static io.mosip.esignet.mock.identitysystem.util.Constants.APPLICATION_ID;

@RestController
@RequestMapping("/")
@Slf4j
public class AuthController {


    @Autowired
    private AuthenticationService authenticationService;

    @Autowired
    private KeymanagerService keymanagerService;

    @Value("${mosip.mockidentitysystem.response.delay:0}")
    private int delayInMilliSecs;

    @PostMapping(path = "kyc-auth/{relyingPartyId}/{clientId}",
            consumes = MediaType.APPLICATION_JSON_VALUE, produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseWrapper<KycAuthResponseDto> kycAuth(@RequestBody @NotNull @Valid KycAuthRequestDto kycAuthRequestDto,
                                                       @PathVariable @NotBlank String relyingPartyId,
                                                       @PathVariable @NotBlank String clientId) {
        ResponseWrapper<KycAuthResponseDto> responseWrapper = new ResponseWrapper<>();
        responseWrapper.setResponse(authenticationService.kycAuth(relyingPartyId, clientId, new KycAuthDto(kycAuthRequestDto)));
        responseWrapper.setResponseTime(HelperUtil.getCurrentUTCDateTime());
        delayedResponse();
        return responseWrapper;
    }



    @PostMapping(path = "v2/kyc-auth/{relyingPartyId}/{clientId}",
            consumes = MediaType.APPLICATION_JSON_VALUE, produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseWrapper<KycAuthResponseDto> kycAuthV2(@RequestBody @NotNull @Valid KycAuthRequestDtoV2 kycAuthRequestDtoV2,
                                                       @PathVariable @NotBlank String relyingPartyId,
                                                       @PathVariable @NotBlank String clientId) {
        ResponseWrapper<KycAuthResponseDto> responseWrapper = new ResponseWrapper<>();
        responseWrapper.setResponse(authenticationService.kycAuth(relyingPartyId, clientId, new KycAuthDto(kycAuthRequestDtoV2)));
        responseWrapper.setResponseTime(HelperUtil.getCurrentUTCDateTime());
        delayedResponse();
        return responseWrapper;
    }

    @PostMapping(path = "kyc-exchange/{relyingPartyId}/{clientId}",
            consumes = MediaType.APPLICATION_JSON_VALUE, produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseWrapper<KycExchangeResponseDto> kycExchange(@PathVariable @NotBlank String relyingPartyId,
                                                               @PathVariable @NotBlank String clientId,
                                                               @RequestBody @NotNull @Valid KycExchangeRequestDto kycExchangeRequestDto) {
        ResponseWrapper<KycExchangeResponseDto> responseWrapper = new ResponseWrapper<>();
        responseWrapper.setResponse(authenticationService.kycExchange(relyingPartyId, clientId, new KycExchangeDto(kycExchangeRequestDto, null,"JWS")));
        responseWrapper.setResponseTime(HelperUtil.getCurrentUTCDateTime());
        delayedResponse();
        return responseWrapper;
    }

    @PostMapping(path = "v2/kyc-exchange/{relyingPartyId}/{clientId}",
            consumes = MediaType.APPLICATION_JSON_VALUE, produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseWrapper<KycExchangeResponseDto> kycExchangeV2(@PathVariable @NotBlank String relyingPartyId,
                                                               @PathVariable @NotBlank String clientId,
                                                               @RequestBody @NotNull @Valid KycExchangeRequestDtoV2 kycExchangeRequestDtoV2) {
        ResponseWrapper<KycExchangeResponseDto> responseWrapper = new ResponseWrapper<>();
        responseWrapper.setResponse(authenticationService.kycExchange(relyingPartyId, clientId, new KycExchangeDto(kycExchangeRequestDtoV2,
                kycExchangeRequestDtoV2.getAcceptedClaimDetail(),"JWS")));
        responseWrapper.setResponseTime(HelperUtil.getCurrentUTCDateTime());
        delayedResponse();
        return responseWrapper;
    }

    @PostMapping(path = "v3/kyc-exchange/{relyingPartyId}/{clientId}",
            consumes = MediaType.APPLICATION_JSON_VALUE, produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseWrapper<KycExchangeResponseDto> kycExchangeV3(@PathVariable @NotBlank String relyingPartyId,
                                                                 @PathVariable @NotBlank String clientId,
                                                                 @RequestBody @NotNull @Valid KycExchangeRequestDtoV3 kycExchangeRequestDtoV3) {
        ResponseWrapper<KycExchangeResponseDto> responseWrapper = new ResponseWrapper<>();
        responseWrapper.setResponse(authenticationService.kycExchange(relyingPartyId, clientId, new KycExchangeDto(kycExchangeRequestDtoV3, kycExchangeRequestDtoV3.getAcceptedClaimDetail(),
                kycExchangeRequestDtoV3.getRespType())));
        responseWrapper.setResponseTime(HelperUtil.getCurrentUTCDateTime());
        delayedResponse();
        return responseWrapper;
    }

    @PostMapping(path = "send-otp/{relyingPartyId}/{clientId}",
            consumes = MediaType.APPLICATION_JSON_VALUE, produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseWrapper<SendOtpResult> sendOtp(@PathVariable @NotBlank String relyingPartyId,
                                                  @PathVariable @NotBlank String clientId,
                                                  @Valid @RequestBody SendOtpDto sendOtpDto) {
        ResponseWrapper<SendOtpResult> responseWrapper = new ResponseWrapper<>();
        responseWrapper.setResponse(authenticationService.sendOtp(relyingPartyId, clientId, sendOtpDto));
        responseWrapper.setResponseTime(HelperUtil.getCurrentUTCDateTime());
        delayedResponse();
        return responseWrapper;
    }

    @GetMapping(path = "keys.json", produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseWrapper<AllCertificatesDataResponseDto> getAllKeys() {
        ResponseWrapper<AllCertificatesDataResponseDto> responseWrapper = new ResponseWrapper<>();
        responseWrapper.setResponse(keymanagerService.getAllCertificates(APPLICATION_ID, Optional.empty()));
        return responseWrapper;
    }

    private void delayedResponse() {
        try {
            Thread.sleep(delayInMilliSecs);
        } catch (InterruptedException e) {
            log.error("Unable to induce the delay" + e.getMessage());
            Thread.currentThread().interrupt();
        }
    }
}
