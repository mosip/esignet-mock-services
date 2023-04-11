#!/bin/sh
# Uninstalls all esignet helm charts
## Usage: ./delete.sh [kubeconfig]

if [ $# -ge 1 ] ; then
  export KUBECONFIG=$1
fi
NS=esignet
while true; do
    read -p "Are you sure you want to delete all mock-identity-system helm charts?(Y/n) " yn
    if [ $yn = "Y" ]
      then
        helm -n $NS delete mock-relying-party-service
        break
      else
        break
    fi
done
