# Partner Onboarder

## Overview
Uploads certificate for default partners. Refer [mosip-onboarding repo](https://github.com/mosip/mosip-onboarding).

## Install 
* Set `values.yaml` to run onboarder for specific modules.
* run `./install.sh`.
```
./install.sh
```
# Troubleshootings

* After completion of the job, a very detailed `html report` is prepared and stored in Minio inside onboarding bucket.

### Troubleshooting

 1. KER-ATH-401: Authentication Failed
 
    Resolution: Update secretkey for mosip-deployment-client.
 
 2. Certificate dates are not valid

    Resolution: Check grace period in configuration.
 
 3. Upload of certificate will not be allowed to update other domain certificate
 
    Resolution: Expected when we try to upload `ida-cred` certificate twice. It can be ignored as the certificate is already present.



