package io.mosip.esignet.mock.identitysystem.dto;

import java.util.ArrayList;
import java.util.List;

import lombok.Data;

@Data
public class ResponseWrapper<T> {

    private String responseTime;
    private T response;
    private List<Error> errors = new ArrayList<>();
}
