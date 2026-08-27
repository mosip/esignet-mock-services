# AGENTS.md — partner-onboarder

Parent guide: [../AGENTS.md](../AGENTS.md)

## Purpose

Onboards the mock relying party as an OIDC partner with MOSIP by exchanging certificates, so
that the mock relying-party portal can be used against a non-production eSignet deployment
(identity plugin) — this repo is only for non-production use (per the root `README.md`), even
though `install.sh`/`values.yaml` accept inputs (public domains, certificates, S3/NFS config)
that could target a production-style cluster. See the [mosip-onboarding repo](https://github.com/mosip/mosip-onboarding) for the
underlying onboarding job this wraps. Only needed when the `mosip-identity` plugin is used
(per the root `README.md`).

## Layout

- `install.sh` — runs the onboarding job.
- `delete.sh` — removes the onboarding job/resources.
- `values.yaml` — Helm values controlling which modules the onboarder runs for.

## How to run

```shell
# edit values.yaml to select the modules to onboard, then:
./install.sh
```

Onboarding produces an HTML report, stored at the configured S3 bucket / NFS directory. Check
this report to confirm onboarding succeeded before assuming the job passed.

## Configuration

All configuration is via `values.yaml` (Helm values) — set it before running `install.sh`.

## Troubleshooting

(From this directory's `README.md`.)

- `KER-ATH-401: Authentication Failed` — provide the correct secret key for
  `mosip-deployment-client`.
- "Certificate dates are not valid" — check with the admin about adding a grace period in
  configuration.
- "Upload of certificate will not be allowed to update other domain certificate" — expected
  when re-uploading an `ida-cred` certificate a second time; the onboarding job should only run
  once, and this can be ignored if the cert is already present.

## Agent rules

### Do

1. Confirm `values.yaml` targets the correct namespace and module list before running
   `install.sh` against any shared cluster.
2. Check the generated HTML onboarding report after every run to confirm success — a
   completed job is not the same as a successful onboarding.

### Do not

1. Do not commit real `mosip-deployment-client` secret keys or certificates into `values.yaml`.
2. Do not re-run onboarding for an already-onboarded `ida-cred` certificate expecting a clean
   result — the "upload not allowed" error on a second run is expected, not a failure to fix.
