package io.mosip.esignet.mock.identitysystem.dto;


import lombok.Data;

import java.time.LocalDateTime;
import java.util.List;

@Data
public class KycExchangeRequestDto {

    private LocalDateTime requestDateTime;
    private String transactionId;
    private String kycToken;
    private String individualId;
    private List<String> acceptedClaims;
    private List<String> claimLocales;
}
