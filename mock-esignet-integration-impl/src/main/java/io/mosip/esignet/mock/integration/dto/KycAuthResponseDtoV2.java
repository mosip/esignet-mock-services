/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at https://mozilla.org/MPL/2.0/.
 */
package io.mosip.esignet.mock.integration.dto;

import io.mosip.esignet.api.dto.claim.VerificationDetail;
import lombok.Data;

import java.util.List;
import java.util.Map;

@Data
public class KycAuthResponseDtoV2 extends KycAuthResponseDto{

    private Map<String,List<VerificationDetail>> claimMetaData;
}
