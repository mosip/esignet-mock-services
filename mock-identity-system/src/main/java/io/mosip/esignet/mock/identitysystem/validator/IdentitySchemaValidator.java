package io.mosip.esignet.mock.identitysystem.validator;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.networknt.schema.*;
import io.mosip.esignet.mock.identitysystem.dto.IdentityData;
import io.mosip.esignet.mock.identitysystem.dto.RequestWrapper;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.core.io.Resource;
import org.springframework.core.io.ResourceLoader;
import org.springframework.stereotype.Component;

import javax.validation.ConstraintValidator;
import javax.validation.ConstraintValidatorContext;
import java.io.IOException;
import java.io.InputStream;
import java.util.Set;
import java.util.stream.Collectors;

@Component
@Slf4j
public class IdentitySchemaValidator implements ConstraintValidator<IdentitySchema, Object> {

    @Value("${mosip.mock.ida.identity.schema.url}")
    private String identitySchemaUrl;

    @Value("#{${mosip.mock.ida.update-identity.non-mandatory.fields}}")
    private Set<String> nonMandatoryFieldsOnUpdate;
    private boolean isCreate;

    private volatile JsonSchema schema;

    @Autowired
    ObjectMapper objectMapper;

    @Autowired
    ResourceLoader resourceLoader;


    @Override
    public void initialize(IdentitySchema constraintAnnotation) {
        this.isCreate = constraintAnnotation.isCreate();
    }

    @Override
    public boolean isValid(Object object, ConstraintValidatorContext context) {
        if (!(object instanceof RequestWrapper)) {
            return false;
        }
        RequestWrapper wrapper= (RequestWrapper) object;
        Object requestObject = wrapper.getRequest();
        if (!(requestObject instanceof IdentityData)) {
            return false;
        }
        IdentityData identityData=(IdentityData) requestObject;
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
        Set<ValidationMessage> errors = getSchema().validate(identityJsonNode);
        // If not a create operation, filter out specific errors
        if (!isCreate) {
            // Ignore validation errors with code 1029 (null value) and for exempted fields when validating updateIdentity
            errors = errors.stream()
                    .filter(error -> !error.getCode().equals("1029") ||
                            !nonMandatoryFieldsOnUpdate.contains(error.
                                    getInstanceLocation().getName(0)))
                    .collect(Collectors.toSet());
        }
        return errors;
    }

    private void addValidationErrorCode(Set<ValidationMessage> errors, ConstraintValidatorContext context) {
        context.disableDefaultConstraintViolation();
        errors.forEach(error->context.
                buildConstraintViolationWithTemplate("invalid_"+error.getInstanceLocation().getName(0).toLowerCase())
                .addConstraintViolation());
    }

    private JsonSchema getSchema()  {
        if(schema !=null ) return schema;
        synchronized (this) {
            if (schema == null) {
                InputStream schemaResponse = getResource(identitySchemaUrl);
                JsonSchemaFactory jsonSchemaFactory = JsonSchemaFactory.getInstance(SpecVersion.VersionFlag.V202012);
                schema = jsonSchemaFactory.getSchema(schemaResponse);
            }
        }
        return schema;
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
