package io.mosip.esignet.mock.identitysystem.repository;

import io.mosip.esignet.mock.identitysystem.entity.PartnerData;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface PartnerDataRepository extends JpaRepository<PartnerData, String> {
    Optional<PartnerData> findByRpId(String rpId);
}