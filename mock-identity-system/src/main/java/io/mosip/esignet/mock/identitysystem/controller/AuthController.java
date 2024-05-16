package io.mosip.esignet.mock.identitysystem.controller;

import io.mosip.esignet.mock.identitysystem.dto.*;
import io.mosip.esignet.mock.identitysystem.service.AuthenticationService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.MediaType;
import org.springframework.web.bind.annotation.*;

import javax.validation.Valid;
import javax.validation.constraints.NotBlank;
import javax.validation.constraints.NotNull;

@RestController
@RequestMapping("/")
public class AuthController {


    @Autowired
    private AuthenticationService authenticationService;

    @PostMapping(path = "kyc-auth/{relyingPartyId}/{clientId}",
            consumes = MediaType.APPLICATION_JSON_VALUE, produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseWrapper<KycAuthResponseDto> kycAuth(@RequestBody @NotNull @Valid KycAuthRequestDto kycAuthRequestDto,
                                                       @PathVariable @NotBlank String relyingPartyId,
                                                       @PathVariable @NotBlank String clientId) {
        ResponseWrapper<KycAuthResponseDto> responseWrapper = new ResponseWrapper<>();
        responseWrapper.setResponse(authenticationService.kycAuth(relyingPartyId, clientId, kycAuthRequestDto));
        return responseWrapper;
    }

    @PostMapping(path = "v2/kyc-auth/{relyingPartyId}/{clientId}",
            consumes = MediaType.APPLICATION_JSON_VALUE, produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseWrapper<KycAuthResponseDtoV2> kycAuthV2(@RequestBody @NotNull @Valid KycAuthRequestDto kycAuthRequestDto,
                                                       @PathVariable @NotBlank String relyingPartyId,
                                                       @PathVariable @NotBlank String clientId) {
        ResponseWrapper<KycAuthResponseDtoV2> responseWrapper = new ResponseWrapper<>();
        responseWrapper.setResponse(authenticationService.kycAuthV2(relyingPartyId, clientId, kycAuthRequestDto));
        return responseWrapper;
    }

    @PostMapping(path = "kyc-exchange/{relyingPartyId}/{clientId}",
            consumes = MediaType.APPLICATION_JSON_VALUE, produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseWrapper<KycExchangeResponseDto> kycExchange(@PathVariable @NotBlank String relyingPartyId,
                                                               @PathVariable @NotBlank String clientId,
                                                               @RequestBody @NotNull @Valid KycExchangeRequestDto kycExchangeRequestDto) {
        ResponseWrapper<KycExchangeResponseDto> responseWrapper = new ResponseWrapper<>();
        responseWrapper.setResponse(authenticationService.kycExchange(relyingPartyId, clientId, kycExchangeRequestDto));
        return responseWrapper;
    }

    @PostMapping(path = "/send-otp/{relyingPartyId}/{clientId}",
            consumes = MediaType.APPLICATION_JSON_VALUE, produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseWrapper<SendOtpResult> sendOtp(@PathVariable @NotBlank String relyingPartyId,
                                                  @PathVariable @NotBlank String clientId,
                                                  @Valid @RequestBody SendOtpDto sendOtpDto) {
        ResponseWrapper<SendOtpResult> responseWrapper = new ResponseWrapper<>();
        responseWrapper.setResponse(authenticationService.sendOtp(relyingPartyId, clientId, sendOtpDto));
        return responseWrapper;
    }
}
