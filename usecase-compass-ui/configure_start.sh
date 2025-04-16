#!/bin/sh

cat <<EOF > /usr/share/nginx/html/env.config.js
window._env_ = {
  KEYCLOAK_URL: "${KEYCLOAK_URL}",
  KEYCLOAK_REALM: "${KEYCLOAK_REALM}",
  KEYCLOAK_CLIENT_ID: "${KEYCLOAK_CLIENT_ID}",
  BASE_URL: "${BASE_URL}",
  VALID_ADMIN_ROLE: "${VALID_ADMIN_ROLE}",
};
EOF

exec "$@"