/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at https://mozilla.org/MPL/2.0/.
 */
package io.mosip.esignet.mock.identitysystem.entity;

import lombok.Data;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.Id;
import java.time.LocalDateTime;

@Data
@Entity
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

    @Column(name = "verified_datetime")
    private LocalDateTime verifiedDateTime;

    @Column(name="cr_dtimes")
    private LocalDateTime crDateTime;

    @Column(name = "upd_dtimes")
    private LocalDateTime updDateTime;

    @Column(name = "active")
    private Boolean active;
}
