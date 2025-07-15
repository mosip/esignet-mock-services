package io.mosip.esignet.mock.identitysystem.dto;

import lombok.Data;
import java.util.List;

/**
 * Trust framework dto to handle single and multiple frameworks
 */
@Data
public class TrustFramework {
    private List<String> values;
    private String value;
}