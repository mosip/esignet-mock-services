/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at https://mozilla.org/MPL/2.0/.
 */
package io.mosip.esignet.mock.identitysystem.dto;

import com.fasterxml.jackson.databind.JsonNode;
import io.mosip.esignet.mock.identitysystem.validator.IdentitySchema;
import io.mosip.esignet.mock.identitysystem.validator.RequestTime;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

import static io.mosip.esignet.mock.identitysystem.util.ErrorConstants.INVALID_REQUEST;

@Data
public class CreateIdentity {

    @RequestTime
    private String requestTime;

    @NotNull(message = INVALID_REQUEST)
    @IdentitySchema(action = "CREATE")
    private JsonNode request;
}
