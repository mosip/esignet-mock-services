package io.mosip.compass.admin.dto;

import com.fasterxml.jackson.annotation.JsonFormat;
import jakarta.validation.constraints.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class UserInfoDTO {
    private String ppMrzTd3;
    private String ppNumber;

    @Size(max = 250, message = "Address must be less than 250 characters")
    private String address;

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

    @Size(min = 0, max = 20, message = "National UID must be between max 30 characters")
    private String eyeColor;

    @NotNull(message = "Face image color is required")
    private String faceImageColor;

    @NotBlank(message = "First name is required")
    @Size(min = 1, max = 100, message = "First name must be between 1 and 100 characters")
    private String firstNamePrimary;

    @Size(min = 0, max = 80, message = "First name latin must be between 1 and 100 characters")
    private String firstNamePrimaryLatin;

    @NotBlank(message = "Gender is required")
    private String gender;

    private Integer height;

    @NotBlank(message = "Last name is required")
    @Size(min = 1, max = 100, message = "Last name must be between 1 and 100 characters")
    private String lastNameSecondary;

    @Size(min = 0, max = 80, message = "Last name latin must be between 1 and 100 characters")
    private String lastNameSecondaryLatin;

    @Pattern(regexp = "^\\+?[0-9]{10,15}$", message = "Mobile number should be valid")
    private String mobileNumber;

    @NotBlank(message = "National UID is required")
    @Size(min = 1, max = 30, message = "National UID must be between max 30 characters")
    private String nationalUid;

    @NotBlank(message = "Nationality is required")
    private String nationality;
}