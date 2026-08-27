# AGENTS.md — mock-relying-party-ui

Parent guide: [../AGENTS.md](../AGENTS.md)

## Purpose

React (Create React App) reference implementation of a relying party's portal, demonstrating
OIDC-based login against MOSIP eSignet. Two pages: a Home page with "Sign in with MOSIP", and
a User Profile page shown after successful authentication.

This is a demo/reference UI, not a production relying-party frontend — do not present it as
one.

## Layout

- `src/` — React application source.
- `public/` — static assets, including `env-config.js`, which holds runtime-configurable
  values consumed at container start (as opposed to build-time `.env` values).
- `.env`, `.env.development` — build-time defaults (only non-sensitive values are tracked,
  e.g. `REACT_APP_TOAST_TIMEOUT_IN_SEC`).
- `nginx/` — nginx config used by the `Dockerfile` to serve the built app and proxy to the
  mock relying-party backend.
- `package.json` — CRA scripts: `start`, `build`, `test`, `eject`.

## How to run

```shell
npm install
npm start
```

The app runs on port 5000 by default. Before running, update
`mock-relying-party-ui/public/env-config.js` with the required values (see README table below
for the full variable list): `ESIGNET_UI_BASE_URL`, `MOCK_RELYING_PARTY_SERVER_URL`,
`AUTHORIZE_ENDPOINT`, `REDIRECT_URI`, `CLIENT_ID`, `ACRS`, `SCOPE_USER_PROFILE`, `GRANT_TYPE`,
and the optional `MAX_AGE`, `DISPLAY`, `PROMPT`, `PAR_CALLBACK_NAME`, `PAR_CALLBACK_TIMEOUT`,
`DPOP_CALLBACK_NAME`, `CODE_CHALLENGE`.

Docker:

```shell
docker build -t mock-relying-party-ui:local .
docker run -it -d -p 5000:5000 \
  -e ESIGNET_UI_BASE_URL='http://localhost:3000' \
  -e MOCK_RELYING_PARTY_SERVER_URL=http://localhost:8888 \
  -e REDIRECT_URI=http://localhost:5000/userprofile \
  -e CLIENT_ID=healthservices \
  -e ACRS="mosip:esignet:acr:static-code" \
  -e SCOPE_USER_PROFILE='openid%20profile%20resident-service' \
  mock-relying-party-ui:local
```

To host on a context path, edit the nginx `location /` block in `nginx/` and pass
`MOCK_RP_UI_PUBLIC_URL` at `docker run` time — see this directory's `README.md` for the exact
nginx snippet.

Run tests:

```shell
npm test
```

## Configuration

Runtime configuration is read from `public/env-config.js` (populated at container start), not
rebuilt into the JS bundle per environment. See the full variable table in this directory's
`README.md`, including which flags are feature toggles with hardcoded callback names
(`PAR_CALLBACK_NAME`, `DPOP_CALLBACK_NAME`, `CODE_CHALLENGE`).

## Agent rules

### Do

1. Update `README.md`'s environment-variable table whenever you add, rename, or remove a
   variable read from `env-config.js`.
2. Keep this module's dependency set (`package.json`) independent from
   `mock-relying-party-ui-esim` — they are separate apps with separate release cadences even
   though the code is similar.

### Do not

1. Do not hardcode a real `ESIGNET_UI_BASE_URL`, `CLIENT_ID`, or private key value into source
   or committed `.env`/`env-config.js` — these are supplied at deploy time.
2. Do not merge changes intended for `mock-relying-party-ui-esim` into this module or vice
   versa without checking both READMEs — they diverge in dependencies and branding.
