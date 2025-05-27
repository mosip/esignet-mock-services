package io.mosip.esignet.mock.identitysystem.repository;

import io.mosip.esignet.mock.identitysystem.entity.RelyingPartyData;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface RelyingPartyDataRepository extends JpaRepository<RelyingPartyData, String> {
    Optional<RelyingPartyData> findByRpId(String rpId);
}