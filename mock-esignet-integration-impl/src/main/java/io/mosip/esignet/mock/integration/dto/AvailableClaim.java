package io.mosip.esignet.mock.integration.dto;

import lombok.Data;

import java.util.List;

@Data
public class AvailableClaim {

    String claim;
    List<VerificationDetail> verificationDetails;
}
