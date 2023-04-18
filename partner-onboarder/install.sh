#!/bin/bash
# Onboards default partners 
## Usage: ./install.sh [kubeconfig]

if [ $# -ge 1 ] ; then
  export KUBECONFIG=$1
fi

echo "Do you have public domain & valid SSL? (Y/n) "
echo "Y: if you have public domain & valid ssl certificate"
echo "n: if you don't have public domain & valid ssl certificate"
read -p "" flag

if [ -z "$flag" ]; then
  echo "'flag' was provided; EXITING;"
  exit 1;
fi
ENABLE_INSECURE=''
if [ "$flag" = "n" ]; then
  ENABLE_INSECURE='--set onboarding.configmaps.onboarding.ENABLE_INSECURE=true';
fi

NS=esignet
CHART_VERSION=12.0.2

echo Create $NS namespace
kubectl create ns $NS

function installing_onboarder() {

  read -p "Is values.yaml for onboarder chart set correctly as part of Pre-requisites?(Y/n) " yn;
  if [ $yn = "Y" ]; then
    echo Istio label
    kubectl label ns $NS istio-injection=disabled --overwrite
    helm repo update

    echo Copy configmaps
    kubectl -n $NS --ignore-not-found=true delete cm s3
    sed -i 's/\r$//' copy_cm.sh
    ./copy_cm.sh
    kubectl -n $NS delete cm --ignore-not-found=true onboarding

    echo Copy secrets
    sed -i 's/\r$//' copy_secrets.sh
    ./copy_secrets.sh

    read -p "Provide onboarder bucket name : " s3_bucket
    if [[ -z $s3_bucket ]]; then
      echo "s3_bucket not provided; EXITING;";
      exit 1;
    fi
    if [[ $s3_bucket == *[' !@#$%^&*()+']* ]]; then
      echo "s3_bucket should not contain spaces / any special character; EXITING";
      exit 1;
    fi
    read -p "Provide onboarder s3 bucket region : " s3_region
    if [[ $s3_region == *[' !@#$%^&*()+']* ]]; then
      echo "s3_region should not contain spaces / any special character; EXITING";
      exit 1;
    fi

    read -p "Provide S3 URL : " s3_url
    if [[ -z $s3_url ]]; then
      echo "s3_url not provided; EXITING;"
      exit 1;
    fi

    s3_user_key=$( kubectl -n s3 get cm s3 -o json | jq -r '.data."s3-user-key"' )

    echo Onboarding default partners
    helm -n $NS install esignet-demo-oidc-partner-onboarder mosip/partner-onboarder \
    --set onboarding.configmaps.s3.s3-host="$s3_url" \
    --set onboarding.configmaps.s3.s3-user-key="$s3_user_key" \
    --set onboarding.configmaps.s3.s3-region="$s3_region" \
    --set onboarding.configmaps.s3.s3-bucket-name="$s3_bucket" \
    $ENABLE_INSECURE \
    -f values.yaml \
    --version $CHART_VERSION \
    --wait --wait-for-jobs

    private_public_key_pair=$(kubectl logs -n $NS job/esignet-demo-oidc-partner-onboarder-demo-oidc | grep -Pzo "(?s)Private and Public KeyPair:\s*\K.*?(?=\s*mpartner default demo OIDC clientId:)" | tr -d '\0' | tr -d '\n')
    echo Encoded Private and Public Key Pair: $private_public_key_pair
    kubectl patch secret mock-relying-party-service-secrets -n $NS -p '{"data":{"client-private-key":"'$(echo -n "$private_public_key_pair" | base64 | tr -d '\n')'"}}'
    kubectl rollout restart deployment -n esignet mock-relying-party-service
    demo_oidc_clientid=$(kubectl logs -n $NS job/esignet-demo-oidc-partner-onboarder-demo-oidc | grep "mpartner default demo OIDC clientId:" | awk '{sub("clientId:", ""); print $5}')
    echo mpartner default demo OIDC clientId is: $demo_oidc_clientid
    kubectl -n esignet set env deployment/mock-relying-party-ui CLIENT_ID=$demo_oidc_clientid


    echo "Reports are moved to S3 under onboarder bucket"
    echo "Please follow the steps as mentioned in the document link below to configure mock-relying-party-partner:"
    BRANCH_NAME=$(git symbolic-ref --short HEAD)
    GITHUB_URL="https://github.com/mosip/esignet-mock-services/blob"
    FILE_PATH="/README.md"
    FULL_URL="$GITHUB_URL/$BRANCH_NAME$FILE_PATH#configuration"


    echo -e  "\e[1m\e[4m\e[34m\e]8;\a$FULL_URL\e[0m\e[24m\e]8;;\a"

    echo -e "\e[1mHave you completed the changes mentioned in the onboarding document? (y/n)\e[0m"
    read answer

    if [[ "$answer" =~ [yY](es)* ]]; then
      echo -e "\e[1m\e[32mPartners onboarded successfully.\e[0m"
    else
      echo -e "\e[1m\e[31mPartner onboarding steps are pending. Please complete the configuration steps for onboarding partner.\e[0m"
    fi
    return 0
  fi
}

# set commands for error handling.
set -e
set -o errexit   ## set -e : exit the script if any statement returns a non-true return value
set -o nounset   ## set -u : exit the script if you try to use an uninitialised variable
set -o errtrace  # trace ERR through 'time command' and other functions
set -o pipefail  # trace ERR through pipes
installing_onboarder   # calling function
