#!/bin/bash
# Installs esignet mock-relying-party service helm
## Usage: ./install.sh [kubeconfig]

if [ $# -ge 1 ] ; then
  export KUBECONFIG=$1
fi

function installing_mock-relying-party-service() {

  while true; do
    read -p "Do you want to install mock relying party service? (y/n): " response
    if [[ "$response" == "y" || "$response" == "Y" ]]; then
      break
    elif [[ "$response" == "n" || "$response" == "N" ]]; then
      exit
    else
      echo "Not a correct response. Please respond with y (yes) or n (no)."
    fi
  done

  helm repo add mosip https://mosip.github.io/mosip-helm
  helm repo update

  NS=esignet
  CHART_VERSION=0.11.1-develop

  echo Create $NS namespace
  kubectl create ns $NS || true

  echo Istio label
  kubectl label ns $NS istio-injection=enabled --overwrite

  echo "Do you have public domain & valid SSL? (Y/n) "
  echo "Y: if you have public domain & valid ssl certificate"
  echo "n: If you don't have a public domain and a valid SSL certificate. Note: It is recommended to use this option only in development environments."
  read -p "" flag

  if [ -z "$flag" ]; then
    echo "'flag' was provided; EXITING;"
    exit 1;
  fi
  ENABLE_INSECURE=''
  if [ "$flag" = "n" ]; then
    ENABLE_INSECURE='--set enable_insecure=true';
  fi

  ESIGNET_HOST=$(kubectl -n $NS get cm esignet-global -o jsonpath={.data.mosip-esignet-host})
  DEFAULT_ESIGNET_SERVICE_URL='http://esignet.esignet/v1/esignet'
  read -p "Please provide Esignet service url : ( default: http://esignet.esignet/v1/esignet )" USER_PROVIDED_ESIGNET_SERVICE_URL
  ESIGNET_SERVICE_URL=${USER_PROVIDED_ESIGNET_SERVICE_URL:-$DEFAULT_ESIGNET_SERVICE_URL}

  echo Installing Mock Relying Party Service
  helm -n $NS install mock-relying-party-service mosip/mock-relying-party-service \
    --set mock_relying_party_service.ESIGNET_SERVICE_URL="$ESIGNET_SERVICE_URL" \
    --set mock_relying_party_service.ESIGNET_AUD_URL="https://$ESIGNET_HOST/v1/esignet/oauth/v2/token" \
    --version $CHART_VERSION $ENABLE_INSECURE \
    -f values.yaml --wait

  kubectl -n $NS get deploy mock-relying-party-service -o name |  xargs -n1 -t  kubectl -n $NS rollout status

  echo Installed mock-relying-party-service service
  return 0
}

# set commands for error handling.
set -e
set -o errexit   ## set -e : exit the script if any statement returns a non-true return value
set -o nounset   ## set -u : exit the script if you try to use an uninitialised variable
set -o errtrace  # trace ERR through 'time command' and other functions
set -o pipefail  # trace ERR through pipes
installing_mock-relying-party-service   # calling function
