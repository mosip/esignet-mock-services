package io.mosip.compass.admin.controller;

import io.mosip.compass.admin.config.RequiresAdminAccess;
import io.mosip.compass.admin.dto.UserInfoDTO;
import io.mosip.compass.admin.dto.UserInfoResponseDTO;
import io.mosip.compass.admin.service.UserInfoService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/user-info")
@RequiredArgsConstructor
public class UserInfoController {

    private final UserInfoService userInfoService;

    @Operation(
            summary = "Create a new user",
            security = @SecurityRequirement(name = "bearerAuth")
    )
    @RequiresAdminAccess
    @PostMapping
    public ResponseEntity<UserInfoResponseDTO> createUserInfo(@Valid @RequestBody UserInfoDTO userInfoDTO) {
        UserInfoResponseDTO userInfoResponseDTO = userInfoService.createUserInfo(userInfoDTO);
        return new ResponseEntity<>(userInfoResponseDTO, HttpStatus.CREATED);
    }

    @Operation(
            summary = "Get user by national UID",
            security = @SecurityRequirement(name = "bearerAuth")
    )
    @RequiresAdminAccess
    @GetMapping("/{nationalUid}")
    public ResponseEntity<UserInfoDTO> getUserInfoByNationalUid(@PathVariable String nationalUid) {
        UserInfoDTO userInfoDTO = userInfoService.getUserInfoByNationalUid(nationalUid);
        return new ResponseEntity<>(userInfoDTO, HttpStatus.OK);
    }

    @Operation(
            summary = "Delete user",
            security = @SecurityRequirement(name = "bearerAuth")
    )
    @RequiresAdminAccess
    @DeleteMapping("/{id}")
    public ResponseEntity<String> deleteUserInfo(@PathVariable UUID id) {
        String response = userInfoService.deleteUserInfo(id);
        return new ResponseEntity<>(response, HttpStatus.OK);
    }

    @Operation(
            summary = "Get All Users",
            security = @SecurityRequirement(name = "bearerAuth")
    )
    @RequiresAdminAccess
    @GetMapping
    public ResponseEntity<List<UserInfoDTO>> getAllUserInfo() {
        List<UserInfoDTO> userInfoDTOList = userInfoService.getAllUsers();
        return ResponseEntity.ok(userInfoDTOList);
    }

    @Operation(
            summary = "Delete Multiple Users",
            security = @SecurityRequirement(name = "bearerAuth")
    )
    @RequiresAdminAccess
    @DeleteMapping
    public ResponseEntity<String> deleteMultipleUsers(@RequestBody List<UUID> userInfoIds) {
        try {
            String response = userInfoService.deleteMultipleUsers(userInfoIds);
            return new ResponseEntity<>(response, HttpStatus.OK);
        } catch (Exception e) {
            return ResponseEntity.internalServerError()
                    .body("Failed to delete users: " + e.getMessage());
        }
    }
}