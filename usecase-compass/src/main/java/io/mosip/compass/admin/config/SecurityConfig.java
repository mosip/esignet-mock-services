package io.mosip.compass.admin.config;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.core.convert.converter.Converter;
import org.springframework.security.authentication.AbstractAuthenticationToken;
import org.springframework.security.config.annotation.method.configuration.EnableMethodSecurity;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.security.oauth2.server.resource.authentication.JwtAuthenticationConverter;
import org.springframework.security.web.SecurityFilterChain;

@Configuration
@EnableWebSecurity
@EnableMethodSecurity
public class SecurityConfig {

    @Value("${mosip.admin-server.authn.jwk-set-uri}")
    private String jwkSetUri;

    /**
     * Comma-separated list from application.properties.
     * Example: /actuator/health,/actuator/info
     * <p>
     * A fallback empty value ({@code :}) avoids a missing-property error.
     */
    @Value("${mosip.usecase-compass.security.ignore-auth-urls:}")
    private String[] ignoreAuthUrls;

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {

        http
                .csrf(csrf -> csrf.disable())

                // -----------------------------------------------------------
                // Authorisation rules
                // -----------------------------------------------------------
                .authorizeHttpRequests(auth -> auth
                        // URLs from property file
                        .requestMatchers(ignoreAuthUrls).permitAll()
                        // Swagger & OpenAPI endpoints
                        .requestMatchers(
                                "/swagger-ui/**",
                                "/swagger-ui.html",
                                "/v3/api-docs/**",
                                "/v3/api-docs"
                        ).permitAll()
                        // Everything else
                        .anyRequest().authenticated()
                )

                // -----------------------------------------------------------
                // OAuth2 Resource-Server (JWT)
                // -----------------------------------------------------------
                .oauth2ResourceServer(oauth2 -> oauth2
                        .jwt(jwt -> jwt
                                .jwkSetUri(jwkSetUri)
                                .jwtAuthenticationConverter(jwtAuthenticationConverter())
                        )
                )

                // -----------------------------------------------------------
                // Stateless session management
                // -----------------------------------------------------------
                .sessionManagement(session ->
                        session.sessionCreationPolicy(SessionCreationPolicy.STATELESS)
                );

        return http.build();
    }

    /** Converts Keycloak realm roles to Spring Security authorities. */
    private Converter<Jwt, AbstractAuthenticationToken> jwtAuthenticationConverter() {
        JwtAuthenticationConverter converter = new JwtAuthenticationConverter();
        converter.setJwtGrantedAuthoritiesConverter(new KeycloakRealmRoleConverter());
        return converter;
    }
}
