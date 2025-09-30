# Mock Relying Party Server

This is a NodeJS application that acts as a backend for the Mock Relying Party portal, providing OAuth 2.0/OIDC integration with eSignet services. It implements modern OAuth security features including DPoP (Demonstration of Proof-of-Possession) and PAR (Pushed Authorization Request) for enhanced security and compliance.

## Overview

Mock Relying Party Server provides the following endpoints:

### 1. GET /dpopJKT
Generates a unique public-private key pair for the DPoP flow and caches it in-memory against the `clientId` and `state` parameters (TTL: 10 minutes, not configurable). Computes and returns the JWK thumbprint of the public key as `dpop_jkt` (per [RFC 7638](https://datatracker.ietf.org/doc/html/rfc7638)). This endpoint implements [RFC 9449](https://datatracker.ietf.org/doc/html/rfc9449) DPoP to bind access tokens to the client's cryptographic key, preventing token theft and replay attacks.

**Query Parameters:**
- `clientId` (required): The registered client identifier
- `state` (required): OAuth state parameter

**Response:** 
```json
{
  "dpop_jkt": "{{jwk_thumbprint}}"
}
```

**Error Responses:**
- `400` - Missing state or clientId / Duplicate State
- `500` - Failed to generate DPoP JKT

### 2. GET /requestUri/:clientId
Retrieves the Pushed Authorization Request (PAR) URI for OAuth authorization. This endpoint implements [RFC 9126](https://datatracker.ietf.org/doc/html/rfc9126) PAR for enhanced security by allowing authorization request parameters to be pushed to the authorization server prior to the authorization request itself.

**Path Parameters:**
- `clientId` (required): The registered client identifier

**Query Parameters:**
- `ui_locales` (optional): UI localization preferences
- `state` (optional): OAuth state parameter
- `dpop_jkt` (optional): DPoP JWK Thumbprint for binding

**Response:**
```json
{
  "request_uri": "{{request_uri}}",
  "expires_in": {{expiry_seconds}}
}
```

**Error Responses:**
- `500` - Failed to get requestUri

### 3. POST /fetchUserInfo
Exchanges authorization code for access token and retrieves user information.

**Request Body (application/json):**
```json
{
  "code": "{{authorization_code}}",
  "client_id": "{{clientId}}",
  "redirect_uri": "{{redirectionUrl}}",
  "grant_type": "authorization_code",
  "state": "{{state_parameter}}"
}
```

**Response (application/json):**
The response contains decrypted user information. The original response from eSignet can be either:
- JWT signed user information, or 
- JWE encrypted then JWT signed (Nested JWT)

**Error Responses:**
- `500` - Failed to get the User Info

## Build & Run (for developers)

The application runs on PORT=8888 by default.

### Environment Variables

- `ESIGNET_SERVICE_URL`: MOSIP eSignet API base URL  
  Example: `https://<ESIGNET_DOMAIN>/v1/esignet`
- `PORT`: Server port (default: 8888)
- `CLIENT_PRIVATE_KEY`: Base64 encoded private key JWK for client authentication (required)
- `ESIGNET_AUD_URL`: Audience value for token endpoint client assertions  
  Example: `https://<ESIGNET_DOMAIN>/v1/esignet/oauth/v2/token`
- `CLIENT_ASSERTION_TYPE`: JWT client assertion type (default: `urn:ietf:params:oauth:client-assertion-type:jwt-bearer`)
- `USERINFO_RESPONSE_TYPE`: Response type for user information (default: `jws`, options: `jws`, `jwe`)
- `JWE_USERINFO_PRIVATE_KEY`: Base64 encoded private key for JWE decryption (required only if `USERINFO_RESPONSE_TYPE=jwe`)

#### Additional Configuration for PAR (Pushed Authorization Request)

When using PAR flow or when PAR is enabled, make sure to add these additional environment variables:

- `ESIGNET_PAR_ENDPOINT`: PAR (Pushed Authorization Request) endpoint URL  
  Example: `https://<ESIGNET_DOMAIN>/v1/esignet/oauth/par`
- `ESIGNET_PAR_AUD_URL`: Audience value for PAR endpoint client assertions  
  Example: `https://<ESIGNET_DOMAIN>/v1/esignet/oauth/par`
- `REDIRECT_URI`: Redirect URI for OAuth flows  
  Example: `https://<YOUR_DOMAIN>/userprofile`
- `SCOPE_USER_PROFILE`: Scope for user profile requests (default: `openid profile`)
- `SCOPE_REGISTRATION`: Scope for registration requests (default: `openid profile`)
- `DISPLAY`: Display mode (default: `page`)
- `PROMPT`: Prompt parameter (default: `consent`)
- `GRANT_TYPE`: OAuth grant type (default: `authorization_code`)
- `MAX_AGE`: Maximum authentication age (optional)
- `ACRS`: Authentication Context Class References (space-separated)  
  Example: `mosip:idp:acr:linked-wallet mosip:idp:acr:knowledge mosip:idp:acr:generated-code mosip:idp:acr:password`
- `CLAIMS_USER_PROFILE`: User profile claims JSON configuration  
  Example: `{"userinfo":{"name":{"essential":true},"phone_number":{"essential":true},"verified_claims":[{"verification":{"trust_framework":{"value":"ABC TF"}},"claims":{"phone_number":{"essential":true}}},{"verification":{"trust_framework":{"value":"XYZ TF"}},"claims":{"name":{"essential":true}}}]},"id_token":{}}`
- `CLAIMS_REGISTRATION`: Registration claims JSON (default: `{}`)
- `CLAIMS_LOCALES`: Claims localization (default: `en`)
- `DEFAULT_UI_LOCALES`: Default UI localization (optional)

> **Note:** PAR (RFC 9126) enhances security by allowing authorization request parameters to be pushed to the authorization server prior to the authorization request itself, reducing the risk of parameter tampering and supporting larger request payloads.

### Build and run with Docker

```bash
$ docker build -t <dockerImageName>:<tag> .

# Basic setup
$ docker run -it -d -p 8888:8888 \
  --env ESIGNET_SERVICE_URL='https://<ESIGNET_DOMAIN>/v1/esignet' \
  --env ESIGNET_AUD_URL='https://<ESIGNET_DOMAIN>/v1/esignet/oauth/v2/token' \
  --env CLIENT_PRIVATE_KEY='<BASE64_ENCODED_PRIVATE_KEY>' \
  --env REDIRECT_URI='https://<YOUR_DOMAIN>/userprofile' \
  --env SCOPE_USER_PROFILE='openid profile' \
  --env ACRS='mosip:idp:acr:linked-wallet mosip:idp:acr:knowledge mosip:idp:acr:generated-code mosip:idp:acr:password' \
  <dockerImageName>:<tag>

# For PAR-enabled setup, add these additional environment variables:
$ docker run -it -d -p 8888:8888 \
  --env ESIGNET_SERVICE_URL='https://<ESIGNET_DOMAIN>/v1/esignet' \
  --env ESIGNET_AUD_URL='https://<ESIGNET_DOMAIN>/v1/esignet/oauth/v2/token' \
  --env ESIGNET_PAR_ENDPOINT='https://<ESIGNET_DOMAIN>/v1/esignet/oauth/par' \
  --env ESIGNET_PAR_AUD_URL='https://<ESIGNET_DOMAIN>/v1/esignet/oauth/par' \
  --env CLIENT_PRIVATE_KEY='<BASE64_ENCODED_PRIVATE_KEY>' \
  --env REDIRECT_URI='https://<YOUR_DOMAIN>/userprofile' \
  --env SCOPE_USER_PROFILE='openid profile' \
  --env ACRS='mosip:idp:acr:linked-wallet mosip:idp:acr:knowledge mosip:idp:acr:generated-code mosip:idp:acr:password' \
  <dockerImageName>:<tag>
```

### Build and run on local system

1. Install dependencies:
   ```bash
   $ npm install
   ```

2. **Basic setup** - Set core environment variables and run:
   ```bash
   $ export PORT=8888
   $ export ESIGNET_SERVICE_URL='https://<ESIGNET_DOMAIN>/v1/esignet'
   $ export ESIGNET_AUD_URL='https://<ESIGNET_DOMAIN>/v1/esignet/oauth/v2/token'
   $ export CLIENT_PRIVATE_KEY='<BASE64_ENCODED_PRIVATE_KEY>'
   $ export REDIRECT_URI='https://<YOUR_DOMAIN>/userprofile'
   $ export SCOPE_USER_PROFILE='openid profile'
   $ export ACRS='mosip:idp:acr:linked-wallet mosip:idp:acr:knowledge mosip:idp:acr:generated-code mosip:idp:acr:password'
   $ npm start
   ```

3. **For PAR-enabled setup**, add these additional exports:
   ```bash
   $ export ESIGNET_PAR_ENDPOINT='https://<ESIGNET_DOMAIN>/v1/esignet/oauth/par'
   $ export ESIGNET_PAR_AUD_URL='https://<ESIGNET_DOMAIN>/v1/esignet/oauth/par'
   ```

4. **Alternative using package.json script:**
   
   Update the "devstart" script in package.json:
   ```json
   "devstart": "SET PORT=8888 && SET ESIGNET_SERVICE_URL='https://<ESIGNET_DOMAIN>/v1/esignet' && SET ESIGNET_AUD_URL='https://<ESIGNET_DOMAIN>/v1/esignet/oauth/v2/token' && SET CLIENT_PRIVATE_KEY='<BASE64_ENCODED_PRIVATE_KEY>' && SET REDIRECT_URI='https://<YOUR_DOMAIN>/userprofile' && SET SCOPE_USER_PROFILE='openid profile' && nodemon app.js"
   ```

   For PAR-enabled setup, additionally include:
   ```json
   "devstart": "SET PORT=8888 && SET ESIGNET_SERVICE_URL='https://<ESIGNET_DOMAIN>/v1/esignet' && SET ESIGNET_AUD_URL='https://<ESIGNET_DOMAIN>/v1/esignet/oauth/v2/token' && SET ESIGNET_PAR_ENDPOINT='https://<ESIGNET_DOMAIN>/v1/esignet/oauth/par' && SET ESIGNET_PAR_AUD_URL='https://<ESIGNET_DOMAIN>/v1/esignet/oauth/par' && SET CLIENT_PRIVATE_KEY='<BASE64_ENCODED_PRIVATE_KEY>' && SET REDIRECT_URI='https://<YOUR_DOMAIN>/userprofile' && SET SCOPE_USER_PROFILE='openid profile' && nodemon app.js"
   ```

   Then run:
   ```bash
   $ npm run devstart
   ```

## API Flow Examples

### Standard OAuth 2.0 Flow
1. **Generate DPoP JKT**: `GET /dpopJKT?clientId=<client_id>&state=<state>`
2. **Get Request URI**: `GET /requestUri/<client_id>?state=<state>&dpop_jkt=<dpop_jkt>`
3. **Exchange Code**: `POST /fetchUserInfo` with authorization code

## License

This project is licensed under the terms of [Mozilla Public License 2.0](../LICENSE).