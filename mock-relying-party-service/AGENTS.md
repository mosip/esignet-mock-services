# AGENTS.md — mock-relying-party-service

Parent guide: [../AGENTS.md](../AGENTS.md)

## Purpose

Node.js/Express backend for the Mock Relying Party portal. Provides OAuth 2.0/OIDC integration
with eSignet, including DPoP (RFC 9449) and PAR (RFC 9126) support. This is a reference/demo
relying-party backend, not a production OIDC client implementation.

## Layout

- `app.js` — Express app entry point and route wiring.
- `esignetService.js` — calls out to the eSignet OIDC endpoints (token, PAR, userinfo).
- `cacheClient.js` — in-memory cache (`node-cache`) for DPoP key pairs, keyed by `clientId` +
  `state`, TTL 10 minutes (not configurable).
- `clientDetails.js`, `config.js`, `utils.js` — client/config helpers.
- `package.json` — declares `start` (`node app.js`) and `devstart` (`node app.js && nodemon .`)
  scripts. There is no test script (`npm test` currently just exits with an error placeholder).

## Endpoints

- `GET /dpopJKT?clientId=&state=` — generates a DPoP key pair, returns the JWK thumbprint.
- `GET /requestUri/:clientId` — retrieves the PAR request URI.
- `POST /fetchUserInfo` — exchanges an authorization code for a token and user info.

See `README.md` in this directory for full request/response shapes and error codes.

## How to run

```shell
npm install
export PORT=8888
export ESIGNET_SERVICE_URL='https://esignet.example-domain.test/v1/esignet'
export ESIGNET_AUD_URL='https://esignet.example-domain.test/v1/esignet/oauth/v2/token'
export CLIENT_PRIVATE_KEY='base64-encoded-private-key-jwk'
export REDIRECT_URI='https://your-domain.example.test/userprofile'
export SCOPE_USER_PROFILE='openid profile'
export ACRS='mosip:idp:acr:linked-wallet mosip:idp:acr:knowledge mosip:idp:acr:generated-code mosip:idp:acr:password'
npm start
```

For PAR-enabled setups, also set `ESIGNET_PAR_ENDPOINT` and `ESIGNET_PAR_AUD_URL`. The full
environment-variable list (including the optional FAPI 2.0 / PAR / DPoP variables) is
documented in this directory's `README.md`.

Docker:

```shell
docker build -t mock-relying-party-service:local .
docker run -it -d -p 8888:8888 \
  --env ESIGNET_SERVICE_URL='https://esignet.example-domain.test/v1/esignet' \
  --env ESIGNET_AUD_URL='https://esignet.example-domain.test/v1/esignet/oauth/v2/token' \
  --env CLIENT_PRIVATE_KEY='base64-encoded-private-key-jwk' \
  --env REDIRECT_URI='https://your-domain.example.test/userprofile' \
  --env SCOPE_USER_PROFILE='openid profile' \
  --env ACRS='mosip:idp:acr:linked-wallet mosip:idp:acr:knowledge mosip:idp:acr:generated-code mosip:idp:acr:password' \
  mock-relying-party-service:local
```

## Configuration

All configuration is via environment variables — there is no committed secrets file.
`CLIENT_PRIVATE_KEY` is required; `JWE_USERINFO_PRIVATE_KEY` is required only when
`USERINFO_RESPONSE_TYPE=jwe`. Never commit real values for these into the repo, `Dockerfile`,
or any compose file.

## Agent rules

### Do

1. Keep the environment-variable table in `README.md` in sync with any new/renamed variable
   read from `process.env` in `app.js`/`config.js`.
2. Preserve the 10-minute, non-configurable TTL behavior of the DPoP cache in `cacheClient.js`
   unless the change explicitly intends to make it configurable — and if so, update the
   `README.md` accordingly.

### Do not

1. Do not commit `CLIENT_PRIVATE_KEY`, `JWE_USERINFO_PRIVATE_KEY`, or any other secret value
   into source, `Dockerfile`, or example compose files.
2. Do not add a real test script without checking whether `package.json`'s current placeholder
   `test` script is intentionally deferred — coordinate the change with the module README.
