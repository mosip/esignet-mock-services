package io.mosip.mock.identity.system.repository;

import org.springframework.data.repository.CrudRepository;
import org.springframework.stereotype.Repository;

import io.mosip.mock.identity.system.entity.MockIdentity;

@Repository
public interface MockIdentityRepository extends CrudRepository<MockIdentity, String>{

}
