# AGENTS.md — mock-identity-system

Parent guide: [../AGENTS.md](../AGENTS.md)

## Purpose

Mock implementation of the MOSIP IDA (Identity Authentication) system, used to demonstrate and
test eSignet integration without a real identity backend. Supports `create-identity`,
`get-identity`, `kyc-auth`, `kyc-exchange`, and adding OIDC Identity-Assurance verified-claims
metadata for a user's claims. Supported authentication factors: PIN, OTP, BIO, PWD, WLA.

This is a mock service — it stores and returns synthetic identity data only. Never point a
production system at this module.

## Layout

- `src/main/java/io/mosip/esignet/mock/identitysystem/` — Spring Boot application code
  (`controller/`, `service/`, `service/impl/`, `repository/`, `entity/`, `dto/`, `config/`,
  `advice/`, `util/`, `exception/`).
- `src/main/resources/` — `application-default.properties`, `application-local.properties`,
  `bootstrap.properties`, `messages.properties`, and JSON schemas
  (`mock-identity-schema.json`, `mock-identity-signup-schema.json`,
  `mock-identity-ui-spec.json`, `mock-identity-signup-ui-spec.json`).
- `src/test/java/...` — JUnit tests for controllers, services, and utilities.
- `src/test/resources/` — `application-test.properties`, `bootstrap.properties`, `data.sql`,
  `schema.sql` (H2 in-memory DB for tests), `mock-identity-test-schema.json`.
- `Dockerfile`, `configure_start.sh`, `softhsm-application.conf` — container/runtime setup.

## How to run

Local setup (from the repo root, matching `docker-compose/README.md`):

```shell
docker compose --file docker-compose/dependent-docker-compose.yml up
mvn clean install -Dgpg.skip=true -DskipTests=true
```

Then start `MockIdentitySystemApplication` from your IDE, or run the packaged jar. Swagger UI
is served at:

```text
http://localhost:8082/v1/mock-identity-system/swagger-ui.html
```

Add a test identity:

```shell
curl -X 'POST' \
  'http://localhost:8082/v1/mock-identity-system/identity' \
  -H 'accept: application/json' \
  -H 'Content-Type: application/json' \
  -d '{"requestTime": "2023-07-24T08:53:05.142Z", "request": {"individualId":"8267411571","pin":"111111"}}'
```

Run tests only (from repo root):

```shell
mvn -pl mock-identity-system test
```

## Configuration

- `src/main/resources/application-local.properties` points at a local Postgres
  (`localhost:5455`, db `mosip_mockidentitysystem`) and local Redis (`spring.cache.type=simple`
  is explicitly a non-production cache mode). The Postgres password (`postgres`) and HSM
  keystore password (`localtest`) in this file are throwaway values for a local dev database
  only — never reuse them for a real deployment.
- Schema validation is driven by `mosip.mock.ida.identity.schema.url` (defaults to
  `classpath:/mock-identity-schema.json`). Create operations validate all fields against the
  schema; update operations validate mandatory fields, and validate non-mandatory fields only
  if present (see `mosip.mock.ida.update-identity.non-mandatory.fields`).
- Database DDL/DML live outside this module, under `../db_scripts/mosip_mockidentitysystem/`.

## Agent rules

### Do

1. Run `mvn -pl mock-identity-system test` after any change under `src/main/java` or
   `src/main/resources`.
2. Keep `mock-identity-schema.json` (and the corresponding test schema in
   `src/test/resources/mock-identity-test-schema.json`) in sync when adding/removing identity
   fields.
3. Add new JUnit tests alongside existing ones under
   `src/test/java/io/mosip/esignet/mock/identitysystem/...`, mirroring the package of the code
   under test.

### Do not

1. Do not commit real Postgres/HSM/Redis credentials into `application-*.properties`.
2. Do not add production-facing identity-verification logic here — this module exists purely
   to mock IDA responses for eSignet integration testing.
