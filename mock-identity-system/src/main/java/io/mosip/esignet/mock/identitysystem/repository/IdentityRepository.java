package io.mosip.esignet.mock.identitysystem.repository;

import io.mosip.esignet.mock.identitysystem.dto.Valid;
import io.mosip.esignet.mock.identitysystem.entity.KycAuth;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.repository.CrudRepository;
import org.springframework.stereotype.Repository;

import io.mosip.esignet.mock.identitysystem.entity.MockIdentity;

import java.util.Optional;

@Repository
public interface IdentityRepository extends CrudRepository<MockIdentity, String>{
    }

