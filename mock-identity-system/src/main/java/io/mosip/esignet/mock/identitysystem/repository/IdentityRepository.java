package io.mosip.esignet.mock.identitysystem.repository;

<<<<<<< HEAD

=======
import io.mosip.esignet.mock.identitysystem.dto.Valid;
import io.mosip.esignet.mock.identitysystem.entity.KycAuth;
import org.springframework.data.jpa.repository.JpaRepository;
>>>>>>> 5bf0c90266eece7fd108d5918669eeb1810b6605
import org.springframework.data.repository.CrudRepository;
import org.springframework.stereotype.Repository;
import io.mosip.esignet.mock.identitysystem.entity.MockIdentity;

<<<<<<< HEAD
=======
import java.util.Optional;
>>>>>>> 5bf0c90266eece7fd108d5918669eeb1810b6605

@Repository
public interface IdentityRepository extends CrudRepository<MockIdentity, String>{
    }

