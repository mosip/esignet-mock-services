package io.mosip.compass.admin.service;



import io.mosip.compass.admin.dto.UserInfoDTO;
import io.mosip.compass.admin.dto.UserInfoResponseDTO;

import java.util.List;
import java.util.UUID;

public interface UserInfoService {

    UserInfoResponseDTO createUserInfo(UserInfoDTO userInfoDTO);

    String deleteUserInfo(UUID id);

    UserInfoDTO getUserInfoByNationalUid(String nationalUid);

    List<UserInfoDTO> getAllUsers();

    String deleteMultipleUsers(List<UUID> userInfoIds);

    UserInfoResponseDTO updateUserInfo(UUID id, UserInfoDTO userInfoDTO);
}