#!/bin/bash
# Uninstalls all esignet mock service helm charts
## Usage: ./delete-mock.sh [kubeconfig]

if [ $# -ge 1 ] ; then
  export KUBECONFIG=$1
fi

ROOT_DIR=`pwd`

function deleting_mock() {

  declare -a module=("mock-identity-system"
                     "mock-relying-party-service"
                     "mock-relying-party-ui"
                    )

  echo Installing esignet mock services

  for i in "${module[@]}"
  do
    cd $ROOT_DIR/"$i"
    ./delete.sh
  done

  echo All esignet mock services deleted sucessfully.
  return 0
}

# set commands for error handling.
set -e
set -o errexit   ## set -e : exit the script if any statement returns a non-true return value
set -o nounset   ## set -u : exit the script if you try to use an uninitialised variable
set -o errtrace  # trace ERR through 'time command' and other functions
set -o pipefail  # trace ERR through pipes
deleting_mock   # calling function

