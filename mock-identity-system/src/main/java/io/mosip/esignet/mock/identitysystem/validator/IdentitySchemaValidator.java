package io.mosip.esignet.mock.identitysystem.validator;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.networknt.schema.*;
import io.mosip.esignet.mock.identitysystem.dto.IdentityData;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.core.io.Resource;
import org.springframework.core.io.ResourceLoader;
import org.springframework.stereotype.Component;

import jakarta.annotation.PostConstruct;
import jakarta.validation.ConstraintValidator;
import jakarta.validation.ConstraintValidatorContext;
import java.io.IOException;
import java.io.InputStream;
import java.util.Set;
import java.util.stream.Collectors;

@Component
@Slf4j
public class IdentitySchemaValidator implements ConstraintValidator<IdentitySchema, Object> {

    @Value("${mosip.mock.ida.identity.schema.url}")
    private String identitySchemaUrl;

    private String action;

    private JsonSchema schema;

    @Autowired
    ObjectMapper objectMapper;

    @Autowired
    ResourceLoader resourceLoader;


    @Override
    public void initialize(IdentitySchema constraintAnnotation) {
        this.action = constraintAnnotation.action();
    }

    @PostConstruct
    public void initSchema() {
        InputStream schemaResponse = getResource(identitySchemaUrl);
        JsonSchemaFactory jsonSchemaFactory = JsonSchemaFactory.getInstance(SpecVersion.VersionFlag.V202012);
        schema = jsonSchemaFactory.getSchema(schemaResponse);
    }

    @Override
    public boolean isValid(Object object, ConstraintValidatorContext context) {

        if (!(object instanceof IdentityData)) {
            return false;
        }
        IdentityData identityData=(IdentityData) object;
        JsonNode identityJsonNode = objectMapper.valueToTree(identityData);
        Set<ValidationMessage> validationErrors = validateIdentityData(identityJsonNode);

        // Handle validation errors
        if (!validationErrors.isEmpty()) {
            addValidationErrorCode(validationErrors,context);
            return false;
        }
        return true;
    }

    private Set<ValidationMessage> validateIdentityData(JsonNode identityJsonNode) {
        Set<ValidationMessage> errors = schema.validate(identityJsonNode);
        // If not a create operation, filter out specific errors
        if (action.equals("UPDATE")) {
            // Ignore validation errors with code 1028 (null value) and for exempted fields when validating updateIdentity
            errors = errors.stream()
                    .filter(error -> !error.getCode().equals("1028"))
                    .collect(Collectors.toSet());
        }
        return errors;
    }

    private void addValidationErrorCode(Set<ValidationMessage> errors, ConstraintValidatorContext context) {
        context.disableDefaultConstraintViolation();
        errors.forEach(error->
                context.buildConstraintViolationWithTemplate(getErrorCodeFromValidationMessage(error))
                .addConstraintViolation());
    }

    private String getErrorCodeFromValidationMessage(ValidationMessage error) {
        String fieldName = error.getInstanceLocation().getNameCount() > 0 ? error.getInstanceLocation().getName(0) :
                error.getProperty();
        return fieldName != null ? "invalid_"+fieldName.toLowerCase() : "unknown_field";
    }

    private InputStream getResource(String url) {
        try{
            Resource resource = resourceLoader.getResource(url);
            return resource.getInputStream();
        }catch (IOException e){
            log.error("Failed to parse data: {}", url, e);
        }
        throw new RuntimeException("invalid_configuration");
    }
}
