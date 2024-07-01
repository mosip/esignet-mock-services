/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at https://mozilla.org/MPL/2.0/.
 */
package io.mosip.esignet.mock.integration.dto;

import lombok.Data;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;

@Data
public class VerifiedKycExchangeRequestDto{

    private LocalDateTime requestDateTime;
    private String transactionId;
    private String kycToken;
    private String individualId;
    private Map<String,Object> acceptedClaims;
    private List<String> claimLocales;
}
