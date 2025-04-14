package io.mosip.compass.admin.mapper;


import io.mosip.compass.admin.dto.UserInfoDTO;
import io.mosip.compass.admin.dto.UserInfoResponseDTO;
import io.mosip.compass.admin.entity.UserInfo;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.Named;

import java.util.Base64;
import java.util.List;

@Mapper(componentModel = "spring")
public interface UserInfoMapper {

    @Mapping(target = "vcNum", ignore = true) // This is auto-generated
    @Mapping(target = "createdTimes", expression = "java(java.time.LocalDateTime.now())")
    @Mapping(target = "faceImageColor", source = "faceImageColor", qualifiedByName = "base64ToBinary")
    @Mapping(target = "faceImageGrey", source = "faceImageGrey", qualifiedByName = "base64ToBinary")
    UserInfo toEntity(UserInfoDTO dto);

    @Mapping(target = "faceImageColor", source = "faceImageColor", qualifiedByName = "binaryToBase64")
    @Mapping(target = "faceImageGrey", source = "faceImageGrey", qualifiedByName = "binaryToBase64")

    UserInfoDTO toDto(UserInfo entity);

    @Mapping(source = "userInfoId", target = "userInfoId")
    @Mapping(source = "nationalUid", target = "nationalUid")
    UserInfoResponseDTO toResponseDto(UserInfo entity);

    List<UserInfoDTO> toDtoList(List<UserInfo> entities);

    List<UserInfo> toEntityList(List<UserInfoDTO> dtos);


    // Named methods for conversion
    @Named("base64ToBinary")
    default byte[] base64ToBinary(String base64String) {
        if (base64String == null || base64String.isEmpty()) {
            return null;
        }
        return Base64.getDecoder().decode(base64String);
    }

    @Named("binaryToBase64")
    default String binaryToBase64(byte[] binaryData) {
        if (binaryData == null || binaryData.length == 0) {
            return null;
        }
        return Base64.getEncoder().encodeToString(binaryData);
    }
}