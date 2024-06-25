package io.mosip.esignet.mock.integration.dto;


import lombok.Data;

import java.util.List;

@Data
public class KycAuthRequestDto {

    private String transactionId;
    private String individualId;
    private String otp;
    private String pin;
    private String biometrics;
    private String kbi;
    private List<String> tokens;
}
