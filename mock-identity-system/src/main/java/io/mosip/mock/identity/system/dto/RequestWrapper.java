package io.mosip.mock.identity.system.dto;

import static io.mosip.mock.identity.system.util.ErrorConstants.INVALID_REQUEST;

import javax.validation.Valid;
import javax.validation.constraints.NotNull;

import io.mosip.mock.identity.system.validator.RequestTime;
import lombok.Data;

@Data
public class RequestWrapper<T> {

    @RequestTime
    private String requestTime;

    @NotNull(message = INVALID_REQUEST)
    @Valid
    private T request;
}
