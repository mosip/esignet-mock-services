package io.mosip.esignet.mock.identitysystem.service;

import io.mosip.esignet.mock.identitysystem.dto.KycAuthRequestDto;
import io.mosip.esignet.mock.identitysystem.dto.KycAuthResponseDto;
import io.mosip.esignet.mock.identitysystem.dto.KycExchangeRequestDto;
import io.mosip.esignet.mock.identitysystem.dto.KycExchangeResponseDto;
import io.mosip.esignet.mock.identitysystem.exception.MockIdentityException;

public interface AuthenticationService {

    KycAuthResponseDto kycAuth(String relyingPartnerId, String clientId, KycAuthRequestDto kycAuthRequestDto) throws MockIdentityException;

    KycExchangeResponseDto kycExchange(String relyingPartnerId, String clientId, KycExchangeRequestDto kycExchangeRequestDto) throws MockIdentityException;
}
