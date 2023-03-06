#!/bin/sh
# Restarts the esignet mock service
## Usage: ./restart.sh [kubeconfig]1111


if [ $# -ge 1 ] ; then
  export KUBECONFIG=$1
fi

NS=esignet
kubectl -n $NS rollout restart deploy mock-relying-party-service mock-relying-party-ui

kubectl -n $NS get deploy mock-relying-party-service mock-relying-party-ui -o name |  xargs -n1 -t  kubectl -n $NS rollout status

echo Retarted mock relying party service & mock relying party ui
