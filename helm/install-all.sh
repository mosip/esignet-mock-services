#!/bin/bash
# Installs all esignet mock service helm charts
## Usage: ./install.sh [kubeconfig]

if [ $# -ge 1 ] ; then
  export KUBECONFIG=$1
fi

ROOT_DIR=`pwd`
NS=softhsm
SOFTHSM_CHART_VERSION=12.0.1-B2

echo Istio label
kubectl label ns $SOFTHSM_NS istio-injection=enabled --overwrite
helm repo add mosip https://mosip.github.io/mosip-helm
helm repo update

echo Installing Softhsm for mock-identity-system
helm -n $NS install softhsm-mock-identity-system mosip/softhsm -f softhsm-values.yaml --version $SOFTHSM_CHART_VERSION --wait
echo Installed Softhsm for mock-identity-system

./copy_cm_func.sh secret softhsm-mock-identity-system softhsm config-server

kubectl -n config-server set env --keys=security-pin --from secret/softhsm-mock-identity-system deployment/config-server --prefix=SPRING_CLOUD_CONFIG_SERVER_OVERRIDES_SOFTHSM_MOCK_IDENTITY_SYSTEM_
kubectl -n config-server rollout restart deploy config-server
kubectl -n config-server rollout status config-server

declare -a module=("mock-identity-system"
                   "mock-relying-party-service"
		           "mock-relying-party-ui"
                  )

echo Installing esignet mock services

for i in "${module[@]}"
do
  cd $ROOT_DIR/"$i"
  ./install.sh
done

echo All esignet mock services deployed sucessfully.
