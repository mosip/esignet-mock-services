#!/bin/bash
# Installs mock relying party onboarder OIDC helm
## Usage: ./install.sh [kubeconfig]

if [ $# -ge 1 ] ; then
  export KUBECONFIG=$1
fi

echo "Do you have public domain & valid SSL? (Y/n) "
echo "Y: if you have public domain & valid ssl certificate"
echo "n: if you don't have public domain & valid ssl certificate"
read -p "" flag

if [ -z "$flag" ]; then
  echo "'flag' was not provided; EXITING;"
  exit 1;
fi
ENABLE_INSECURE=''
if [ "$flag" = "n" ]; then
  ENABLE_INSECURE='--set onboarding.configmaps.onboarding.ENABLE_INSECURE=true';
fi

NS=esignet
CHART_VERSION=1.5.0-es-develop

echo Create $NS namespace
kubectl create ns $NS || true

function installing_onboarder() {

  read -p "Is values.yaml for onboarder chart set correctly as part of pre-requisites? (Y/n) : " yn;
  if [[ $yn = "Y" ]] || [[ $yn = "y" ]] ; then
    NFS_OPTION=''
    S3_OPTION=''
    config_complete=false  # flag to check if S3 or NFS is configured
    while [ "$config_complete" = false ]; do
      read -p "Do you have S3 details for storing Onboarder reports? (Y/n) : " ans
      if [[ "$ans" == "y" || "$ans" == "Y" ]]; then
        read -p "Please provide S3 host: " s3_host
        if [[ -z $s3_host ]]; then
          echo "S3 host not provided; EXITING;"
          exit 1;
        fi
        read -p "Please provide S3 region: " s3_region
        if [[ $s3_region == *[' !@#$%^&*()+']* ]]; then
          echo "S3 region should not contain spaces or special characters; EXITING;"
          exit 1;
        fi
        read -p "Please provide S3 bucket: " s3_bucket
        if [[ $s3_bucket == *[' !@#$%^&*()+']* ]]; then
          echo "S3 bucket should not contain spaces or special characters; EXITING;"
          exit 1;
        fi
        read -p "Please provide S3 access key: " s3_user_key
        if [[ -z $s3_user_key ]]; then
          echo "S3 access key not provided; EXITING;"
          exit 1;
        fi
        read -p "Please provide S3 secret key: " s3_secret_key
        if [[ -z $s3_secret_key ]]; then
          echo "S3 secret key not provided; EXITING;"
          exit 1;
        fi
        S3_OPTION="--set onboarding.configmaps.s3.s3-host=$s3_host --set onboarding.configmaps.s3.s3-user-key=$s3_user_key --set onboarding.configmaps.s3.s3-region=$s3_region --set onboarding.configmaps.s3.s3-bucket-name=$s3_bucket --set onboarding.secrets.s3.s3-user-secret=$s3_secret_key"
        push_reports_to_s3=true
        config_complete=true
      elif [[ "$ans" == "n" || "$ans" == "N" ]]; then
        push_reports_to_s3=false
        read -p "Since S3 details are not available, do you want to use NFS directory mount for storing reports? (y/n) : " answer
        if [[ $answer == "Y" ]] || [[ $answer == "y" ]]; then
          read -p "Please provide NFS Server IP: " nfs_server
          if [[ -z $nfs_server ]]; then
            echo "NFS server not provided; EXITING."
            exit 1;
          fi
          read -p "Please provide NFS directory to store reports from NFS server (e.g. /srv/nfs/mosip/onboarder/): " nfs_path
          if [[ -z $nfs_path ]]; then
            echo "NFS Path not provided; EXITING."
            exit 1;
          fi
          NFS_OPTION="--set onboarding.volumes.reports.nfs.server=$nfs_server --set onboarding.volumes.reports.nfs.path=$nfs_path"
          config_complete=true
        else
          echo "Please rerun the script with either S3 or NFS server details."
          exit 1;
        fi
      else
        echo "Invalid input. Please respond with Y (yes) or N (no)."
      fi
    done

    echo "Please select plugin details for esignet mock services..."
    echo "1. esignet-mock-plugin.jar"
    echo "2. mosip-identity-plugin.jar"
    echo "3. any other custom plugin"
    read -p "Enter the plugin number: " plugin_no
      while true; do
        if [[ "$plugin_no" == "1" ]]; then
          mosipid_option="--set onboarding.variables.mosipid=false"
          break
        elif [[ "$plugin_no" == "2" ]]; then
          mosipid_option="--set onboarding.variables.mosipid=true"
          break
        elif [[ "$plugin_no" == "3" ]]; then
          echo "Default Onboarder only support onboarding against Mosip and mock Identity"
          break
        else
          echo "please provide the correct plugin number (1 or 2 or 3)."
        fi
      done

    echo "Istio label"
    kubectl label ns $NS istio-injection=disabled --overwrite
    helm repo update

    echo "Copy configmaps"

    COPY_UTIL=../deploy/copy_cm_func.sh
    $COPY_UTIL configmap keycloak-env-vars keycloak $NS
    $COPY_UTIL configmap keycloak-host keycloak $NS

    $COPY_UTIL secret keycloak keycloak $NS
    $COPY_UTIL secret keycloak-client-secrets keycloak $NS

    echo "Onboarding Mock Relying Party OIDC client"
    helm -n $NS install esignet-mock-rp-onboarder mosip/partner-onboarder \
      $NFS_OPTION \
      $S3_OPTION \
      --set onboarding.variables.push_reports_to_s3=$push_reports_to_s3 \
      --set extraEnvVarsCM[0]=esignet-global \
      --set extraEnvVarsCM[1]=keycloak-env-vars \
      --set extraEnvVarsCM[2]=keycloak-host \
      $ENABLE_INSECURE \
      $mosipid_option \
      -f values.yaml \
      --version $CHART_VERSION \
      --wait --wait-for-jobs
    echo "Partner onboarder executed and reports are moved to S3 or NFS please check the same to make sure partner was onboarded sucessfully."
    kubectl rollout restart deployment mock-relying-party-service -n esignet
    return 0
  fi
}

# set commands for error handling.
set -e
set -o errexit   # exit the script if any statement returns a non-true return value
set -o nounset   # exit the script if you try to use an uninitialised variable
set -o errtrace  # trace ERR through 'time command' and other functions
set -o pipefail  # trace ERR through pipes
installing_onboarder   # calling function
