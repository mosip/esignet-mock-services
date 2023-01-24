package io.mosip.esignet.mock.identitysystem.repository;

import org.springframework.data.repository.CrudRepository;
import org.springframework.stereotype.Repository;

import io.mosip.esignet.mock.identitysystem.entity.MockIdentity;

@Repository
public interface IdentityRepository extends CrudRepository<MockIdentity, String>{

}
