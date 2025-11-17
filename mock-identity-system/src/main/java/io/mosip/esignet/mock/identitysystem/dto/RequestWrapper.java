/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at https://mozilla.org/MPL/2.0/.
 */
package io.mosip.esignet.mock.identitysystem.dto;

import static io.mosip.esignet.mock.identitysystem.util.ErrorConstants.INVALID_REQUEST;

import jakarta.validation.Valid;
import jakarta.validation.constraints.NotNull;

import io.mosip.esignet.mock.identitysystem.validator.RequestTime;
import lombok.Data;

@Data
public class RequestWrapper<T> {

    @RequestTime
    private String requestTime;

    @NotNull(message = INVALID_REQUEST)
    @Valid
    private T request;
}
