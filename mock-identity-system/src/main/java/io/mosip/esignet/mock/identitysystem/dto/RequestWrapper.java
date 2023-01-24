package io.mosip.esignet.mock.identitysystem.dto;

import static io.mosip.esignet.mock.identitysystem.util.ErrorConstants.INVALID_REQUEST;

import javax.validation.Valid;
import javax.validation.constraints.NotNull;

import io.mosip.esignet.mock.identitysystem.validator.RequestTime;
import lombok.Data;

@Data
public class RequestWrapper<T> {

    @RequestTime
    private String requestTime;

    @NotNull(message = INVALID_REQUEST)
    @Valid
    private T request;
}
