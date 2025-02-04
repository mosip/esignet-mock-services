#!/bin/bash
# Script to initialize mockidentitysystem DB.
## Usage: ./init_db.sh [kubeconfig]

# set commands for error handling.
set -e
set -o errexit   ## set -e : exit the script if any statement returns a non-true return value
set -o nounset   ## set -u : exit the script if you try to use an uninitialised variable
set -o errtrace  # trace ERR through 'time command' and other functions
set -o pipefail  # trace ERR through pipes

if [ $# -ge 1 ] ; then
  export KUBECONFIG=$1
fi

NS=mockid
CHART_VERSION=0.0.1-develop

helm repo add mosip https://mosip.github.io/mosip-helm
helm repo update

kubectl create ns $NS || true

echo "Initialising mosip_mockidentitysystem DB"
echo "1. Setup mosip_mockidentitysystem DB in esignet postgres server."
echo "2. Setup mosip_mockidentitysystem DB in different postgres server"
while true; do
    read -p "Please enter one of the above option: " option
    if [ $option = "1" ]
      then
        DB_USER_PASSWORD=$( kubectl -n esignet get secrets db-common-secrets -o jsonpath={.data.db-dbuser-password} | base64 -d )

        echo Removing existing mosip_mockidentitysystem DB installation
        helm -n $NS delete postgres-init-mockidentitysystem || true
        kubectl -n $NS delete --ignore-not-found=true secret db-common-secrets

        echo Copy Postgres secrets
        ../copy_cm_func.sh secret postgres-postgresql esignet $NS

        echo Initializing DB
        helm -n $NS install postgres-init-mockidentitysystem mosip/postgres-init -f init_values.yaml \
        --version $CHART_VERSION \
        --set dbUserPasswords.dbuserPassword="$DB_USER_PASSWORD" \
        --wait --wait-for-jobs
        echo "DB initialised sucessfully. Creating DB config map"
        kubectl apply -f postgres-config.yaml
        break
    elif [ $option = "2" ]
      then
        echo "Skipping DB setup in esignet postgres server"
        python3 generate-secret-cm.py # Ensure python3 is installed and generate-secret-cm.py is present.
        DB_HOST=$( kubectl -n $NS get cm mockid-postgres-config -o jsonpath={.data.postgres-host} )
        DB_PORT=$( kubectl -n $NS get cm mockid-postgres-config -o jsonpath={.data.postgres-host} )
        DB_USER_PASSWORD=$( kubectl -n $NS get secrets db-common-secrets -o jsonpath={.data.db-dbuser-password} | base64 -d )
        echo Removing existing mosip_mockidentitysystem DB installation
        helm -n $NS delete postgres-init-mockidentitysystem || true
        kubectl -n $NS delete --ignore-not-found=true secret db-common-secrets
        echo Initializing DB
        helm -n $NS install postgres-init-mockidentitysystem mosip/postgres-init -f init_values.yaml \
        --version $CHART_VERSION \
        --set database.mosip_mockidentitysystem.host=$DB_HOST \
        --set database.mosip_mockidentitysystem.port=$DB_PORT \
        --set dbUserPasswords.dbuserPassword="$DB_USER_PASSWORD" \
        --wait --wait-for-jobs
        echo "DB initialised sucessfully."
        break
    else
        echo "Please provide a correct option (1 or 2)"
    fi
done
