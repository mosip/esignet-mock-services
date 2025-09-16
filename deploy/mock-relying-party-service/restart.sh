#!/bin/bash
# Restarts esignet mock-relying-party service

if [ $# -ge 1 ] ; then
  export KUBECONFIG=$1
fi

function Restarting_mock-relying-party-service() {
  NS=esignet
  MOCK_REPLYING_PARTY_SERVICE_NAME=mock-relying-party-service
  kubectl -n $NS rollout restart deploy $MOCK_REPLYING_PARTY_SERVICE_NAME

  kubectl -n $NS  get $MOCK_REPLYING_PARTY_SERVICE_NAME deploy -o name |  xargs -n1 -t  kubectl -n $NS rollout status

  echo Retarted mock-relying-party-service
  return 0
}

# set commands for error handling.
set -e
set -o errexit   ## set -e : exit the script if any statement returns a non-true return value
set -o nounset   ## set -u : exit the script if you try to use an uninitialised variable
set -o errtrace  # trace ERR through 'time command' and other functions
set -o pipefail  # trace ERR through pipes
Restarting_mock-relying-party-service  # calling function
