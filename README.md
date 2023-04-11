# esignet-mock-services
Repository contains mock implementation of auth for e-signet

## Installing in k8s cluster using helm
### Pre-requisites
1. Set the kube config file of the Mosip cluster having dependent services is set correctly in PC.
1. Make sure [DB setup](db_scripts/README.md#install-in-existing-mosip-k8-cluster) is done.
1. Add / merge below mentioned properties files into existing config branch:
     * [mock-identity-system-default.properties](https://github.com/mosip/mosip-config/blob/v1.2.0.1-B3/mock-identity-system-default.properties)
     * [application-default.properties](https://github.com/mosip/mosip-config/blob/v1.2.0.1-B3/application-default.properties)
1. Add below properties in [esignet-default.properties](https://github.com/mosip/mosip-config/blob/v1.2.0.1-B3/esignet-default.properties) incase using MockAuth for esignet.
   ```
   mosip.esignet.integration.scan-base-package=io.mosip.authentication.esignet.integration,io.mosip.esignet.mock.integration
   mosip.esignet.integration.binding-validator=BindingValidatorServiceImpl
   mosip.esignet.integration.authenticator=MockAuthenticationService
   mosip.esignet.integration.key-binder=MockKeyBindingWrapperService
   mosip.esignet.integration.audit-plugin=LoggerAuditService
   mosip.esignet.integration.captcha-validator=GoogleRecaptchaValidatorService
   ```
1. Below are the dependent services required for compliance toolkit service:
   | Chart | Chart version |
   |---|---|
   |[Keycloak](https://github.com/mosip/mosip-infra/tree/v1.2.0.1-B3/deployment/v3/external/iam) | 7.1.18 |
   |[Keycloak-init](https://github.com/mosip/mosip-infra/tree/v1.2.0.1-B3/deployment/v3/external/iam) | 12.0.1-B3 |
   |[Postgres](https://github.com/mosip/mosip-infra/tree/v1.2.0.1-B3/deployment/v3/external/postgres) | 10.16.2 |
   |[Postgres Init](https://github.com/mosip/mosip-infra/tree/v1.2.0.1-B3/deployment/v3/external/postgres) | 12.0.1-B3 |
   |[Config-server](https://github.com/mosip/mosip-infra/tree/v1.2.0.1-B3/deployment/v3/mosip/config-server) | 12.0.1-B3 |
   |[Artifactory server](https://github.com/mosip/mosip-infra/tree/v1.2.0.1-B3/deployment/v3/mosip/artifactory) | 12.0.1-B3 |
   |[esignet-softhsm](https://github.com/mosip/esignet/blob/v1.0.0/helm/install-all.sh) | 12.0.1-B2 |
   |[redis](https://github.com/mosip/esignet/blob/v1.0.0/helm/redis)| 17.3.14 |
   |[esignet](https://github.com/mosip/esignet/tree/v1.0.0/helm/esignet) | 1.0.0 |
   |[oidc-ui](https://github.com/mosip/esignet/blob/v1.0.0/helm/oidc-ui) | 1.0.0 |

### Install
* Install `kubectl` and `helm` utilities.
* Run `install-all.sh` to deploy esignet services.
  ```
  cd helm
  ./install-all.sh
  ```

### Delete
* Run `delete-all.sh` to remove esignet services.
  ```
  cd helm
  ./delete-all.sh
  ```

### Restart
* Run `restart-all.sh` to restart esignet services.
  ```
  cd helm
  ./restart.sh
  ```

## Onboard esignet
* Run onboarder's [install.sh](https://github.com/mosip/mosip-infra/blob/v1.2.0.1-B3/deployment/v3/mosip/partner-onboarder) script to exchange jwk certificates.
