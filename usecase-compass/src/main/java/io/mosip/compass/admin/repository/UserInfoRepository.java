package io.mosip.compass.admin.repository;

import io.mosip.compass.admin.constants.DbFields;
import io.mosip.compass.admin.entity.UserInfo;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Repository
public interface UserInfoRepository extends JpaRepository<UserInfo, UUID>, JpaSpecificationExecutor<UserInfo> {

    Optional<UserInfo> findByNationalUid(String nationalUid);

    List<UserInfo> findAllByOrderByCreatedTimesDesc();

    Page<UserInfo> findAllByOrderByCreatedTimesDesc(Pageable pageable);

    @Modifying
    @Query("DELETE FROM UserInfo u WHERE u.userInfoId IN :userInfoIds")
    void deleteAllByUserInfoIds(@Param("userInfoIds") List<UUID> userInfoIds);

    // Example of using constants in a query method (if you switch to native queries or dynamic construction)
    // Otherwise, you can leave '%' as a string in JPQL annotations.
    @Query("SELECT u FROM UserInfo u WHERE LOWER(u.cardAccessNumber) LIKE LOWER(CONCAT('%', :cardAccessNumber, '%'))")
    Page<UserInfo> findByCardAccessNumberContainingIgnoreCase(@Param("cardAccessNumber") String cardAccessNumber, Pageable pageable);

    @Query("SELECT u FROM UserInfo u WHERE u.cardAccessNumber = :cardAccessNumber")
    Optional<UserInfo> findByExactCardAccessNumber(@Param("cardAccessNumber") String cardAccessNumber);
}
