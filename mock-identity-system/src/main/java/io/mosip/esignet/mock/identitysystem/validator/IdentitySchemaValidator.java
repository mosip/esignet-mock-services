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

@Component
@Slf4j
public class IdentitySchemaValidator implements ConstraintValidator<IdentitySchema, Object> {

    @Value("${mosip.mock.ida.identity.create.schema.url}")
    private String createSchemaUrl;

    @Value("#{${mosip.mock.ida.identity.update.exempted.field}}")
    private Set<String> exemptedField;
    private boolean isCreate;

    private volatile JsonSchema cachedSchema;

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
        Set<ValidationMessage> errors = getCachedSchema().validate(identityJsonNode);
        boolean isValid=true;
        if(!isCreate){
            for(ValidationMessage validationMessage: errors){
                String field=validationMessage.
                        getInstanceLocation().getName(0);
                // Ignore validation errors with code 1029 (null value) for exempted fields when validating updateIdentity
                if(!validationMessage.getCode().equals("1029") || !exemptedField.contains(field)){
                    isValid=false;
                    break;
                }
            }
        }
        if (!isValid) {
            log.error("Validation failed for IdentityData: {}", errors);
            return false;
        }
        return true;
    }

    private JsonSchema getCachedSchema()  {
        if(cachedSchema !=null ) return cachedSchema;
        synchronized (this) {
            if (cachedSchema == null) {
                InputStream schemaResponse = getResource(createSchemaUrl);
                JsonSchemaFactory jsonSchemaFactory = JsonSchemaFactory.getInstance(SpecVersion.VersionFlag.V202012);
                cachedSchema = jsonSchemaFactory.getSchema(schemaResponse);
            }
        }
        return cachedSchema;
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
