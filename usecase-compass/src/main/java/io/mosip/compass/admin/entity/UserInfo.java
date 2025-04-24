package io.mosip.compass.admin.entity;

import com.fasterxml.jackson.annotation.JsonFormat;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.Random;
import java.util.UUID;

@Entity
@Table(name = "user_info", uniqueConstraints = {
        @UniqueConstraint(name = "uk_user_info_national_uid", columnNames = "national_uid")
})
@Data
@NoArgsConstructor
@AllArgsConstructor
public class UserInfo {

    @Id
    @Column(name = "user_info_id", nullable = false, updatable = false)
    private UUID userInfoId;

    @Column(name = "compass_id")
    private String compassId;

    @Column(name = "birth_country")
    private String birthCountry;

    @Column(name = "card_access_number")
    private String cardAccessNumber;

    @Column(name = "date_of_birth")
    @JsonFormat(pattern = "yyyy-MM-dd")
    private LocalDate dateOfBirth;

    @Column(name = "email")
    private String email;

    @Column(name = "face_image_color", columnDefinition = "TEXT")
    @Basic(fetch = FetchType.LAZY)
    private String faceImageColor;

    @Column(name = "face_image_grey", columnDefinition = "TEXT")
    @Basic(fetch = FetchType.LAZY)
    private String faceImageGrey;

    @Column(name = "first_name_primary")
    private String firstNamePrimary;

    @Column(name = "gender")
    private String gender;

    @Column(name = "last_name_secondary")
    private String lastNameSecondary;

    @Column(name = "national_uid", nullable = false, unique = true)
    private String nationalUid;

    @Column(name = "nationality")
    private String nationality;

    @Column(name = "first_name_primary_latin")
    private String firstNamePrimaryLatin;

    @Column(name = "last_name_secondary_latin")
    private String lastNameSecondaryLatin;

    @Column(name = "cr_dtimes")
    private LocalDateTime createdTimes;

    @Column(name = "upd_dtimes")
    private LocalDateTime updatedTimes;

    @PrePersist
    public void generateId() {
        if (this.userInfoId == null) {
            this.userInfoId = UUID.randomUUID();
        }

        if (this.compassId == null) {
            Random random = new Random();
            int randomNineDigits = 100000000 + random.nextInt(900000000);
            this.compassId = "VC" + randomNineDigits;
        }
    }
}