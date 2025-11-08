/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at https://mozilla.org/MPL/2.0/.
 */
package io.mosip.esignet.mock.identitysystem.dto;

import com.fasterxml.jackson.databind.JsonNode;
import io.mosip.esignet.mock.identitysystem.util.ErrorConstants;
import lombok.Data;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotEmpty;
import java.util.Map;


@Data
public class VerifiedClaimRequestDto {

    @NotBlank(message = ErrorConstants.INVALID_INDIVIDUAL_ID)
    private String individualId;

    @NotEmpty(message = ErrorConstants.INVALID_REQUEST)
    private Map<String, JsonNode> verificationDetail;

    private boolean active;

}
