/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at https://mozilla.org/MPL/2.0/.
 */
package io.mosip.esignet.mock.identitysystem.entity;

import io.mosip.esignet.mock.identitysystem.dto.Valid;
import lombok.*;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import java.time.LocalDateTime;

@AllArgsConstructor
@NoArgsConstructor
@Setter
@Getter
@Entity
@Table(name="kyc_auth", schema = "mockidentitysystem")
public class KycAuth {
    @Id
    @Column(name="kyc_token")
    private String kycToken;
    @Column(name="partner_specific_user_token")
    private String partnerSpecificUserToken;
    @Column(name="response_time")
    private LocalDateTime responseTime;
    @Column(name="validity")
    private Valid validity;
    @Column(name="transaction_id")
    private String transactionId;
    @Column(name="individual_id")
    private String individualId;

    public KycAuth(String s, String s1, LocalDateTime parse, Valid active) {

    }


}


