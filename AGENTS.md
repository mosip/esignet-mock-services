# AGENTS.md

## Repository Overview

`esignet-mock-services` provides **mock, non-production implementations** that stand in for
real MOSIP eSignet dependencies during development, demos, and testing:

- A mock identity system that mimics the MOSIP IDA (Identity Authentication) system.
- A mock relying-party backend and two mock relying-party UIs that demonstrate OIDC login
  against eSignet.
- A partner-onboarder job that registers the mock relying party as an OIDC client with MOSIP.

**This is dev/test-only tooling.** None of the services in this repository perform real
identity verification or issue real credentials — they return canned/synthetic identity data
and use test keys. They must never be pointed at, or treated as, a production identity or
credential-issuing system.

This repo is a small tree of independently-buildable modules rather than one monolithic
service. Each module has its own build tool, run instructions, and README. Use this root file
to find your way to the module that matters for your change; use the module guide for the
actual commands.

| Module | What it is | Guide |
|---|---|---|
| `mock-identity-system` | Java/Spring Boot mock of the MOSIP IDA system (Maven module, built by the root `pom.xml`) | [mock-identity-system/AGENTS.md](mock-identity-system/AGENTS.md) |
| `mock-relying-party-service` | Node.js/Express backend for the mock relying-party portal (OIDC/OAuth client, DPoP, PAR) | [mock-relying-party-service/AGENTS.md](mock-relying-party-service/AGENTS.md) |
| `mock-relying-party-ui` | React UI for the generic mock relying-party portal | [mock-relying-party-ui/AGENTS.md](mock-relying-party-ui/AGENTS.md) |
| `mock-relying-party-ui-esim` | React UI for the eSIM-branded mock relying-party portal | [mock-relying-party-ui-esim/AGENTS.md](mock-relying-party-ui-esim/AGENTS.md) |
| `partner-onboarder` | Shell/Helm job that onboards the mock relying party as an OIDC partner | [partner-onboarder/AGENTS.md](partner-onboarder/AGENTS.md) |

Non-module directories:

- `db_scripts/` — PostgreSQL DDL/DML for `mosip_mockidentitysystem`. See `db_scripts/README.md`.
  Deploy locally with `db_scripts/mosip_mockidentitysystem/deploy.sh`.
- `db_upgrade_script/` — versioned DB upgrade scripts.
- `docker-compose/` — Compose files to run the mock stack locally (see `docker-compose/README.md`).
- `deploy/` and `helm/` — Kubernetes/Helm install scripts and charts for cluster deployment.
- `docs/` — supporting images.

## Technology Stack

- **mock-identity-system**: Java 21, Spring Boot 3.4.11 (Spring Web, Spring Data JPA, Spring
  Data Redis, Spring Cloud Config), Maven, PostgreSQL, springdoc-openapi, Lombok, JSON Schema
  validation (`com.networknt:json-schema-validator`).
- **mock-relying-party-service**: Node.js, Express, `jose` (JWT/JWK), `axios`, `joi`,
  `node-cache`, `express-rate-limit`.
- **mock-relying-party-ui** / **mock-relying-party-ui-esim**: React 18 (Create React App),
  `react-router-dom`, `i18next`, Tailwind CSS.
- **partner-onboarder**: shell scripts + Helm, driven by `values.yaml`.
- **CI**: GitHub Actions, using shared reusable workflows from `mosip/kattu`
  (`.github/workflows/push-trigger.yml`, `db-test.yml`, `chart-lint-publish.yml`,
  `codeql.yml`, `release-changes.yml`, `tag.yml`).

## Build & Test Commands

Root Maven build (builds `mock-identity-system`, the only module declared in the root
`pom.xml`):

```shell
mvn clean install -Dgpg.skip=true -DskipTests=true
```

Run the full test suite for `mock-identity-system` (includes JaCoCo coverage, configured in
the parent `pom.xml`):

```shell
mvn -pl mock-identity-system test
```

Node-based modules (`mock-relying-party-service`, `mock-relying-party-ui`,
`mock-relying-party-ui-esim`) each build independently with `npm install` / `npm start` /
`npm run build` from inside their own directory. See the per-module guides for exact commands
and required environment variables — commands differ per module and none of them share a
single root build script.

Each service/UI also has a `Dockerfile`; CI (`push-trigger.yml`) builds and pushes images for
`mock-identity-system`, `mock-relying-party-service`, `mock-relying-party-ui`, and
`mock-relying-party-ui-esim` via the shared `mosip/kattu` docker-build workflow.

## Configuration

- `mock-identity-system` configuration lives in
  `mock-identity-system/src/main/resources/application-default.properties` and
  `application-local.properties`, plus `bootstrap.properties` for Spring Cloud Config. The
  local profile ships a non-secret local Postgres password (`postgres`) and a local HSM
  keystore password (`localtest`) intended only for a throwaway local Postgres/HSM instance —
  do not reuse these values, or any value copied from this repo, for a real deployment.
- `mock-relying-party-service` is configured entirely through environment variables (no
  committed secrets file) — see `mock-relying-party-service/README.md` for the full list,
  including `CLIENT_PRIVATE_KEY` and `JWE_USERINFO_PRIVATE_KEY`, which must be supplied by
  whoever runs the service and never committed.
