package io.mosip.esignet.mock.identitysystem.dto;

import lombok.Data;

import java.util.List;

@Data
public class ClaimMetadata {

    String claim;
    List<VerificationDetail> verificationDetails;
}
