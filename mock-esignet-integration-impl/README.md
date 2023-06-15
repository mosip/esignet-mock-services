# mock-esignet-integration-impl

## About

Implementation for all the interfaces defined in esignet-integration-api. This libaray is built as a wrapper for [mock-identity-system](mock-identity-system) service.

This library should be added as a runtime dependency to [esignet-service](https://github.com/mosip/esignet) for development purpose only.
Note: This is not production use implementation.

## Configurations required to added in esignet-default.properties

````
mosip.esignet.integration.scan-base-package=io.mosip.esignet.mock.integration
mosip.esignet.integration.authenticator=MockAuthenticationService
mosip.esignet.integration.key-binder=MockKeyBindingWrapperService
mosip.esignet.integration.audit-plugin=LoggerAuditService
mosip.esignet.integration.captcha-validator=GoogleRecaptchaValidatorService

mosip.esignet.send-otp.captcha-required=true
mosip.esignet.captcha-validator.url=https://www.google.com/recaptcha/api/siteverify
mosip.esignet.captcha-validator.secret=${esignet.captcha.secret.key}
mosip.esignet.captcha-validator.site-key=${esignet.captcha.site.key}

mosip.esignet.mock.authenticator.get-identity-url=https://${mosip.api.public.host}/v1/mock-identity-system/identity
mosip.esignet.mock.authenticator.kyc-auth-url=https://${mosip.api.public.host}/v1/mock-identity-system/kyc-auth
mosip.esignet.mock.authenticator.kyc-exchange-url=https://${mosip.api.public.host}/v1/mock-identity-system/kyc-exchange
mosip.esignet.mock.authenticator.send-otp=https://${mosip.api.public.host}/v1/mock-identity-system/send-otp
mosip.esignet.mock.supported.bind-auth-factor-types={'WLA'}
mosip.esignet.mock.authenticator.ida.otp-channels=email,phone
````

## Databases
Below two entries need to be added in mosip_esignet.key_policy_def table.

```
INSERT INTO KEY_POLICY_DEF(APP_ID,KEY_VALIDITY_DURATION,PRE_EXPIRE_DAYS,ACCESS_ALLOWED,IS_ACTIVE,CR_BY,CR_DTIMES) VALUES('MOCK_AUTHENTICATION_SERVICE', 1095, 50, 'NA', true, 'mosipadmin', now());

INSERT INTO KEY_POLICY_DEF(APP_ID,KEY_VALIDITY_DURATION,PRE_EXPIRE_DAYS,ACCESS_ALLOWED,IS_ACTIVE,CR_BY,CR_DTIMES) VALUES('MOCK_BINDING_SERVICE', 1095, 50, 'NA', true, 'mosipadmin', now());
```

## License
This project is licensed under the terms of [Mozilla Public License 2.0](LICENSE).
