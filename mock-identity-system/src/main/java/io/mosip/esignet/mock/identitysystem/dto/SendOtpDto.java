/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at https://mozilla.org/MPL/2.0/.
 */
package io.mosip.esignet.mock.identitysystem.dto;

import lombok.Data;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import java.util.List;

@Data
public class SendOtpDto {

    @NotBlank(message = "invalid_transaction_id")
    private String transactionId;
    @NotBlank(message = "invalid_individual_id")
    private String individualId;
    @NotNull(message = "invalid_otp_channel")
    @Size(min = 1, message = "invalid_otp_channel")
    private List<String> otpChannels;
}
