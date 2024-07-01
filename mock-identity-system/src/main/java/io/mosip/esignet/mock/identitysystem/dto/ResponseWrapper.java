/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at https://mozilla.org/MPL/2.0/.
 */
package io.mosip.esignet.mock.identitysystem.dto;

import java.util.ArrayList;
import java.util.List;

import lombok.Data;

@Data
public class ResponseWrapper<T> {

    private String responseTime;
    private T response;
    private List<Error> errors = new ArrayList<>();
}
