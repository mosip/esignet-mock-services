package io.mosip.esignet.mock.integration.dto;

import lombok.Data;

import java.util.List;

@Data
public class Step {
    private String code;
    private int framesPerSecond;
    private int durationInSeconds;
    private int startupDelayInSeconds;
    private boolean retryOnTimeout;
    private List<String> retryOnError;
}
