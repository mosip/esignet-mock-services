/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at https://mozilla.org/MPL/2.0/.
 */
package io.mosip.esignet.mock.identitysystem.repository;

import io.mosip.esignet.mock.identitysystem.entity.PartnerData;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface PartnerDataRepository extends JpaRepository<PartnerData, String> {

    Optional<PartnerData> findByPartnerIdAndClientId(String partnerId, String clientId);

}