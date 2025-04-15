import Keycloak from "keycloak-js";
import keycloakDetails from "../../config.json"

const keycloak = new Keycloak({
  url: keycloakDetails.KEYCLOAK_URL, // Your Keycloak server URL
  realm: keycloakDetails.KEYCLOAK_REALM,
  clientId: keycloakDetails.KEYCLOAK_CLIENT_ID,
});

export default keycloak;