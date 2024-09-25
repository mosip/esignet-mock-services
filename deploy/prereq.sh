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

function installing_All() {
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
