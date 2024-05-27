package io.mosip.esignet.mock.integration.dto;

import lombok.Data;

import java.util.List;

@Data
public class KycAuthResponseDtoV2 extends KycAuthResponseDto{

    private List<AvailableClaim> availableClaims;
}
