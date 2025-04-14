// File: RoleProperties.java
package io.mosip.compass.admin.config;

import lombok.Getter;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Configuration;

import java.util.List;

@Configuration
@Getter
public class RoleProperties {

    @Value("#{'${mosip.admin-server.authn.required-roles}'.split(',')}")
    private List<String> requiredRoles;
}
