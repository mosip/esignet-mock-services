/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at https://mozilla.org/MPL/2.0/.
 */
package io.mosip.esignet.mock.identitysystem.dto;

import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@NoArgsConstructor
@Data
public class KycAuthDto {

    private String transactionId;
    private String individualId;
    private String password;
    private String otp;
    private String pin;
    private String biometrics;
    private String kbi;
    private List<String> tokens;
    private boolean isClaimMetadataRequired;

    public KycAuthDto(KycAuthRequestDto kycAuthRequestDto) {
        this.transactionId = kycAuthRequestDto.getTransactionId();
        this.individualId = kycAuthRequestDto.getIndividualId();
        this.password = kycAuthRequestDto.getPassword();
        this.otp = kycAuthRequestDto.getOtp();
        this.pin = kycAuthRequestDto.getPin();
        this.biometrics = kycAuthRequestDto.getBiometrics();
        this.kbi = kycAuthRequestDto.getKbi();
        this.tokens = kycAuthRequestDto.getTokens();
        this.isClaimMetadataRequired = false;
    }

    public KycAuthDto(KycAuthRequestDtoV2 kycAuthRequestDtoV2) {
        this.transactionId = kycAuthRequestDtoV2.getTransactionId();
        this.individualId = kycAuthRequestDtoV2.getIndividualId();
        this.password = kycAuthRequestDtoV2.getPassword();
        this.otp = kycAuthRequestDtoV2.getOtp();
        this.pin = kycAuthRequestDtoV2.getPin();
        this.biometrics = kycAuthRequestDtoV2.getBiometrics();
        this.kbi = kycAuthRequestDtoV2.getKbi();
        this.tokens = kycAuthRequestDtoV2.getTokens();
        this.isClaimMetadataRequired = kycAuthRequestDtoV2.isClaimMetadataRequired();
    }

}
