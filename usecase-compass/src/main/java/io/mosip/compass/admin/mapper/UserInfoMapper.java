package io.mosip.compass.admin.mapper;


import io.mosip.compass.admin.dto.UserInfoDTO;
import io.mosip.compass.admin.dto.UserInfoResponseDTO;
import io.mosip.compass.admin.entity.UserInfo;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.MappingTarget;
import org.mapstruct.Named;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import javax.imageio.ImageIO;
import java.awt.*;
import java.awt.image.BufferedImage;
import java.io.ByteArrayInputStream;
import java.io.ByteArrayOutputStream;
import java.io.IOException;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.Base64;
import java.util.List;

@Mapper(componentModel = "spring")
public interface UserInfoMapper {

    Logger log = LoggerFactory.getLogger(UserInfoMapper.class);

    @Mapping(target = "userInfoId", ignore = true)
    @Mapping(target = "compassId", ignore = true) // This is auto-generated
    @Mapping(target = "createdTimes", expression = "java(java.time.LocalDateTime.now())")
    @Mapping(target = "faceImageGrey", source = "faceImageColor", qualifiedByName = "convertColorBase64ToGreyBase64")
    UserInfo toEntity(UserInfoDTO dto);

    @Mapping(source = "createdTimes", target = "issuanceDate", qualifiedByName = "mapCreatedTimesToIssuedDate")
    UserInfoDTO toDto(UserInfo entity);

    @Mapping(target = "userInfoId", ignore = true)
    @Mapping(target = "compassId", ignore = true)
    @Mapping(target = "createdTimes", ignore = true)
    @Mapping(target = "updatedTimes", expression = "java(java.time.LocalDateTime.now())")
    @Mapping(target = "faceImageGrey", source = "faceImageColor", qualifiedByName = "convertColorBase64ToGreyBase64")
    void updateEntityFromDto(UserInfoDTO userInfoDTO, @MappingTarget UserInfo userInfo);

    @Mapping(source = "userInfoId", target = "userInfoId")
    @Mapping(source = "nationalUid", target = "nationalUid")
    UserInfoResponseDTO toResponseDto(UserInfo entity);

    List<UserInfoDTO> toDtoList(List<UserInfo> entities);

    List<UserInfo> toEntityList(List<UserInfoDTO> dtos);

    @Named("convertColorBase64ToGreyBase64")
    default String convertColorBase64ToGreyBase64(String base64ColorImage) {
        if (base64ColorImage == null || base64ColorImage.isEmpty()) {
            throw new RuntimeException("Image is mandatory to proceed further");
        }

        try {
            if (!base64ColorImage.contains(":") || !base64ColorImage.contains(";") || !base64ColorImage.contains(",")) {
                throw new IllegalArgumentException("Invalid image format. Upload a proper image type.");
            }

            // Extract MIME type and format (e.g., image/jpeg => jpeg)
            String mimeType = base64ColorImage.substring(base64ColorImage.indexOf(":") + 1, base64ColorImage.indexOf(";"));
            String formatName = mimeType.substring(mimeType.indexOf("/") + 1); // e.g., jpeg, png

            // Get image data
            String base64Data = base64ColorImage.substring(base64ColorImage.indexOf(",") + 1);
            byte[] imageBytes = Base64.getDecoder().decode(base64Data);

            // Convert to grayscale
            ByteArrayInputStream bis = new ByteArrayInputStream(imageBytes);
            BufferedImage colorImage = ImageIO.read(bis);

            if (colorImage == null) {
                throw new RuntimeException("Failed to read the image. Ensure the image data is valid.");
            }

            BufferedImage grayImage = new BufferedImage(
                    colorImage.getWidth(),
                    colorImage.getHeight(),
                    BufferedImage.TYPE_BYTE_GRAY
            );

            Graphics g = grayImage.getGraphics();
            g.drawImage(colorImage, 0, 0, null);
            g.dispose();

            ByteArrayOutputStream baos = new ByteArrayOutputStream();
            ImageIO.write(grayImage, formatName, baos); // Use the extracted format
            byte[] greyBytes = baos.toByteArray();

            // Encode back to base64 with MIME
            return "data:" + mimeType + ";base64," + Base64.getEncoder().encodeToString(greyBytes);

        } catch (IllegalArgumentException e) {
            log.error("Invalid image format: {}", e.getMessage());
            throw new RuntimeException("Invalid image format. Please provide a valid image.");
        } catch (IOException e) {
            log.error("Image processing failed: {}", e.getMessage());
            throw new RuntimeException("Failed to process the image. Please try again.");
        } catch (Exception e) {
            log.error("Unexpected error during image conversion: {}", e.getMessage());
            throw new RuntimeException("An unexpected error occurred while processing the image.");
        }
    }

    @Named("mapCreatedTimesToIssuedDate")
    default LocalDate mapCreatedTimesToIssuedDate(LocalDateTime createdTimes) {
        return createdTimes != null ? createdTimes.toLocalDate() : null;
    }
}