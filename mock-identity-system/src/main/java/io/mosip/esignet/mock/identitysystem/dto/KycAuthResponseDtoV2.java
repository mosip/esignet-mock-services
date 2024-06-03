package io.mosip.esignet.mock.identitysystem.dto;

import lombok.Data;

import java.util.List;

@Data
public class KycAuthResponseDtoV2 extends KycAuthResponseDto{

    private List<ClaimMetadata> ClaimMetadataList;
}
