/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at https://mozilla.org/MPL/2.0/.
 */
package io.mosip.esignet.mock.identitysystem.service;

import io.mosip.esignet.mock.identitysystem.dto.*;
import io.mosip.esignet.mock.identitysystem.exception.MockIdentityException;

public interface AuthenticationService {

    KycAuthResponseDto kycAuth(String relyingPartnerId, String clientId, KycAuthRequestDto kycAuthRequestDto) throws MockIdentityException;

    KycExchangeResponseDto kycExchange(String relyingPartnerId, String clientId, KycExchangeRequestDto kycExchangeRequestDto) throws MockIdentityException;

    SendOtpResult sendOtp(String relyingPartyId, String clientId, SendOtpDto sendOtpDto) throws MockIdentityException;

    KycExchangeResponseDto kycExchangeV2(String relyingPartyId, String clientId, KycExchangeRequestDtoV2 kycExchangeRequestDtoV2);

    KycAuthResponseDtoV2 kycAuthV2(String relyingPartyId, String clientId, KycAuthRequestDto kycAuthRequestDto);
}
