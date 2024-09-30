#!/bin/bash
# Installs and initialises pre-requisites for esignet mock identity service helm charts
## Usage: ./install.sh [kubeconfig]

if [ $# -ge 1 ] ; then
  export KUBECONFIG=$1
fi

ROOT_DIR=`pwd`
NS=mockid
SOFTHSM_NS=softhsm
SOFTHSM_CHART_VERSION=12.0.1


function prereq_mockid () {
  echo Create $SOFTHSM_NS namespace
  kubectl create ns $SOFTHSM_NS || true

  echo Istio label
  kubectl label ns $SOFTHSM_NS istio-injection=enabled --overwrite
  helm repo add mosip https://mosip.github.io/mosip-helm
  helm repo update

  echo Installing Softhsm for mock-identity-system
  helm -n $SOFTHSM_NS install softhsm-mock-identity-system mosip/softhsm -f softhsm-values.yaml --version $SOFTHSM_CHART_VERSION --wait
  echo Installed Softhsm for mock-identity-system

  ./copy_cm_func.sh secret softhsm-mock-identity-system softhsm $NS
  ./copy_cm_func.sh configmap softhsm-mock-identity-system-share softhsm $NS

  echo "Initialise postgres with mock identity db creation"
  cd postgres
  ./init_db.sh

  echo All esignet mock identity services pre-requisites deployed sucessfully.
  return 0
}

function prereq_mockrp () {
  echo "Create secret for mock-relying-party-service-secrets and jwe-userinfo-private-key delete if exists"
  kubectl -n $NS delete --ignore-not-found=true secrets mock-relying-party-private-key-jwk
  kubectl -n $NS delete --ignore-not-found=true secrets jwe-userinfo-service-secrets
  kubectl -n $NS create secret generic mock-relying-party-private-key-jwk --from-literal=client-private-key='' --dry-run=client -o yaml | kubectl apply -f -
  kubectl -n $NS create secret generic jwe-userinfo-service-secrets --from-literal=JWE_USERINFO_PRIVATE_KEY='' --dry-run=client -o yaml | kubectl apply -f -
  return 0
}

function prereq () {
  while true; do
    read -p "Do you want to install and initialise pre-requisites for mock identity system? (y/n): " response
    if [[ "$response" == "y" || "$response" == "Y" ]]; then
      prereq_mockid
      break
    elif [[ "$response" == "n" || "$response" == "N" ]]; then
      break
    else
      echo "Not a correct response. Please respond with y (yes) or n (no)."
    fi
  done

  prereq_mockrp

  return 0
}

# set commands for error handling.
set -e
set -o errexit   ## set -e : exit the script if any statement returns a non-true return value
set -o nounset   ## set -u : exit the script if you try to use an uninitialised variable
set -o errtrace  # trace ERR through 'time command' and other functions
set -o pipefail  # trace ERR through pipes
prereq   # calling function
