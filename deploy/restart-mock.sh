#!/bin/bash
# Restarts the esignet mock service
## Usage: ./restart.sh [kubeconfig]


if [ $# -ge 1 ] ; then
  export KUBECONFIG=$1
fi

function Restarting_All() {
  NS=esignet
  MOCK_NS=mockid
  kubectl -n $NS rollout restart deploy mock-relying-party-service mock-relying-party-ui || true

  kubectl -n $MOCK_NS rollout restart deploy mock-identity-system || true

  kubectl -n $NS get deploy mock-identity-system mock-relying-party-service mock-relying-party-ui -o name |  xargs -n1 -t  kubectl -n $NS rollout status || true

  kubectl -n $MOCK_NS get deploy mock-identity-system -o name |  xargs -n1 -t  kubectl -n $NS rollout status || true

  echo Retarted mock relying party service & mock relying party ui & mock identity service
  return 0
}

# set commands for error handling.
set -e
set -o errexit   ## set -e : exit the script if any statement returns a non-true return value
set -o nounset   ## set -u : exit the script if you try to use an uninitialised variable
set -o errtrace  # trace ERR through 'time command' and other functions
set -o pipefail  # trace ERR through pipes
Restarting_All  # calling function
