package io.mosip.esignet.mock.identitysystem.repository;

import io.mosip.esignet.mock.identitysystem.dto.Valid;
import io.mosip.esignet.mock.identitysystem.entity.KycAuth;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;
@Repository
public interface AuthRepo extends JpaRepository<KycAuth,String> {
    Optional<KycAuth> findByKycTokenAndValidityAndTransactionIdAndIndividualId(String kycToken, Valid validity, String transactionId, String individualId);
}
