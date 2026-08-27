# AGENTS.md — mock-relying-party-ui-esim

Parent guide: [../AGENTS.md](../AGENTS.md)

## Purpose

React (Create React App) UI for the eSIM-branded mock relying-party portal, showcasing OIDC
protocol integration with eSignet. Same two-page flow as `mock-relying-party-ui` (Home page
with "Sign in with MOSIP", User Profile page after authentication), packaged as a distinct app
(`package.json` name: `fyntel-app`).

This is a demo/reference UI, not a production relying-party frontend.

## Layout

- `src/` — React application source.
- `public/` — static assets, including `env-config.js` for runtime configuration.
- `.env`, `.env.development` — build-time defaults.
- `nginx/` — nginx config used by the `Dockerfile`.
- `package.json` — CRA scripts: `start`, `build`, `test`, `eject`. Distinct dependency set
  from `mock-relying-party-ui` (e.g. TypeScript, `workbox-webpack-plugin`, `ajv` devDependencies
  present here but not in the sibling UI module).

## How to run

```shell
npm install
npm start
```

Runs on port 5000 by default. Update `public/env-config.js` per this directory's `README.md`
before running: `ESIGNET_UI_BASE_URL`, `MOCK_RELYING_PARTY_SERVER_URL`, `REDIRECT_URI`,
`CLIENT_ID`, `ACRS`, `SCOPE_USER_PROFILE`, and optional `MAX_AGE`, `DISPLAY`, `PROMPT`,
`GRANT_TYPE`, `SIGN_IN_BUTTON_PLUGIN_URL`.

Docker:

```shell
docker build -t mock-relying-party-ui-esim:local .
docker run -it -d -p 5000:5000 \
  -e ESIGNET_UI_BASE_URL='http://localhost:3000' \
  -e MOCK_RELYING_PARTY_SERVER_URL=http://localhost:8888 \
  -e REDIRECT_URI=http://localhost:5000/userprofile \
  -e CLIENT_ID=esim \
  -e ACRS="mosip:esignet:acr:static-code" \
  -e SCOPE_USER_PROFILE='openid%20profile%20resident-service' \
  mock-relying-party-ui-esim:local
```

To host on a context path, edit the nginx `location /` block and pass `MOCK_RP_UI_PUBLIC_URL`
at `docker run` time — see this directory's `README.md`.

Run tests:

```shell
npm test
```

## Configuration

Runtime configuration is read from `public/env-config.js`, populated at container start. See
this directory's `README.md` for the full variable list.

## Agent rules

### Do

1. Update this directory's `README.md` environment-variable list whenever you add, rename, or
   remove a variable read from `env-config.js`.
2. Treat this module as independent from `mock-relying-party-ui` — do not assume a fix here
   also applies there, or vice versa.

### Do not

1. Do not hardcode real client IDs, redirect URIs, or private keys into source or committed
   `.env`/`env-config.js`.
2. Do not assume this module's `package.json` matches `mock-relying-party-ui`'s — verify
   before copying dependency or script changes across.