- `mock-relying-party-ui` and `mock-relying-party-ui-esim` are configured via `.env`,
  `.env.development`, and (at container runtime) `public/env-config.js`. The tracked `.env`
  files only set non-sensitive UI defaults (e.g. `REACT_APP_TOAST_TIMEOUT_IN_SEC`); real
  per-environment values (client IDs, redirect URIs, service URLs) are supplied via
  `env-config.js` or Docker `-e` flags at deploy time, not committed to the repo.
- `partner-onboarder` is configured through `partner-onboarder/values.yaml` for Helm-based
  runs.

## Project Structure Notes

- The root `pom.xml` is a Maven **parent/aggregator** POM but currently declares only one
  `<module>`, `mock-identity-system`. The Node/React modules are siblings on disk but are not
  part of the Maven reactor — they are built and deployed independently (own `Dockerfile`, own
  CI matrix entry).
- `mock-relying-party-ui` and `mock-relying-party-ui-esim` are two separate, independently
  versioned React apps with overlapping purpose (generic vs. eSIM-branded relying-party demo
  UI) — check which one a change actually targets before editing, since their `package.json`
  and dependency sets differ.
- CI workflow triggers are scoped by path where relevant: `db-test.yml` only runs on changes
  under `db_scripts/**`; `chart-lint-publish.yml` only runs on changes under `helm/**`.
  `push-trigger.yml` (the Maven/Docker build) runs on pushes/PRs regardless of path.
  `codeql.yml` runs on pushes/PRs to `develop` and a weekly schedule.

## Development Workflow

1. Fork and clone the repository; add `upstream` pointing at `mosip/esignet-mock-services`.
2. Branch from `upstream/develop` — `develop` is the integration branch this repo builds and
   opens PRs against.
3. Make changes inside the relevant module directory only; each module builds and runs
   independently (see the module guide for exact local run steps).
4. To exercise the mock identity system and relying-party portal together locally, use the
   Compose files in `docker-compose/` as described in `docker-compose/README.md`.
5. Run the relevant module's documented test/build commands before opening a PR. For
   `mock-identity-system`, run `mvn -pl mock-identity-system test`. For each Node/React
   module, follow its own `AGENTS.md`/`README.md` — the available npm scripts differ
   per module (e.g. `mock-relying-party-service` has no test script; `npm test` there
   just exits with an error placeholder).

## Pull Request Guidelines

- Target the `develop` branch.
- Keep changes scoped to the module(s) actually touched; avoid unrelated changes across
  modules in the same PR.
- CI (`push-trigger.yml`) builds the Maven module and all four Docker images
  (`mock-identity-system`, `mock-relying-party-service`, `mock-relying-party-ui`,
  `mock-relying-party-ui-esim`) on every PR — make sure each touched module still builds.
- If you touch `db_scripts/**`, the `db-test.yml` workflow will run against PostgreSQL —
  verify DDL/DML changes locally with `db_scripts/mosip_mockidentitysystem/deploy.sh` first.
- If you touch `helm/**`, the `chart-lint-publish.yml` workflow will lint the charts.

## Repository-Specific Considerations

- Everything here is **mock/test tooling only** — the README states this explicitly
  ("Only for non-production use", "This is not for production use"). Do not add code paths,
  defaults, or documentation that imply this repo could serve as a real identity provider,
  credential issuer, or relying party in production.
- The mock identity system supports OIDC Identity Assurance verified-claims metadata
  (`trust_framework`, `assurance_level`, `verification_process`, `time`, `evidence`) — see
  `mock-identity-system/README.md` for the semantics before changing identity-schema
  validation logic (`mock-identity-schema.json`).
- The relying-party service and UI implement FAPI 2.0-adjacent security features (DPoP per
  RFC 9449, PAR per RFC 9126, PKCE). Keep the service and UI README env-variable tables in
  sync with actual code if you add/rename an environment variable.
- When deploying multiple eSignet plugins into the same Kubernetes cluster, several Helm
  install scripts require manual per-namespace overrides (service names, namespace) — see the
  root `README.md` section "When deploying multiple esignet plugins in the same cluster."

## Agent rules

### Do

1. Verify which module(s) a change actually touches (`mock-identity-system`,
   `mock-relying-party-service`, `mock-relying-party-ui`, `mock-relying-party-ui-esim`,
   `partner-onboarder`, or infra dirs) and read that module's own `README.md`/`AGENTS.md`
   before editing.
2. Build and test the specific module you changed before proposing a PR (Maven for
   `mock-identity-system`, `npm` for the Node/React modules).
3. Keep any new configuration documented as environment variables or properties files
   consistent with the patterns already used in that module (no new secrets committed to the
   repo).
4. Preserve the "mock/non-production only" framing in any documentation you write or edit.

### Do not

1. Do not commit real credentials, private keys, or production URLs into `.env`,
   `application-*.properties`, `values.yaml`, or any other config file — these services are
   configured with secrets at deploy time (Docker `-e`, Helm values, environment variables),
   not via committed files.
2. Do not assume the root `pom.xml` builds the Node/React modules — it only builds
   `mock-identity-system`. Do not add Maven-only build instructions and claim they cover the
   whole repo.
3. Do not treat `mock-relying-party-ui` and `mock-relying-party-ui-esim` as the same app —
   verify which one you are changing.
4. Do not describe this repository, in code or docs, as suitable for real identity
   verification or credential issuance.
