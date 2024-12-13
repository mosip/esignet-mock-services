## Overview

This is the docker-compose setup to run mock identity system and mock relying party portal. This is not for production use.

## I am a developer, how to setup dependent services to run mock-identity-system?

1. Run `docker compose --file dependent-docker-compose.yml up` to start all the dependent services.
2. Go to command line for the project root directory and run `mvn clean install -Dgpg.skip=true -DskipTests=true`
3. Start the [MockIdentitySystemApplication.java](../mock-identity-system/src/main/java/io/mosip/esignet/mock/identitysystem/MockIdentitySystemApplication.java) from your IDE.
4. Access the service swagger with this URL - http://localhost:8082/v1/mock-identity-system/swagger-ui.html

## How to start the mock relying party UI?

1. Run `docker compose --file dependent-docker-compose.yml up` to start relying party portal.
2. Access relying party portal UI at http://localhost:3000
3. Use the credentials documented [here](https://docs.esignet.io/try-it-out/using-mock-data) to login and experience integration with eSignet in collab.mosip.net environment.

By default, mock relying party portal is connecting to eSignet (Identity Provider) hosted in collab.mosip.net environment.
Below environment variables should be changed to point to different environment:
* ESIGNET_UI_BASE_URL
* CLIENT_ID
* ESIGNET_SERVICE_URL
* ESIGNET_AUD_URL
* CLIENT_PRIVATE_KEY

Refer [README.md](../mock-relying-party-ui/README.md) for more details.


