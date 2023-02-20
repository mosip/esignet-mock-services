package io.mosip.esignet.mock.identitysystem.controller;

import io.mosip.esignet.mock.identitysystem.service.impl.MockAuthenticationService;
import io.mosip.idp.core.dto.KycAuthDto;
import io.mosip.idp.core.dto.KycExchangeDto;
import io.mosip.idp.core.exception.KycAuthException;
import io.mosip.idp.core.exception.KycExchangeException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import javax.validation.Valid;
import javax.validation.constraints.NotBlank;
import javax.validation.constraints.NotNull;

@RestController
@RequestMapping("/")
@CrossOrigin(origins = "*")
public class AuthController {
    @Autowired
    private MockAuthenticationService mockAuthenticationService;
    @PostMapping(path="kyc-auth/{relyingPartyId}/{clientId}",
            consumes= MediaType.APPLICATION_JSON_VALUE,produces=MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<?> kycAuth(@RequestBody @NotNull @Valid KycAuthDto kycAuthDto,
                                     @PathVariable @NotBlank String relyingPartyId,
                                     @PathVariable @NotBlank String clientId
    ) throws KycAuthException {
        return new ResponseEntity<>(mockAuthenticationService.doKycAuth(
                relyingPartyId,clientId,kycAuthDto), HttpStatus.ACCEPTED);
    }
    @PostMapping(path="kyc-exchange/{relyingPartyId}/{clientId}",
            consumes= MediaType.APPLICATION_JSON_VALUE,produces=MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<?> kycExchange(@PathVariable @NotBlank String relyingPartyId,
                                         @PathVariable @NotBlank String clientId,
                                         @RequestBody @NotNull @Valid KycExchangeDto kycExchangeDto) throws KycExchangeException {
        return new ResponseEntity<>(mockAuthenticationService.doKycExchange(relyingPartyId,clientId,
                kycExchangeDto), HttpStatus.ACCEPTED);
    }

}
