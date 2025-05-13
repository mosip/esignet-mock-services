/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at https://mozilla.org/MPL/2.0/.
 */
package io.mosip.esignet.mock.identitysystem.entity;

import lombok.Data;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import java.time.LocalDateTime;

@Data
@Entity(name = "VerifiedClaim")
@Table(name = "verified_claim", schema = "mockidentitysystem")
public class VerifiedClaim {

    @Id
    @Column(name = "id")
    private String id;

    @Column(name = "individual_id")
    private String individualId;

    @Column(name = "claim")
    private String claim;

    @Column(name = "trust_framework")
    private String trustFramework;

    @Column(name = "detail")
    private String detail;

    @Column(name="cr_dtimes")
    private LocalDateTime crDateTime;

    @Column(name = "upd_dtimes")
    private LocalDateTime updDateTime;

    @Column(name = "is_active")
    private Boolean isActive;

    @Column(name = "cr_by")
    private String createdBy;
}
