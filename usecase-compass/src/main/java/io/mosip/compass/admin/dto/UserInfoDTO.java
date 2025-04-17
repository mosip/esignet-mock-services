package io.mosip.compass.admin.dto;

import com.fasterxml.jackson.annotation.JsonFormat;
import jakarta.persistence.Column;
import jakarta.validation.constraints.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;
import java.util.UUID;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class UserInfoDTO {

    private UUID userInfoId;

    @NotBlank(message = "Birth country is required")
    private String birthCountry;

    @Digits(integer = 10, fraction = 0, message = "Card access number must be a 10-digit integer")
    @Min(value = 1000000000L, message = "Card access number must be 10 digits")
    @Max(value = 9999999999L, message = "Card access number must be 10 digits")
    private Long cardAccessNumber;

    @NotNull(message = "Date of birth is required")
    @Past(message = "Date of birth must be in the past")
    @JsonFormat(pattern = "yyyy-MM-dd")
    private LocalDate dateOfBirth;

    @Email(message = "Email should be valid")
    private String email;

    @NotNull(message = "Face image color is required")
    private String faceImageColor;

    @NotBlank(message = "First name is required")
    @Size(min = 1, max = 100, message = "First name must be between 1 and 100 characters")
    private String firstNamePrimary;

    @NotBlank(message = "Gender is required")
    private String gender;

    @NotBlank(message = "Last name is required")
    @Size(min = 1, max = 100, message = "Last name must be between 1 and 100 characters")
    private String lastNameSecondary;

    @NotBlank(message = "National UID is required")
    @Pattern(regexp = "^[a-zA-Z0-9]{10}$", message = "National UID must be alphanumeric and exactly 10 characters")
    private String nationalUid;

    @NotBlank(message = "Nationality is required")
    private String nationality;

    private String compassId;

    @JsonFormat(pattern = "yyyy-MM-dd")
    private LocalDate issuanceDate;
}