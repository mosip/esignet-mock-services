package io.mosip.esignet.mock.identitysystem.dto;


import lombok.Data;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;

@Data
public class KycExchangeRequestDtoV2{

    private LocalDateTime requestDateTime;
    private String transactionId;
    private String kycToken;
    private String individualId;
    private Map<String, Object> acceptedClaims;
    private List<String> claimLocales;
}
