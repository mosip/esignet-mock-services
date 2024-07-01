/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at https://mozilla.org/MPL/2.0/.
 */
package io.mosip.esignet.mock.identitysystem.dto;

import io.mosip.esignet.mock.identitysystem.util.ErrorConstants;
import lombok.Data;

import javax.validation.constraints.NotBlank;
import java.time.LocalDateTime;


@Data
public class VerifiedClaimRequestDto {

    @NotBlank(message = ErrorConstants.INVALID_INDIVIDUAL_ID)
    private String individualId;

    @NotBlank(message = ErrorConstants.INVALID_CLAIM)
    private String claim;

    @NotBlank(message = ErrorConstants.INVALID_TRUST_FRAMEWORK)
    private String trustFramework;

    private LocalDateTime verifiedDateTime;

}
