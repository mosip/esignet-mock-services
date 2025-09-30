## Overview

This is the docker-compose setup to run mock identity system and mock relying party portal. This is not for production use.

## Overview

This is the docker compose setup to run esignet UI and esignet-service with mock identity system. This is not for production use.

## I am a developer, how to setup dependent services to run mock-identity-system?

1. Run `docker compose --file dependent-docker-compose.yml up` to start all the dependent services.
2. Go to command line for the project root directory and run `mvn clean install -Dgpg.skip=true -DskipTests=true`
3. Start the [MockIdentitySystemApplication.java](../mock-identity-system/src/main/java/io/mosip/esignet/mock/identitysystem/MockIdentitySystemApplication.java) from your IDE.
4. Access the service swagger with this URL - http://localhost:8082/v1/mock-identity-system/swagger-ui.html

## How to start the mock Relying party UI?

1. Run [mock-relying-party-portal-docker-compose.yml](mock-relying-party-portal-docker-compose.yml) to start relying party portal.
2. Access Relying party UI at http://localhost:3000

By default, mock Relying party portal is connecting to eSignet (Identity Provider) hosted in collab.mosip.net environment.
Below environment variables should be changed to point to different environment:
* ESIGNET_UI_BASE_URL
* CLIENT_ID
* ESIGNET_SERVICE_URL
* ESIGNET_AUD_URL
* CLIENT_PRIVATE_KEY

## How to start the mock Relying party UI with FAPI 2.0 enabled?

1. Run [mock-relying-party-portal-fapi2-docker-compose.yml](mock-relying-party-portal-fapi2-docker-compose.yml) to start the relying party portal with DPoP and PAR enabled.
2. Access the Relying party UI at http://localhost:3000

### Required Environment Variables

To enable FAPI 2.0 features, ensure the following environment variables are set in your compose file or deployment configuration:

**For mock-relying-party-service:**
- `ESIGNET_PAR_ENDPOINT` and `ESIGNET_PAR_AUD_URL` (PAR endpoint and audience)
- `CLIENT_PRIVATE_KEY` and `JWE_USERINFO_PRIVATE_KEY` (private keys for client and userinfo JWT)
- Other standard variables: `ESIGNET_SERVICE_URL`, `ESIGNET_AUD_URL`, `USERINFO_RESPONSE_TYPE`, `SCOPE_USER_PROFILE`, `REDIRECT_URI`, `ACRS`, `CLAIMS_USER_PROFILE`

**For mock-relying-party-ui:**
- `DPOP_CALLBACK_NAME` (`get_dpop_jkt`)
- `PAR_CALLBACK_NAME` (`get_requestUri`)
- `PAR_CALLBACK_TIMEOUT` (optional, e.g. `5000`)
- All standard UI variables: `ESIGNET_UI_BASE_URL`, `MOCK_RELYING_PARTY_SERVER_URL`, `REDIRECT_URI`, `CLIENT_ID`, `ACRS`, `CLAIMS_USER_PROFILE`, `CLAIMS_REGISTRATION`, etc.

### Example

Refer to [mock-relying-party-portal-fapi2-docker-compose.yml](mock-relying-party-portal-fapi2-docker-compose.yml) for a complete example with all required variables pre-configured.

---

**Note:**  
If you need to connect to a different environment, update the relevant URLs and credentials in your environment variables.

For more details on configuration, refer to [mock-relying-party-ui README.md](../mock-relying-party-ui/README.md) and [mock-relying-party-service README.md](../mock-relying-party-service/README.md).


