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

    @Column(name = "pp_mrz_td3")
    private String ppMrzTd3;

    @Column(name = "pp_number")
    private String ppNumber;

    @Column(name = "vc_num")
    private Long vcNum;

    @Column(name = "address")
    private String address;

    @Column(name = "birth_country")
    private String birthCountry;

    @Column(name = "card_access_number")
    private Long cardAccessNumber;

    @Column(name = "date_of_birth")
    @JsonFormat(pattern = "yyyy-MM-dd")
    private LocalDate dateOfBirth;

    @Column(name = "email")
    private String email;

    @Column(name = "eye_color")
    private String eyeColor;

    @Column(name = "face_image_color")
    @Basic(fetch = FetchType.LAZY)
    private byte[] faceImageColor;

    @Column(name = "face_image_grey")
    @Basic(fetch = FetchType.LAZY)
    private byte[] faceImageGrey;

    @Column(name = "first_name_primary")
    private String firstNamePrimary;

    @Column(name = "first_name_primary_latin")
    private String firstNamePrimaryLatin;

    @Column(name = "gender")
    private String gender;

    @Column(name = "height")
    private Integer height;

    @Column(name = "last_name_secondary")
    private String lastNameSecondary;

    @Column(name = "last_name_secondary_latin")
    private String lastNameSecondaryLatin;

    @Column(name = "mobile_number")
    private String mobileNumber;

    @Column(name = "national_uid", nullable = false, unique = true)
    private String nationalUid;

    @Column(name = "nationality")
    private String nationality;

    @Column(name = "cr_dtimes")
    private LocalDateTime createdTimes;

    @Column(name = "upd_dtimes")
    private LocalDateTime updatedTimes;

    @PrePersist
    public void generateId() {
        if (this.userInfoId == null) {
            this.userInfoId = UUID.randomUUID();
        }

        if (this.vcNum == null) {
            Random random = new Random();
            // Generate a number between 1000000000 (inclusive) and 9999999999 (inclusive)
            this.vcNum = 1000000000L + random.nextLong(9999999999L);
        }
    }
}