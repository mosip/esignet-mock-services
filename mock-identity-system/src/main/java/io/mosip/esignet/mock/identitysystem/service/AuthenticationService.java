/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at https://mozilla.org/MPL/2.0/.
 */
package io.mosip.esignet.mock.identitysystem.service;

import com.nimbusds.jose.jwk.RSAKey;
import io.mosip.esignet.mock.identitysystem.dto.*;
import io.mosip.esignet.mock.identitysystem.exception.MockIdentityException;

public interface AuthenticationService {

    KycAuthResponseDto kycAuth(String relyingPartnerId, String clientId, KycAuthDto kycAuthDto) throws MockIdentityException;

    KycExchangeResponseDto kycExchange(String relyingPartnerId, String clientId, KycExchangeDto kycExchangeDto) throws MockIdentityException;

    SendOtpResult sendOtp(String relyingPartyId, String clientId, SendOtpDto sendOtpDto) throws MockIdentityException;
}
