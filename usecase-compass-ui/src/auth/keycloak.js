import Keycloak from "keycloak-js";

const keycloak = new Keycloak({
  url: window._env_.KEYCLOAK_URL, // Your Keycloak server URL
  realm: window._env_.KEYCLOAK_REALM,
  clientId: window._env_.KEYCLOAK_CLIENT_ID,
});

export default keycloak;