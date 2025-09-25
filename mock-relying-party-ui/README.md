# Mock Relying Party UI

This React application serves as the UI for the Mock Relying Party Portal.

## Overview

This repository contains the reference implementation of a relying party's portal demonstrating use of [MOSIP's Esignet (Identity Provider) services](https://github.com/mosip/esignet) to log in users into its portal.

The portal uses [OpenID specs](https://openid.net/specs/openid-connect-core-1_0.html) to communicate with [MOSIP Esignet Services](https://github.com/mosip/esignet).

This portal contains 2 pages:

1. **Home Page**: This page acts as the login screen for the relying party’s website. It includes a "Sign in with MOSIP" button. Upon clicking the button, the user is redirected to the MOSIP Esignet portal to authenticate and provide consent to share their information with the relying party.

2. **User Profile Page**: This page displays the user profile on the relying party’s website. After successful authentication and consent approval, the user is redirected here with an authorization code. This code is sent to the relying party’s backend service via the `/fetchUserInfo` endpoint, which uses the auth code to fetch an access token and user details from MOSIP Esignet services.

## Build & run (for developers)

The application runs on PORT=5000 by default.

- Environment Variables:

  - ESIGNET_UI_BASE_URL: MOSIP ESIGNET UI URL
    (Example:https://esignet.dev.mosip.net/)
  - MOCK_RELYING_PARTY_SERVER_URL: Internally resolved to the mock relying party server via internal NGINX
    (Example:http://esignet.dev.mosip.net/mock-relying-party-server)
  - REDIRECT_URI: Redirect URI passed as a parameter in the authorization request
    (Example:https://health-services.com/userprofile)
  - CLIENT_ID: Relying party client ID registered with MOSIP (Example:health-services)
  - ACRS: Passed in the `acr_values` parameter in the authorization request (Example:mosip:esignet:acr:generated-code)
  - MAX_AGE: Maximum duration (in seconds) for which a cached resource is considered valid before revalidation
    (Example:max_age:21)
  - DISPLAY: Specifies how the authorization server displays the authentication and consent screen.
    Possible values: page, popup, wap, touch
    (Example: display:page)
  - PROMPT: Specifies the type of prompt to show during the authentication flow
    (Example: prompt:consent)
  - GRANT_TYPE: OAuth 2.0 grant type used to request access tokens
    (Example: grant_type: authorization_code)
  - SIGN_IN_BUTTON_PLUGIN_URL: URL for the sign-in button plugin
  - SCOPE_USER_PROFILE: List of scopes requested during the authentication request
    (Example: scope_user_profile: openid%20profile%20resident-service)
  - PAR_CALLBACK_NAME: **Feature flag** to enable PAR (Pushed Authorization Request) flow  
    Required value: `get_requestUri` (hardcoded function name - not configurable)
  - PAR_CALLBACK_TIMEOUT: Timeout for PAR callback in milliseconds(`optional`. Default value is 5 seconds) 
    (Example: par_callback_timeout: 5000)
  - DPOP_CALLBACK_NAME: **Feature flag** to enable DPoP (Demonstration of Proof-of-Possession) flow  
    Required value: `get_dpop_jkt` (hardcoded function name - not configurable)

  > **Important:** PAR_CALLBACK_NAME and DPOP_CALLBACK_NAME act as feature toggles. The values correspond to hardcoded function names in the codebase and are not configurable. Include these variables to enable the respective flows, or omit them to disable the functionality.

- Build and run Docker for a service:

  ```
  $ docker build -t <dockerImageName>:<tag> .
  $ docker run -it -d -p 5000:5000 -e ESIGNET_UI_BASE_URL='http://localhost:3000' -e MOCK_RELYING_PARTY_BASE_URL=http://localhost:8888 -e REDIRECT_URI=http://localhost:5000/userprofile -e CLIENT_ID=healthservices -e ACRS="mosip:esignet:acr:static-code" -e MAX_AGE=21 -e DISPLAY=page -e PROMPT=consent -e GRANT_TYPE=authorization_code -e SIGN_IN_BUTTON_PLUGIN_URL='http://127.0.0.1:5500/dist/iife/index.js' -e SCOPE_USER_PROFILE='openid%20profile%20resident-service' -e PAR_CALLBACK_NAME='get_requestUri' -e DPOP_CALLBACK_NAME='get_dpop_jkt' -e <dockerImageName>:<tag>
  ```

  To host the mock relying party UI on a context path:

  1. In the NGINX configuration file, remove the `/` location block and add a new one with the desired context path:

  ```
  location /healthservices {
     alias /usr/share/nginx/healthservices;
     try_files $uri $uri/ /healthservices/index.html;
  }
  ```

  2. Pass the context path in the environment variable `MOCK_RP_UI_PUBLIC_URL` during `docker run`.

  ```
  $ docker build -t <dockerImageName>:<tag> .
  $ docker run -it -d -p 3000:3000 -e MOCK_RP_UI_PUBLIC_URL='healthservices' <dockerImageName>:<tag>

  # The UI will be accessible at: http://<domain>/healthservices
  ```

- Build and run on local system:
  Update the "/mock-relying-party-ui/public/env-config.js" file with the required values, then run:
  ```
  $ npm start
  ```

## API Endpoints

The mock relying party backend exposes the following endpoints, which are used by the UI for various OpenID Connect flows:

- **`/fetchUserInfo`**  
  Exchanges the authorization code for an access token and retrieves the user’s information from MOSIP Esignet.
  Invoked after the user is redirected back to the relying party with the authorization code.

- **`/requestUri`**  
  Used in the [Pushed Authorization Request (PAR)](https://datatracker.ietf.org/doc/html/rfc9126) flow.  
  Returns a `request_uri` that encapsulates the full authorization request, reducing query string length and improving security.

- **`/dpopJKT`**  
  Used for [DPoP (Demonstration of Proof-of-Possession)](https://datatracker.ietf.org/doc/html/draft-ietf-oauth-dpop-14).  
  Returns the **JWK thumbprint (JKT)** required to bind access tokens to a client's public key to prevent token misuse.

These endpoints are prefixed with the base URL provided in the environment variable `MOCK_RELYING_PARTY_SERVER_URL`.

## License

This project is licensed under the terms of [Mozilla Public License 2.0](../LICENSE).
