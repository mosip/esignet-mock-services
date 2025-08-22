package io.mosip.compass.admin.config;// File: RoleEvaluator.java

import lombok.RequiredArgsConstructor;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Component;

import java.util.List;

@Component("roleEvaluator")
@RequiredArgsConstructor
public class RoleEvaluator {

    private static final Logger log = LoggerFactory.getLogger(RoleEvaluator.class);
    private final RoleProperties roleProperties;

    public boolean hasAnyRequiredRole() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        if (authentication == null || !authentication.isAuthenticated()) return false;

        List<String> cleanedRoles = roleProperties.getRequiredRoles().stream()
                .filter(r -> r != null && !r.trim().isEmpty())
                .toList();

        if (cleanedRoles.isEmpty()) {
            return true; // Allow access when cleaned role list is empty
        }


        return authentication.getAuthorities().stream()
                .anyMatch(auth -> roleProperties.getRequiredRoles().stream()
                        .anyMatch(role -> auth.getAuthority().equalsIgnoreCase("ROLE_" + role.trim())));
    }
}