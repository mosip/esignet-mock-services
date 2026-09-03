# Partner Onboarder
## Overview
Onboards a Mock Relying Party as an OIDC partner by exchanging certificates with eSignet, using the [partner-onboarder Helm chart](https://github.com/mosip/mosip-onboarding). Runs as a Helm-managed Kubernetes Job.
## Prerequisites
* Access to a cluster with `esignet` deployed (default namespace: `esignet`, override with `$MOCK_RP_NS`).
* A `keycloak` namespace containing:
    * ConfigMap `keycloak-env-vars`
    * Secret `keycloak`
    * Secret `keycloak-client-secrets`
  These are copied into the target namespace automatically during install.
* Either:
    * S3 bucket credentials (host, region, bucket, access key, secret key), **or**
    * An NFS server + path
  for storing the onboarding HTML reports.
* `values.yaml` configured under `onboarding.propertiesOverride.mock-rp-oidc` — at minimum set:
    * `LOGO_URI`, `REDIRECT_URIS` for your relying party
    * `URL`, `AUTHMANAGER_URL`, `PMS_URL`, `KEYCLOAK_URL`, `EXTERNAL_URL` for your environment
    * `KEYCLOAK_ADMIN_USERNAME` / `KEYCLOAK_ADMIN_PASSWORD`
    * `KEYCLOAK_CLIENT_SECRET`
    * `mosip_pms_client_secret`
    * `MOSIP_ID` — set to `"true"` only if the MOSIP ID plugin is enabled on your eSignet deployment.

### `values.yaml` reference — `propertiesOverride.mock-rp-oidc`

Edit this block and re-run the onboarder Job to change any of these values.

```yaml
propertiesOverride:
  mock-rp-oidc:
    POLICY_NAME: mpolicy-default-mock-rp-oidc
    POLICY_GROUP_NAME: mpolicygroup-default-mock-rp-oidc
    PARTNER_KC_USERNAME: mpartner-default-mock-rp-oidc
    PARTNER_MANAGER_USERNAME: mock-rp-oidc-kc-mockusername
    PARTNER_MANAGER_PASSWORD: mock-rp-oidc-kc-mockuserpassword
    OIDC_CLIENTID: default-non-mosipid-oidc-client
    OIDC_CLIENT_NAME: "Health service OIDC Client"
    # Set MOSIP_ID to true when the MOSIP plugin is used.
    MOSIP_ID: "false"
    # Set the LOGO_URI and REDIRECT_URIS before installation.
    LOGO_URI: https://healthservices.sandbox.mosip.net/logo.png
    # REDIRECT_URIS: if you need more than 1 value, use comma separated values with NO spaces within "" (e.g. "https://a.com/cb,https://b.com/cb")
    REDIRECT_URIS: https://healthservices.sandbox.mosip.net/userprofile
    URL: https://api-internal.sandbox.mosip.net
    AUTHMANAGER_URL: https://api-internal.sandbox.mosip.net
    PMS_URL: https://api-internal.sandbox.mosip.net
    KEYCLOAK_URL: https://iam.sandbox.mosip.net
    EXTERNAL_URL: https://esignet.sandbox.mosip.net
    KEYCLOAK_ADMIN_USERNAME: admin
    KEYCLOAK_ADMIN_PASSWORD: keycloak password
    KEYCLOAK_CLIENT_SECRET: keycloak deployment client secret
    mosip_pms_client_secret: pms client secret
```

| Key | Description |
|---|---|
| `POLICY_NAME` | Name of the policy created/used for this OIDC partner. |
| `POLICY_GROUP_NAME` | Policy group the above policy belongs to. |
| `PARTNER_KC_USERNAME` | Keycloak username registered for the partner. |
| `PARTNER_MANAGER_USERNAME` / `PARTNER_MANAGER_PASSWORD` | Credentials for the partner manager account used during onboarding. |
| `OIDC_CLIENTID` | Client ID registered with eSignet for this OIDC relying party. |
| `OIDC_CLIENT_NAME` | Display name for the OIDC client. |
| `MOSIP_ID` | Set to `"true"` only if the MOSIP ID plugin is enabled on your eSignet deployment; otherwise leave `"false"`. |
| `LOGO_URI` | Logo URL shown for the relying party on the eSignet login/consent screen. **Must be set before install.** |
| `REDIRECT_URIS` | Allowed OIDC redirect URI(s) for the relying party. Multiple values must be comma-separated with **no spaces**, wrapped in quotes. **Must be set before install.** |
| `URL` | Base internal API URL for your MOSIP environment. |
| `AUTHMANAGER_URL` | Auth manager service URL for your environment. |
| `PMS_URL` | Partner management service URL for your environment. |
| `KEYCLOAK_URL` | Keycloak (IAM) base URL for your environment. |
| `EXTERNAL_URL` | Public-facing eSignet URL for your environment. |
| `KEYCLOAK_ADMIN_USERNAME` / `KEYCLOAK_ADMIN_PASSWORD` | Keycloak admin credentials used to create the OIDC client. |
| `KEYCLOAK_CLIENT_SECRET` | Secret for the Keycloak deployment client. |
| `mosip_pms_client_secret` | Client secret for the PMS (Partner Management Service). |

## Install
Run:
    ./install.sh [kubeconfig]
`kubeconfig` is optional — if provided, it's exported as `KUBECONFIG` before running.
The script will prompt you interactively for:
1. **Public domain & valid SSL?** — answer `n` if you don't have one; this sets `ENABLE_INSECURE=true` in the onboarding configmap.
2. **Update existing live deployment?** — answer `y` to patch the mock relying party's private-key secret, restart `$MOCK_RELYING_PARTY_SERVICE_NAME`, and update `$MOCK_RELYING_PARTY_UI_NAME`'s `CLIENT_ID`. Leave blank/`N` for a one-off or test onboard that shouldn't touch anything already running.
3. **Is `values.yaml` configured correctly?** — confirms you've completed the Prerequisites step above.
4. **S3 or NFS for reports?** — provide S3 credentials, or fall back to an NFS mount if you decline S3.
5. **Is eSignet deployed with default plugins? / MOSIP ID plugin?** — determines the `mosipid` Helm value.

The script then:
* Creates the `esignet` namespace if it doesn't exist.
* Disables Istio injection on that namespace.
* Copies the required Keycloak configmap/secrets from the `keycloak` namespace.
* Installs the `esignet-mock-rp-onboarder` Helm release using `values.yaml` plus the values collected above, and waits for the Job to complete.
* Restarts `$MOCK_RELYING_PARTY_SERVICE_NAME` if you opted to sync the live deployment.
* Deletes the temporary `mock-rp-oidc` properties configmap created for the run.

### Environment variable overrides
| Variable | Default |
|---|---|
| `MOCK_RP_NS` | `esignet` |
| `MOCK_RELYING_PARTY_SERVICE_NAME` | `mock-relying-party-service` |
| `MOCK_RELYING_PARTY_UI_NAME` | `mock-relying-party-ui` |

## Troubleshooting
* Once the onboarder Job completes, a detailed HTML report is generated and stored in the configured S3 bucket / NFS directory. Check it to confirm the partner onboarded successfully.
### Commonly found issues
1. **KER-ATH-401: Authentication Failed**
   Resolution: Provide the correct secret key for `mosip-deployment-client`.
2. **KER-KMS-021: The PARTNER Certificate validity is less than required minimum validity**
   Resolution: Check with your admin about adding a grace period in configuration or regenerating the keys.
   