package io.mosip.esignet.mock.identitysystem.repository;

import io.mosip.esignet.mock.identitysystem.entity.VerifiedClaim;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface VerifiedClaimRepository extends JpaRepository<VerifiedClaim,String> {

    Optional<List<VerifiedClaim>> findByIndividualIdAndActive(String individualId,Boolean active);
}
