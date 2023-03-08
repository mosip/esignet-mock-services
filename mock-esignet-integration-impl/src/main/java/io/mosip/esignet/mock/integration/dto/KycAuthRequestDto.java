package io.mosip.esignet.mock.integration.dto;


import lombok.Data;

@Data
public class KycAuthRequestDto {

    private String transactionId;
    private String individualId;
    private String otp;
    private String pin;
    private String biometrics;
}
