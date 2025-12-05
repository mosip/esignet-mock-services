# Mock Relying Party UI

This react application is the UI for the mock relying party portal

## Overview

This repository contains the reference implementation of a relying party's portal to showcase the OIDC protocol based integration with eSignet.

Mock relying party portal uses [OpenID specs](https://openid.net/specs/openid-connect-core-1_0.html) to communicate with [MOSIP Esignet Services](https://github.com/mosip/esignet). And this implementation contains 2 pages.

1. **Home Page**: This page represents the login screen for the relying party's website. This page includes a button with the text, "Sign in with MOSIP". On the click this button, the user gets redirected to the MOSIP's Esignet Portal. The user now has to authenticate and provide consent to share information from MOSIP to relying party, on the Esignet portal.

2. **User Profile Page**: This page shows the user profile on the relying party's website. On successful authentication and consent approval, the user gets navigated to this page with an Auth Code. This Auth Code would be shared with the relying party's backend service via the `/fetchUserInfo` endpoint. The backend then uses the Auth Code to fetch the access token and user details from MOSIP Esignet services.

## Build & run (for developers)

The application run on PORT=5000 by default.

- Env variables

  - ESIGNET_UI_BASE_URL: MOSIP ESIGNET UI URL (Example:https://esignet.dev.mosip.net/)
  - MOCK_RELYING_PARTY_SERVER_URL: This will be internally resolved to Mock relying party server by internal nginx (Example:http://esignet.dev.mosip.net/mock-relying-party-server)
  - REDIRECT_URI: Value that needs to be passed into authorize redirect_uri parameter (Example:https://esim.com/userprofile)
  - CLIENT_ID: Relying Party client Id, that is registered with MOSIP (Example:esim)
  - ACRS: Value that needs to be passed into authorize acr_values parameter (Example:mosip:esignet:acr:generated-code)
  - MAX_AGE: Represents the maximum amount of time, in seconds, that a cached resource should be considered fresh or valid before it needs to be revalidated with the origin server.
  (Example:max_age:21)
  - DISPLAY: This property specifies how the authorization server should display the authentication and consent page to the end-user.
  Possible values are page, popup, wap, touch 
  (Exapmle: display:page)
  - PROMPT: This property specifies the type of prompt to be used during the authentication flow.
  (Exapmle: prompt:consent)
  - GRANT_TYPE: This property specifies the OAuth 2.0 grant type that the client will use to request access tokens. (Example: grant_type: authorization_code)
  - SIGN_IN_BUTTON_PLUGIN_URL: Sign in button url.
  - SCOPE_USER_PROFILE: List of scopes that are requested when initiating an authentication request.
  (Example: scope_user_profile: openid%20profile%20resident-service)

- Build and run Docker for a service:

  ```
  $ docker build -t <dockerImageName>:<tag> .
  $ docker run -it -d -p 5000:5000 -e ESIGNET_UI_BASE_URL='http://localhost:3000' -e MOCK_RELYING_PARTY_BASE_URL=http://localhost:8888 -e REDIRECT_URI=http://localhost:5000/userprofile -e CLIENT_ID=esim -e ACRS="mosip:esignet:acr:static-code" -e MAX_AGE=21 -e DISPLAY=page -e PROMPT=consent -e GRANT_TYPE=authorization_code -e SIGN_IN_BUTTON_PLUGIN_URL='http://127.0.0.1:5500/dist/iife/index.js' -e SCOPE_USER_PROFILE='openid%20profile%20resident-service' -e <dockerImageName>:<tag>
  ```

  To host mock relying party ui on a context path:
  1. Remove the location path with `/` in the nignx file and add the location with context path as below.
    ```
    location /esim {
       alias /usr/share/nginx/esim;
       try_files $uri $uri/ /esim/index.html;
    }
    ```
  2. Provide the context path in the env variable `MOCK_RP_UI_PUBLIC_URL` during docker run.
  ```
  $ docker build -t <dockerImageName>:<tag> .
  $ docker run -it -d -p 3000:3000 -e MOCK_RP_UI_PUBLIC_URL='esim' <dockerImageName>:<tag>

  # The UI will be hosted on http://<domain>/esim
  ```

- Build and run on local system:
  Update "/mock-relying-party-ui/public/env-config.js" file according to the requirements
  ```
  $ npm start
  ```

## License
This project is licensed under the terms of [Mozilla Public License 2.0](../LICENSE).