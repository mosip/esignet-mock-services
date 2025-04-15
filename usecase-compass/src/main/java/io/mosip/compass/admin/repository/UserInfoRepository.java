package io.mosip.compass.admin.repository;

import io.mosip.compass.admin.entity.UserInfo;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Repository
public interface UserInfoRepository extends JpaRepository<UserInfo, UUID> {
    Optional<UserInfo> findByNationalUid(String nationalUid);

    List<UserInfo> findAllByOrderByCreatedTimesDesc();

    @Modifying
    @Query("DELETE FROM UserInfo u WHERE u.userInfoId IN :userInfoIds")
    void deleteAllByUserInfoIds(@Param("userInfoIds") List<UUID> userInfoIds);
}