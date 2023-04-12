#!/bin/sh
# Restart the esignet services

if [ $# -ge 1 ] ; then
  export KUBECONFIG=$1
fi

NS=esignet
kubectl -n $NS rollout restart deploy mock-relying-party-ui

kubectl -n $NS  get mock-relying-party-ui deploy -o name |  xargs -n1 -t  kubectl -n $NS rollout status

echo Retarted mock-relying-party-ui services
