# Mock Relying Party UI

This react application is the UI for the mock relying party portal

## Overview

This repository contains the reference implementation of a relying party's website that wants to use [MOSIP's Esignet (Identity Provider) services](https://github.com/mosip/esignet) to log in users into its portal.

This portal uses [OpenID specs](https://openid.net/specs/openid-connect-core-1_0.html) to communicate with [MOSIP Esignet Services](https://github.com/mosip/esignet).

This portal contains 2 pages.

1. **Home Page**: This page represents the login screen for the relying party's website. This page includes a button with the text, "Sign in with MOSIP". On the click this button, the user gets redirected to the MOSIP's Esignet Portal. The user now has to authenticate and provide consent to share information from MOSIP to relying party, on the Esignet portal.

2. **User Profile Page**: This page shows the user profile on the relying party's website. On successful authentication and consent approval, the user gets navigated to this page with an Auth Code. This Auth Code would be shared with the relying party's backend service via the `/fetchUserInfo` endpoint. The backend then uses the Auth Code to fetch the access token and user details from MOSIP Esignet services.

## Build & run (for developers)

The application run on PORT=5000 by default.

- Env variables

  - ESIGNET_UI_BASE_URL: MOSIP ESIGNET UI URL (Example:https://esignet.dev.mosip.net/)
  - MOCK_RELYING_PARTY_SERVER_URL: This will be internally resolved to Mock relying party server by internal nginx (Example:http://esignet.dev.mosip.net/mock-relying-party-server)
  - REDIRECT_URI: Value that needs to be passed into authorize redirect_uri parameter (Example:https://health-services.com/userprofile)
  - CLIENT_ID: Relying Party client Id, that is registered with MOSIP (Example:health-services)
  - ACRS: Value that needs to be passed into authorize acr_values parameter (Example:mosip:esignet:acr:generated-code)
  - SIGN_IN_BUTTON_PLUGIN_URL: sign-in button JS plugin URL
  - DISPLAY: ASCII string value that specifies how the Authorization Server displays the authentication and consent user interface pages to the end user. Allowed values: page popup touch wap
  - PROMPT: Space delimited case-sensitive list of ASCII string values that specifies whether the Authorization Server prompts the End-User for re-authentication and consent. Allowed values: none login consent select_account
  - GRANT_TYPE: Authorization code grant type.
  - MAX_AGE: Maximum Authentication Age. This specifies the allowable elapsed time in seconds since the last time the end user was actively authenticated by the OP.
  - CLAIMS_LOCALES: End-User's preferred languages and scripts for Claims being returned.
  - SCOPE_USER_PROFILE: Clients can request additional information or permissions via scopes. The openid scope is the only required scope.

- Build and run Docker for a service:

  - mock-relying-party-ui docker service depends on one variable

    1. artifactory-service URL : This url is used for fetching the language bundle in configure_start.sh file.

  - Update the proxy_pass of all locations with the correct URL of mock-relying-party-service in the nignx/nginx.conf file. For example
    ```
    location /mock-relying-party-service/fetchUserInfo {
      proxy_pass         http://<local-ip-address>:8888/mock-relying-party-service/fetchUserInfo;
      proxy_redirect     off;
      .
      .
      .
    }
    ```
  Docker commands
  ```
  $ docker build -t <dockerImageName>:<tag> .
  $ docker run -it -d -p 5000:5000 -e ESIGNET_UI_BASE_URL='http://localhost:3000' -e MOCK_RELYING_PARTY_SERVER_URL=http://localhost:8888 -e  REDIRECT_URI=http://localhost:5000/userprofile -e CLIENT_ID=healthservices -e SCOPE="openid%20profile" -e SIGN_IN_BUTTON_PLUGIN_URL="http://127.0.0.1:5500/sign-in-with-esignet/dist/iife/index.js" <dockerImageName>:<tag>
  ```

  To host mock relying party ui on a context path:
  1. Remove the location path with `/` in the nignx file and add the location with context path as below.
    ```
    location /healthservices {
       alias /usr/share/nginx/healthservices;
       try_files $uri $uri/ /healthservices/index.html;
    }
    ```
  2. Provide the context path in the env variable `MOCK_RP_UI_PUBLIC_URL` during docker run.
  ```
  $ docker build -t <dockerImageName>:<tag> .
  $ docker run -it -d -p 3000:3000 -e MOCK_RP_UI_PUBLIC_URL='healthservices' <dockerImageName>:<tag>

  # The UI will be hosted on http://<domain>/healthservices
  ```

- Build and run on local system:
  Update "/mock-relying-party-ui/public/env-config.js" file according to the requirements
  ```
  $ npm start
  ```
