package io.mosip.esignet.mock.identitysystem.validator;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.networknt.schema.JsonSchema;
import com.networknt.schema.JsonSchemaFactory;
import com.networknt.schema.SpecVersion;
import com.networknt.schema.ValidationMessage;
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

    @Value("${mosip.mock.ida.identity.update.schema.url}")
    private String updateSchemaUrl;
    private boolean isCreate;

    private volatile JsonSchema cachedCreateSchema;

    private volatile JsonSchema cachedUpdateSchema;

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
            context.disableDefaultConstraintViolation();
            context.buildConstraintViolationWithTemplate("Invalid request object")
                    .addPropertyNode("request")
                    .addConstraintViolation();
            return false;
        }
        IdentityData identityData=(IdentityData) requestObject;
        JsonNode identityJsonNode = objectMapper.valueToTree(identityData);
        Set<ValidationMessage> errors = isCreate
                ? getCachedCreateSchema().validate(identityJsonNode)
                : getCachedUpdateSchema().validate(identityJsonNode);

        if (!errors.isEmpty()) {
            log.error("Validation failed for claims: {}", errors);
            return false;
        }
        return true;
    }

    private JsonSchema getCachedCreateSchema()  {
        if(cachedCreateSchema !=null ) return cachedCreateSchema;
        synchronized (this) {
            if (cachedCreateSchema == null) {
                InputStream schemaResponse = getResource(createSchemaUrl);
                JsonSchemaFactory jsonSchemaFactory = JsonSchemaFactory.getInstance(SpecVersion.VersionFlag.V202012);
                cachedCreateSchema = jsonSchemaFactory.getSchema(schemaResponse);
            }
        }
        return cachedCreateSchema;
    }

    private JsonSchema getCachedUpdateSchema()  {
        if(cachedUpdateSchema !=null ) return cachedUpdateSchema;
        synchronized (this) {
            if (cachedUpdateSchema == null) {
                InputStream schemaResponse = getResource(updateSchemaUrl);
                JsonSchemaFactory jsonSchemaFactory = JsonSchemaFactory.getInstance(SpecVersion.VersionFlag.V202012);
                cachedUpdateSchema = jsonSchemaFactory.getSchema(schemaResponse);
            }
        }
        return cachedUpdateSchema;
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
