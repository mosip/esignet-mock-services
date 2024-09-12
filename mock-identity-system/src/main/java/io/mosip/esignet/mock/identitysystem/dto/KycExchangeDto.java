package io.mosip.esignet.mock.identitysystem.dto;

import com.fasterxml.jackson.databind.JsonNode;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;

@NoArgsConstructor
@Data
public class KycExchangeDto {

    private LocalDateTime requestDateTime;
    private String transactionId;
    private String kycToken;
    private String individualId;
    private List<String> acceptedClaims;
    private List<String> claimLocales;
    private Map<String, JsonNode> acceptedClaimDetail;

    public KycExchangeDto(KycExchangeRequestDto kycExchangeRequestDto, Map<String, JsonNode> acceptedClaimDetail) {
        this.requestDateTime = kycExchangeRequestDto.getRequestDateTime();
        this.transactionId = kycExchangeRequestDto.getTransactionId();
        this.kycToken = kycExchangeRequestDto.getKycToken();
        this.individualId = kycExchangeRequestDto.getIndividualId();
        this.acceptedClaims = kycExchangeRequestDto.getAcceptedClaims();
        this.claimLocales = kycExchangeRequestDto.getClaimLocales();
        this.acceptedClaimDetail = acceptedClaimDetail;
    }
}
