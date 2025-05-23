package io.mosip.esignet.mock.identitysystem.entity;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import javax.persistence.*;
import java.time.LocalDateTime;

@Data
@Entity
@Table(name = "rp_data")
@NoArgsConstructor
@AllArgsConstructor
public class RelyingPartyData {

    @Id
    @Column(name = "rp_id")
    private String rpId;

    @Column(name = "oidc_client_id")
    private String oidcClientId;

    @Column(name = "encryption_key")
    private String encryptionKey;

    @Column(name = "status")
    private String status;

    @Column(name = "cr_dtimes")
    private LocalDateTime createdtimes;
}