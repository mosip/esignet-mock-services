# Mock Relying Party Portal — Local Setup Guide

Step-by-step guide to running the Mock Relying Party Portal alongside a local eSignet stack. The mock relying party is a sample web application that acts as an OIDC client — it presents a **Sign In** button, redirects the user to eSignet for authentication, and displays the returned identity claims.

---

## Table of Contents

1. [What this sets up](#what-this-sets-up)
2. [Prerequisites](#prerequisites)
3. [Step 1 — Register an OIDC client](#step-1--register-an-oidc-client)
4. [Step 2 — Configure and start the relying party](#step-2--configure-and-start-the-relying-party)
5. [Step 3 — Verify services are healthy](#step-3--verify-services-are-healthy)
6. [Run the end-to-end login flow](#run-the-end-to-end-login-flow)
7. [Environment variable reference](#environment-variable-reference)
8. [FAPI 2.0 setup](#fapi-20-setup)
9. [Troubleshooting](#troubleshooting)
10. [Tearing down](#tearing-down)

---

## What this sets up

This guide brings up two containers alongside the eSignet stack you already have running:

| Service | Image | Host Port | Role |
|---|---|---|---|
| `mock-relying-party-service` | `mosipid/mock-relying-party-service:0.14.0` | **8888** | Backend — handles PKCE, token exchange, userinfo fetch on behalf of the UI |
| `mock-relying-party-ui` | `mosipid/mock-relying-party-ui:0.14.0` | **3001** | Frontend — serves the sample web app with the Sign In button |

> **The mock identity system is not started here.** It is already included in the eSignet stack (`docker-compose.yaml` in the eSignet repo). Do not start it again.

---

## Prerequisites

| Requirement | Notes |
|---|---|
| Docker Engine + Compose plugin | Verify with `docker compose version` |
| eSignet stack running | The eSignet service must be reachable at `http://localhost:8088` before starting this stack. Follow the [eSignet local setup guide](https://github.com/mosip/esignet/blob/master/docker-compose/README.md) first. |
| Free ports | **8888** (relying party service), **3001** (relying party UI) — port 3000 is already used by the eSignet login UI |
| `curl` | For health checks (optional) |
| Browser | For the end-to-end flow |

> **Port 3001 instead of 3000:** The default compose file maps the relying party UI to port 3000, but the eSignet login UI already occupies that port. This guide uses port 3001 for the relying party UI. All redirect URIs and server URLs below reflect this change.

---

## Step 1 — Register an OIDC client

The relying party needs a registered OIDC client. This registration produces a `CLIENT_ID` and requires a `CLIENT_PRIVATE_KEY`. **Do this before starting the containers.**

### 1a. Generate a key pair

The client authenticates to eSignet using `private_key_jwt`. You need a key pair — either **RSA 2048-bit** or **EC P-256**. The private key is passed to the relying party service; the public key is registered with eSignet.

**Option 1 — RSA (using OpenSSL):**

```bash
# Generate private key
openssl genrsa -out rp-private.pem 2048

# Derive public key
openssl rsa -in rp-private.pem -pubout -out rp-public.pem
```

**Option 2 — EC P-256 (using OpenSSL):**

```bash
# Generate EC private key
openssl ecparam -name prime256v1 -genkey -noout -out rp-private.pem

# Derive public key
openssl ec -in rp-private.pem -pubout -out rp-public.pem
```

The client registration expects the **public key in JWK format**, and `CLIENT_PRIVATE_KEY` must be the **private key in JWK format** (base64-encoded). Convert both:

```bash
# Install the `pem-jwk` Node tool (or use an equivalent)
npm install -g pem-jwk

# Public JWK — used in the registration request
pem-jwk rp-public.pem > rp-public.jwk

# Private JWK — used as CLIENT_PRIVATE_KEY
pem-jwk rp-private.pem > rp-private.jwk
```

Add `"use": "sig"`, the appropriate `"alg"`, and a `"kid"` value to both JWK objects before using them.

Example public JWK for RSA:

```json
{
  "kty": "RSA",
  "n":   "<base64url-encoded modulus>",
  "e":   "AQAB",
  "use": "sig",
  "alg": "RS256",
  "kid": "rp-local-key-1"
}
```

Example public JWK for EC P-256:

```json
{
  "kty": "EC",
  "crv": "P-256",
  "x":   "<base64url-encoded x coordinate>",
  "y":   "<base64url-encoded y coordinate>",
  "use": "sig",
  "alg": "ES256",
  "kid": "rp-local-key-1"
}
```

The private key follows the same format with additional private-key fields (`"d"` for EC; `"d"`, `"p"`, `"q"`, `"dp"`, `"dq"`, `"qi"` for RSA). This is what you pass as `CLIENT_PRIVATE_KEY` (base64-encoded).

### 1b. Register the client with eSignet

```bash
curl -s -X POST http://localhost:8088/client-mgmt/client \
  -H "Content-Type: application/json" \
  -d '{
    "clientId":          "mock-relying-party-local",
    "clientName":        "Mock Relying Party (local)",
    "publicKey":         {
      "kty": "RSA",
      "n":   "<base64url-encoded modulus from rp-public.jwk>",
      "e":   "AQAB",
      "use": "sig",
      "alg": "RS256",
      "kid": "rp-local-key-1"
    },
    "relyingPartyId":    "mock-relying-party-local",
    "logoUri":           "http://localhost:3001/favicon.ico",
    "redirectUris":      ["http://localhost:3001/userprofile"],
    "userClaims":        ["name", "email", "phone_number", "gender", "birthdate", "address", "picture"],
    "authContextRefs":   ["mosip:idp:acr:password", "mosip:idp:acr:generated-code", "mosip:idp:acr:biometrics"],
    "grantTypes":        ["authorization_code"],
    "clientAuthMethods": ["private_key_jwt"]
  }'
```

A successful response returns the registered `clientId`. **Save this value** — it becomes `CLIENT_ID` in the next step.

### 1c. Encode the private key

The `CLIENT_PRIVATE_KEY` environment variable is the private JWK encoded as a **base64 string**. Convert it:

```bash
# Linux / Git Bash
CLIENT_PRIVATE_KEY=$(cat rp-private.jwk | base64 -w 0)
echo $CLIENT_PRIVATE_KEY

# macOS
CLIENT_PRIVATE_KEY=$(cat rp-private.jwk | base64 -b 0)
echo $CLIENT_PRIVATE_KEY
```

```powershell
# Windows PowerShell
$bytes = [System.Text.Encoding]::UTF8.GetBytes((Get-Content rp-private.jwk -Raw))
$CLIENT_PRIVATE_KEY = [Convert]::ToBase64String($bytes)
```

---

## Step 2 — Configure and start the relying party

Open `mock-relying-party-portal-docker-compose.yml` and replace the placeholder values with the ones you collected in Step 1.

### Required changes

```yaml
services:
  mock-relying-party-service:
    extra_hosts:
      - "host.docker.internal:host-gateway"   # Required on Linux; no-op on Docker Desktop (Mac/Windows)
    environment:
      # Point to your local eSignet instance — NOT collab.mosip.net
      - ESIGNET_SERVICE_URL=http://host.docker.internal:8088
      - ESIGNET_AUD_URL=http://host.docker.internal:8088/oauth2/token
      # Paste the base64-encoded private JWK you generated in Step 1c
      - CLIENT_PRIVATE_KEY=<your-base64-encoded-private-jwk>
      # For userinfo JWT decryption — can be the same key as CLIENT_PRIVATE_KEY for a local demo
      - JWE_USERINFO_PRIVATE_KEY=<your-base64-encoded-private-jwk>

  mock-relying-party-ui:
    ports:
      - "3001:3000"                           # Changed from 3000 to avoid conflict with eSignet UI
    environment:
      # Point to your local eSignet login UI (the OIDC login page)
      - ESIGNET_UI_BASE_URL=http://localhost:3000
      # Use the host port you mapped above (3001)
      - MOCK_RELYING_PARTY_SERVER_URL=http://localhost:3001/mock-relying-party-service
      - REDIRECT_URI=http://localhost:3001/userprofile
      - REDIRECT_URI_REGISTRATION=http://localhost:3001/registration
      # The CLIENT_ID returned by the registration call in Step 1b
      - CLIENT_ID=<your-client-id>
      # The Sign In plugin is available on npm (@mosip/sign-in-with-esignet); reference it via a CDN
      - SIGN_IN_BUTTON_PLUGIN_URL=https://unpkg.com/@mosip/sign-in-with-esignet@0.1.1-beta.0/dist/iife/index.js
```

> **`host.docker.internal`:** Docker containers cannot reach `localhost` on the host. The `extra_hosts` entry above makes `host.docker.internal` resolve to the host gateway on Linux (Docker Engine without Docker Desktop). On Docker Desktop for Mac and Windows this hostname is already defined automatically, so the entry is harmless. The eSignet service at `http://localhost:8088` on your terminal is `http://host.docker.internal:8088` from inside a container.

### Start the stack

```bash
docker compose -f mock-relying-party-portal-docker-compose.yml up -d
```

Watch startup:

```bash
docker compose -f mock-relying-party-portal-docker-compose.yml logs -f
```

Press `Ctrl+C` to stop following logs — the containers keep running.

---

## Step 3 — Verify services are healthy

```bash
docker compose -f mock-relying-party-portal-docker-compose.yml ps
```

Both services should be `running`:

```
NAME                          SERVICE                      STATUS
...-mock-relying-party-service-1   mock-relying-party-service   running
...-mock-relying-party-ui-1        mock-relying-party-ui        running
```

Check each endpoint responds:

```bash
# Relying party service health
curl http://localhost:8888/v1/mock-relying-party/actuator/health
# Expected: {"status":"UP"}

# Relying party UI (browser)
# Open http://localhost:3001
# Expected: the sample web app loads with a "Sign In with eSignet" button
```

If `mock-relying-party-service` takes up to 60 seconds to start (Spring Boot JVM warm-up), wait and retry.

---

## Run the end-to-end login flow

Use the pre-seeded mock identity that was loaded into the database when the eSignet stack started. No additional identity setup is needed.

| Field | Value |
|---|---|
| Individual ID | `1774231323` |
| PIN | `545411` |
| OTP | `111111` (static — the mock OTP channel always accepts this) |
| Email | `siddhartha.km@gmail.com` |
| Phone | `+919427357934` |

### Flow

1. Open **http://localhost:3001** in a browser.
2. Click **Sign In with eSignet**. You are redirected to the eSignet login UI at `http://localhost:3000`.
3. Enter Individual ID `1774231323` and PIN `545411`. Enter any value for CAPTCHA (the test key always passes).
4. Click **Login**.
5. Review the requested claims and click **Allow**.
6. You are redirected back to `http://localhost:3001/userprofile` with the user's claims displayed.

---

## Environment variable reference

### `mock-relying-party-service`

| Variable | Default (collab) | Local override | Description |
|---|---|---|---|
| `ESIGNET_SERVICE_URL` | `https://esignet.collab.mosip.net/v1/esignet` | `http://host.docker.internal:8088` | Base URL of the eSignet service |
| `ESIGNET_AUD_URL` | `https://esignet.collab.mosip.net/v1/esignet/oauth/v2/token` | `http://host.docker.internal:8088/oauth2/token` | Token endpoint — used as the `aud` claim in `private_key_jwt` |
| `CLIENT_PRIVATE_KEY` | (collab pre-generated key) | Your base64-encoded RSA private JWK | Private key for signing client-assertion JWTs |
| `JWE_USERINFO_PRIVATE_KEY` | (collab pre-generated key) | Same key as `CLIENT_PRIVATE_KEY` is fine for a demo | Private key for decrypting encrypted userinfo responses |
| `USERINFO_RESPONSE_TYPE` | `jwt` | `jwt` | Leave as-is |

### `mock-relying-party-ui`

| Variable | Default (collab) | Local override | Description |
|---|---|---|---|
| `ESIGNET_UI_BASE_URL` | `https://esignet.collab.mosip.net` | `http://localhost:3000` | Base URL of the eSignet login UI — where the Sign In button redirects |
| `MOCK_RELYING_PARTY_SERVER_URL` | `http://localhost:3000/mock-relying-party-service` | `http://localhost:3001/mock-relying-party-service` | URL the browser uses to reach the backend via the nginx proxy |
| `REDIRECT_URI` | `http://localhost:3000/userprofile` | `http://localhost:3001/userprofile` | OAuth redirect URI — must match a URI registered in Step 1b |
| `REDIRECT_URI_REGISTRATION` | `http://localhost:3000/registration` | `http://localhost:3001/registration` | Registration redirect URI |
| `CLIENT_ID` | `_UgkpFCOsqoxsbLfywjXFuVRYZaHeYK6l0GmxMg3Rg8` (collab) | Your registered client ID from Step 1b | OIDC client identifier |
| `SIGN_IN_BUTTON_PLUGIN_URL` | `https://esignet.collab.mosip.net/plugins/sign-in-button-plugin.js` | CDN URL from npm — see note below | URL of the Sign In with eSignet button plugin. The plugin is published on npm as [`@mosip/sign-in-with-esignet`](https://www.npmjs.com/package/@mosip/sign-in-with-esignet) (currently `0.1.1-beta.0`); use a CDN URL such as `https://unpkg.com/@mosip/sign-in-with-esignet@0.1.1-beta.0/dist/iife/index.js` for local setups. |
| `ACRS` | `mosip:idp:acr:password%20mosip:idp:acr:generated-code%20...` | Same | Space-separated ACRs — leave as-is for local testing |
| `CLAIMS_LOCALES` | `en` | `en` | Leave as-is |
| `SCOPE_USER_PROFILE` | `openid profile` | `openid profile` | Leave as-is |
| `CLAIMS_USER_PROFILE` | (URL-encoded JSON) | Same | Leave as-is |
| `CLAIMS_REGISTRATION` | (URL-encoded JSON) | Same | Leave as-is |

---

## FAPI 2.0 setup

To run the relying party with DPoP and PAR enabled:

```bash
docker compose -f mock-relying-party-portal-fapi2-docker-compose.yml up -d
```

Additional variables required on top of the standard set:

| Variable | Service | Description |
|---|---|---|
| `ESIGNET_PAR_ENDPOINT` | service | PAR endpoint, e.g. `http://host.docker.internal:8088/oauth2/par` |
| `ESIGNET_PAR_AUD_URL` | service | PAR audience URL |
| `DPOP_CALLBACK_NAME` | ui | Must be `get_dpop_jkt` |
| `PAR_CALLBACK_NAME` | ui | Must be `get_requestUri` |
| `PAR_CALLBACK_TIMEOUT` | ui | Milliseconds to wait for PAR response, e.g. `5000` |

See `mock-relying-party-portal-fapi2-docker-compose.yml` for a complete working example.

---

## Troubleshooting

**Port 3001 already in use**

```bash
# Linux / macOS
lsof -i :3001
# Windows
netstat -ano | findstr :3001
```

Stop the conflicting process, or change the host port in the compose file (`"3002:3000"`) and update `MOCK_RELYING_PARTY_SERVER_URL` and `REDIRECT_URI` to match.

**Port 8888 already in use**

Same pattern — check what holds port 8888 and either stop it or remap the service port in the compose file.

**`mock-relying-party-service` cannot reach eSignet**

The container must reach eSignet via `host.docker.internal`, not `localhost`. Confirm:

```bash
# From inside the service container
docker compose -f mock-relying-party-portal-docker-compose.yml exec mock-relying-party-service \
  curl http://host.docker.internal:8088/health
```

On Linux (non-Docker Desktop), replace `host.docker.internal` with the output of:

```bash
ip route show default | awk '/default/ { print $3 }'
```

**Sign In button does not appear**

The button is loaded from `SIGN_IN_BUTTON_PLUGIN_URL`. If the URL is wrong or unreachable, the button fails silently. Open the configured URL in a browser and confirm it returns JavaScript. The plugin is published on npm as [`@mosip/sign-in-with-esignet`](https://www.npmjs.com/package/@mosip/sign-in-with-esignet) — set `SIGN_IN_BUTTON_PLUGIN_URL` to a CDN URL such as `https://unpkg.com/@mosip/sign-in-with-esignet@0.1.1-beta.0/dist/iife/index.js`.

**`CLIENT_ID` not found / redirect URI mismatch**

Both errors mean the client registration in Step 1b either did not complete or used a different redirect URI. Re-register the client and ensure `REDIRECT_URI` in the compose file exactly matches the value you registered.

**Login succeeds but userprofile page is blank**

The relying party service could not decrypt the userinfo response. Verify that `JWE_USERINFO_PRIVATE_KEY` is set to the correct base64-encoded private JWK.

**`mock-relying-party-service` exits immediately**

```bash
docker compose -f mock-relying-party-portal-docker-compose.yml logs mock-relying-party-service
```

Common causes: malformed `CLIENT_PRIVATE_KEY` (not valid base64 or not valid JWK JSON), insufficient memory (Spring Boot needs at least 512 MB).

---

## Tearing down

All commands run from the `docker-compose/` directory of the `esignet-mock-services` repository.

Stop the relying party stack and keep any volumes:

```bash
docker compose -f mock-relying-party-portal-docker-compose.yml down
```

Stop and delete all data (clean reset):

```bash
docker compose -f mock-relying-party-portal-docker-compose.yml down -v
```

Remove pulled images as well:

```bash
docker compose -f mock-relying-party-portal-docker-compose.yml down -v --rmi all
```

> **Separate teardown:** The above commands tear down only the relying party stack. The eSignet stack (database, mock identity system, eSignet service, eSignet UI) must be torn down separately from the eSignet repository's `docker-compose/` directory.

