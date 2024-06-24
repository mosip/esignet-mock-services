package io.mosip.esignet.mock.identitysystem.dto;

import io.mosip.esignet.mock.identitysystem.util.ErrorConstants;
import lombok.Data;

import javax.validation.constraints.NotBlank;
import java.time.LocalDateTime;


@Data
public class VerifiedClaimRequestDto {

    @NotBlank(message = ErrorConstants.INVALID_INDIVIDUAL_ID)
    private String individualId;

    @NotBlank(message = ErrorConstants.INVALID_CLAIM)
    private String claim;

    @NotBlank(message = ErrorConstants.INVALID_TRUST_FRAMEWORK)
    private String trustFramework;

    private LocalDateTime verifiedDateTime;

}
