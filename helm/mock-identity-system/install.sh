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

echo Installing mock-identity-system
helm -n $NS install mock-identity-system mosip/mock-identity-system --version $CHART_VERSION

kubectl -n $NS get deploy mock-identity-system -o name |  xargs -n1 -t  kubectl -n $NS rollout status

echo Installed mock-identity-system service
