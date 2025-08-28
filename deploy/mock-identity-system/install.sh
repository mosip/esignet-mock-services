#!/bin/bash
# Installs esignet mock identity helm chart
## Usage: ./install.sh [kubeconfig]

if [ $# -ge 1 ] ; then
  export KUBECONFIG=$1
fi

NS=mockid
CHART_VERSION=0.11.2

echo Create $NS namespace
kubectl create ns $NS

function installing_mock-identity-system() {
  echo Istio label
  helm repo add mosip https://mosip.github.io/mosip-helm
  helm repo update

  echo Istio label
  kubectl label ns $NS istio-injection=enabled --overwrite

  while true; do
    read -p "Do you want to install mock identity service? (y/n): " response
    if [[ "$response" == "y" || "$response" == "Y" ]]; then
      break
    elif [[ "$response" == "n" || "$response" == "N" ]]; then
      exit
    else
      echo "Not a correct response. Please respond with y (yes) or n (no)."
    fi
  done


  while true; do
    read -p "Is Prometheus Service Monitor Operator deployed in the k8s cluster? (y/n): " response
    if [[ "$response" == "y" || "$response" == "Y" ]]; then
      servicemonitorflag=true
      break
    elif [[ "$response" == "n" || "$response" == "N" ]]; then
      servicemonitorflag=false
      break
    else
      echo "Not a correct response. Please respond with y (yes) or n (no)."
    fi
  done

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

  ../copy_cm_func.sh secret softhsm-mock-identity-system softhsm $NS
  ../copy_cm_func.sh configmap softhsm-mock-identity-system-share softhsm $NS
  ../copy_cm_func.sh configmap esignet-global esignet $NS
  ../copy_cm_func.sh configmap redis-config redis $NS
  ../copy_cm_func.sh secret redis redis $NS

  echo Installing mock-identity-system
  helm -n $NS install mock-identity-system mosip/mock-identity-system --set metrics.serviceMonitor.enabled=$servicemonitorflag --version $CHART_VERSION $ENABLE_INSECURE -f values.yaml --wait

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
