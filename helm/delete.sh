#!/bin/sh
# Uninstalls mock-relying-party-service and mock-relying-party-ui
## Usage: ./delete.sh [kubeconfig]

if [ $# -ge 1 ] ; then
  export KUBECONFIG=$1
fi

NS=esignet
while true; do
    read -p "Are you sure you want to delete esignet mock service helm charts?(Y/n) " yn
    if [ $yn = "Y" ]
      then
        helm -n $NS delete mock-relying-party-service
        helm -n $NS delete mock-relying-party-ui
	      helm -n $NS delete mock-identity-system
        break
      else
        break
    fi
done
