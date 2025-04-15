package io.mosip.compass.admin.mapper;


import io.mosip.compass.admin.dto.UserInfoDTO;
import io.mosip.compass.admin.dto.UserInfoResponseDTO;
import io.mosip.compass.admin.entity.UserInfo;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.Named;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import javax.imageio.ImageIO;
import javax.imageio.ImageReader;
import javax.imageio.stream.ImageInputStream;
import java.awt.*;
import java.awt.image.BufferedImage;
import java.io.ByteArrayInputStream;
import java.io.ByteArrayOutputStream;
import java.io.IOException;
import java.util.Base64;
import java.util.Iterator;
import java.util.List;

@Mapper(componentModel = "spring")
public interface UserInfoMapper {

    Logger log = LoggerFactory.getLogger(UserInfoMapper.class);

    @Mapping(target = "vcNum", ignore = true) // This is auto-generated
    @Mapping(target = "createdTimes", expression = "java(java.time.LocalDateTime.now())")
    @Mapping(target = "faceImageColor", source = "faceImageColor", qualifiedByName = "base64ToBinary")
    @Mapping(target = "faceImageGrey", source = "faceImageColor", qualifiedByName = "base64ToGreyBinary") // <- updated
    UserInfo toEntity(UserInfoDTO dto);

    @Mapping(target = "faceImageColor", source = "faceImageColor", qualifiedByName = "binaryToBase64")
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

    @Named("base64ToGreyBinary")
    default byte[] base64ToGreyBinary(String base64String) {
        if (base64String == null || base64String.isEmpty()) {
            return null;
        }

        byte[] colorBytes = Base64.getDecoder().decode(base64String);

        try (
                ByteArrayInputStream bais = new ByteArrayInputStream(colorBytes);
                ImageInputStream iis = ImageIO.createImageInputStream(bais)
        ) {
            Iterator<ImageReader> readers = ImageIO.getImageReaders(iis);
            if (!readers.hasNext()) {
                throw new IllegalArgumentException("Unsupported image format");
            }

            ImageReader reader = readers.next();
            reader.setInput(iis, true);
            String formatName = reader.getFormatName().toLowerCase();

            BufferedImage colorImage = reader.read(0);
            reader.dispose();

            if (colorImage == null) {
                throw new IOException("Could not read image");
            }

            BufferedImage greyImage = new BufferedImage(
                    colorImage.getWidth(),
                    colorImage.getHeight(),
                    BufferedImage.TYPE_BYTE_GRAY
            );

            Graphics2D g = greyImage.createGraphics();
            try {
                g.drawImage(colorImage, 0, 0, null);
            } finally {
                g.dispose(); // Must call dispose manually
            }

            try (ByteArrayOutputStream baos = new ByteArrayOutputStream()) {
                boolean success = ImageIO.write(greyImage, formatName, baos);
                if (!success) {
                    throw new IOException("Failed to write image in format: " + formatName);
                }
                return baos.toByteArray();
            }

        } catch (IOException e) {
            log.error("Error converting color image to grayscale image", e);
            return null;
        }
    }
}