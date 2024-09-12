## Overview

This is the docker-compose setup to run mock identity system. This is not for production use.

## What is in the docker-compose setup folder?

1. "config" folder holds the mock-identity system properties file.
2. "dependent-docker-compose.yml" file has all the dependent services to run mock-identity-system.
3. "init.sql" comprises DDL and DMLs required by mock-identity-system.

## How to run this setup?

1. Start the dependent-docker-compose.yml file

2. Build and start the mock-identity-system service.

3. Access the service swagger with this URL - http://localhost:8082/v1/mock-identity-system/swagger-ui.html

