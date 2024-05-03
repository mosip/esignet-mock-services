#!/bin/bash
# Installs all esignet helm charts
## Usage: ./install.sh [kubeconfig]

if [ $# -ge 1 ] ; then
  export KUBECONFIG=$1
fi

NS=esignet
CHART_VERSION=0.0.1-develop

echo Create $NS namespace
kubectl create ns $NS

function installing_mock-identity-system() {
  echo "Copy configmaps"
  ./copy_cm.sh

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

  echo Installing mock-identity-system
  helm -n $NS install mock-identity-system mosip/mock-identity-system --version $CHART_VERSION $ENABLE_INSECURE

  kubectl -n $NS get deploy mock-identity-system -o name |  xargs -n1 -t  kubectl -n $NS rollout status

  echo Installed mock-identity-system service
  return 0
}

# set commands for error handling.
set -e
set -o errexit   ## set -e : exit the script if any statement returns a non-true return value
set -o nounset   ## set -u : exit the script if you try to use an uninitialised variable
set -o errtrace  # trace ERR through 'time command' and other functions
set -o pipefail  # trace ERR through pipes
installing_mock-identity-system   # calling function
