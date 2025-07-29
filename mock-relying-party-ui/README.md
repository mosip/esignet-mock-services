# Mock Relying Party UI

This React application serves as the UI for the Mock Relying Party Portal.

## Overview

This repository contains a reference implementation of a relying party portal that demonstrates the use of [MOSIP's Esignet (Identity Provider) services](https://github.com/mosip/esignet) to log users into the portal.

The portal uses [OpenID specs](https://openid.net/specs/openid-connect-core-1_0.html) to communicate with [MOSIP Esignet Services](https://github.com/mosip/esignet).

This portal contains 2 pages:

1. **Home Page**: This page acts as the login screen for the relying party’s website. It includes a "Sign in with MOSIP" button. Upon clicking the button, the user is redirected to the MOSIP Esignet portal to authenticate and provide consent to share their information with the relying party.

2. **User Profile Page**: This page displays the user profile on the relying party’s website. After successful authentication and consent approval, the user is redirected here with an authorization code. This code is sent to the relying party’s backend service via the `/fetchUserInfo` endpoint, which uses the auth code to fetch an access token and user details from MOSIP Esignet services.

## Build & run (for developers)

The application runs by default on PORT=5000.

- Environment Variables:

  - ESIGNET_UI_BASE_URL: MOSIP ESIGNET UI URL
    (Example:https://esignet.dev.mosip.net/)
  - MOCK_RELYING_PARTY_SERVER_URL: Internally resolved to the mock relying party server via internal NGINX
    (Example:http://esignet.dev.mosip.net/mock-relying-party-server)
  - REDIRECT_URI: Redirect URI passed as a parameter in the authorization request
    (Example:https://health-services.com/userprofile)
  - CLIENT_ID: Relying party client ID registered with MOSIP (Example:health-services)
  - ACRS: Passed in the `acr_values` parameter in the authorization request (Example:mosip:esignet:acr:generated-code)
  - PRIVATE_KEY: Private key corresponding to the relying party’s registered public key
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

- Build and run Docker for a service:

  ```
  $ docker build -t <dockerImageName>:<tag> .
  $ docker run -it -d -p 5000:5000 -e ESIGNET_UI_BASE_URL='http://localhost:3000' -e MOCK_RELYING_PARTY_BASE_URL=http://localhost:8888 -e REDIRECT_URI=http://localhost:5000/userprofile -e CLIENT_ID=healthservices -e ACRS="mosip:esignet:acr:static-code" -e MAX_AGE=21 -e DISPLAY=page -e PROMPT=consent -e GRANT_TYPE=authorization_code -e SIGN_IN_BUTTON_PLUGIN_URL='http://127.0.0.1:5500/dist/iife/index.js' -e SCOPE_USER_PROFILE='openid%20profile%20resident-service' -e PRIVATE_KEY='-----BEGIN PRIVATE KEY-----\nMIIEvQIBADANBgkqhkiG9w0BAQEFAASCBKcwggSjAgEAAoIBAQCoUPbvrrOxtxAt\nR2rCmSrSjZjyvpLklB8wxCqWQJ5wuvw1j7SEvMFds9QeYpomO/GVZNYGbWuBwQEG\nWdBll9ZdI02H5hjNzZi3SFcv+N+OHFh5RHNnkeLtIuA684BJHkJNL19LcQlb+u1G\nWeqyPCk3rdDNPZYBJBcS4i1BF3SF2gW9nsvxS+xOB12l1Dubntfs1AXhSgZvy5oe\nhgJIDhy7BbqJEJPfbcOAQE8GlnjxjSY3Ja0m9YD2MT3V93DSz0OLyLQjnMs+FJQc\nRpFDupHSSa3QerEXwxqHmXyH0RZJmH1oZizdEImdgXRjgfy98a6ZwU2p43WSg1LR\nrIZU+HC7AgMBAAECggEAAnaE1ocI7B3Qp8j2v/g7zy7xQQQW5C9isXT9Zot1hhLG\nZAZBTvvwHG3oObWZqduQsm3yT8/EFfb8C9q+mO363gwJM2bjkAdlJ7FwTSxoIQ07\nIjMlOSvCVVQAUfyEMQ23TKfXziPOTkFCvZfNPmRw+faaKpavHj8n80fJ/7zXIKpE\n/Z7+izLhGmos7LgofZRqxYMcq6RznR7w9FQPsdnspC3EPudrwV+HBAEuqOMfN+Zs\n2bVqKbOz0z8WzQ7K1+bhX93flBqlO3lVNXHK+Oov3DmTG4SIxaim30vM5oijaD+q\nsXYq1r34GRtcEZ26qx3iCdFd5o9sBgA6EMQ8iOWfMQKBgQDUT87IQWNPBBzWoANf\nKR4iR4wc9f4O1uZFnJ5Ec8EBscUvccYErQ3YHxcmycpbLWRijgNnCYsDXVU7uFsm\no7pV1Qn95o8TDHbr+F/mmKq/UMuMjvUmZc93pKMADlsw7aXRHlzuggIH2nAkRUi3\nrCYdmrXWwTyJ8f0cFIlS/EQAaQKBgQDK845NT/ZqOUqJdAq7aoTjC41ER6CFMSxR\nO215g8kaeYbnRlzNcyqxk9PTEEadoHvZyAdYxRfdLU22zE0ImN2Y5Jfi0wRJYT+C\nj3q1sORezw65qB/CKwgMnE9Tiu9fHbrlpeb+lIBEnIFiAoPwOOOMzhXzUxOtlT7r\n/v4Dy3MDgwKBgQCtat7Rba+LTCWuHZeDdBd8Eorc4QV644fFlm8kJJSjKKyS21DO\nYvgq7wI/GZZjMUmMwsj+sanNvr+u/x/dCOFb2J7HuDpnacf9aKwUs+DMUldg4ShX\nC9QRuvW1RwSvi33kuPNZkfHMrlzpE3qZJFEh30vmNYKYfoOrGw8sLIfy+QKBgHGU\nTo478vbNq0YzmBH88fOyslOFFnOT6m5nqMO5miFj47io6yTbkAgjaAeV8z8h4k4m\nIN5wJwPT58smmPH3wwRe4hXB7IM4lnd13sGyBox8qowCaAudU3rjO43QklgT5lXB\nO/47k3FSeSIlsDsPS2GwsB4l3zxk6vreEMCE6pALAoGAZ6vITL4uljwBE3Wv+czJ\nEYiOzmnRLK3TwcNx2E1i4gLi8Fj2NUtXAU2BXEa9oW8Zh+b95X0GjgLJamjZi1cH\nU9ByKn/LBzASbvK5q2fLEsOWWigAUKfO6ecmc8MVniS4GJ+WGsUHcsC3usO4clm0\nWxOiTQVUZ7xZxXwy6DOFLFg=\n-----END PRIVATE KEY-----' <dockerImageName>:<tag>
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
