#!/bin/sh
# Uninstalls oidc-server oidc-ui
## Usage: ./delete.sh [kubeconfig]

if [ $# -ge 1 ] ; then
  export KUBECONFIG=$1
fi

NS=idp
while true; do
    read -p "Are you sure you want to delete oidc helm charts?(Y/n) " yn
    if [ $yn = "Y" ]
      then
        helm -n $NS delete oidc-server
        helm -n $NS delete oidc-ui
        break
      else
        break
    fi
done
