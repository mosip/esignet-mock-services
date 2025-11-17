/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at https://mozilla.org/MPL/2.0/.
 */
package io.mosip.esignet.mock.identitysystem.entity;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Data
@Entity
@Table(name = "partner_data")
@NoArgsConstructor
@AllArgsConstructor
public class PartnerData {

    @Id
    @Column(name = "partner_id")
    private String partnerId;

    @Column(name = "client_id")
    private String clientId;

    @Column(name = "public_key")
    private String publicKey;

    @Column(name = "status")
    private String status;

    @Column(name = "cr_dtimes")
    private LocalDateTime createdtimes;
}