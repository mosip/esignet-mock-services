#!/bin/sh
# Restart the esignet services

if [ $# -ge 1 ] ; then
  export KUBECONFIG=$1
fi

NS=esignet
kubectl -n $NS rollout restart deploy mock-relying-party-service

kubectl -n $NS  get mock-relying-party-service deploy -o name |  xargs -n1 -t  kubectl -n $NS rollout status

echo Retarted mock-identity-system services
