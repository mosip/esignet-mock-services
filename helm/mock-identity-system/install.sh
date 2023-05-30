#!/bin/sh
# Installs all esignet helm charts
## Usage: ./install.sh [kubeconfig]

if [ $# -ge 1 ] ; then
  export KUBECONFIG=$1
fi

NS=esignet
CHART_VERSION=0.9.0

echo Create $NS namespace
kubectl create ns $NS

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
