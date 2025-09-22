/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at https://mozilla.org/MPL/2.0/.
 */
package io.mosip.esignet.mock.identitysystem.dto;

import io.mosip.esignet.mock.identitysystem.util.ErrorConstants;
import lombok.Data;

import javax.validation.constraints.NotBlank;

@Data
public class PartnerDto {

    @NotBlank(message = ErrorConstants.INVALID_PARTNER_ID)
    private String partnerId;

    @NotBlank(message = ErrorConstants.INVALID_CLIENT_ID)
    private String clientId;

    @NotBlank(message = ErrorConstants.INVALID_REQUEST)
    private String key;

    @NotBlank(message = ErrorConstants.INVALID_REQUEST)
    private String status;
}
