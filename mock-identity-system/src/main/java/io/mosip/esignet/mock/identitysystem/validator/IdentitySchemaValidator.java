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
import org.springframework.util.StringUtils;

import javax.validation.ConstraintValidator;
import javax.validation.ConstraintValidatorContext;
import java.io.IOException;
import java.io.InputStream;
import java.util.Set;

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
        context.disableDefaultConstraintViolation();
        if (!(object instanceof RequestWrapper)) {
            context.buildConstraintViolationWithTemplate("Invalid request type")
                    .addConstraintViolation();
            return false;
        }
        RequestWrapper wrapper= (RequestWrapper) object;
        Object requestObject = wrapper.getRequest();
        if (!(requestObject instanceof IdentityData)) {
            context.disableDefaultConstraintViolation();
            context.buildConstraintViolationWithTemplate("Invalid request object type").addConstraintViolation();
            return false;
        }
        IdentityData identityData=(IdentityData) requestObject;
        JsonNode identityJsonNode = objectMapper.valueToTree(identityData);
        Set<ValidationMessage> errors = getSchema().validate(identityJsonNode);
        boolean isValid=true;
        String errorName="";
        if(!isCreate){
            for(ValidationMessage validationMessage: errors){
                String field=validationMessage.
                        getInstanceLocation().getName(0);
                // Ignore validation errors with code 1029 (null value) for exempted fields when validating updateIdentity
                if(!validationMessage.getCode().equals("1029") || !nonMandatoryFieldsOnUpdate.contains(field)){
                    errorName="invalid_"+field.toLowerCase();
                    isValid=false;
                    break;
                }
            }
        }else if(!errors.isEmpty()){
            isValid=false;
        }
        if (!isValid) {
            context.disableDefaultConstraintViolation();
            if(StringUtils.isEmpty(errorName))
             errorName="invalid_"+errors.iterator().next().getInstanceLocation().getName(0).toLowerCase();
            context.buildConstraintViolationWithTemplate(errorName)
                    .addConstraintViolation();
            log.error("Validation failed for IdentityData: {}", errors);
            return false;
        }
        return true;
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
