#!/bin/sh
# Installs all esignet helm charts
## Usage: ./install.sh [kubeconfig]

if [ $# -ge 1 ] ; then
  export KUBECONFIG=$1
fi

NS=esignet
CHART_VERSION=0.9.0

echo Create $NS namespace
kubectl create ns $NS

echo Istio label
kubectl label ns $NS istio-injection=enabled --overwrite

echo "Copy configmaps"
./copy_cm.sh

read -p "Please provide client private key file : " CLIENT_PRIVATE_KEY

if [ -z "$CLIENT_PRIVATE_KEY" ]; then
  echo "Client Private key file not provided; EXITING;";
  exit 0;
fi
if [ ! -f "$CLIENT_PRIVATE_KEY" ]; then
  echo "Client Private key not found; EXITING;";
  exit 0;
fi

read -p "Please provide jwe userinfo private key file : " JWE_USERINFO_PRIVATE_KEY

if [ -z "$JWE_USERINFO_PRIVATE_KEY" ]; then
  echo "Client jwe userinfo Private key file not provided; EXITING;";
  exit 0;
fi
if [ ! -f "$JWE_USERINFO_PRIVATE_KEY" ]; then
  echo "Client jwe userinfo Private key not found; EXITING;";
  exit 0;
fi

echo "Create secret for mock-relying-party-service-secrets and jwe-userinfo-private-key delete if exists"
cat "$CLIENT_PRIVATE_KEY" | sed "s/'//g" | sed -z 's/\n/\\n/g' > /tmp/client-private-key
cat "$JWE_USERINFO_PRIVATE_KEY" | sed "s/'//g" | sed -z 's/\n/\\n/g' > /tmp/jwe-userinfo-private-key

kubectl -n $NS delete --ignore-not-found=true secrets mock-relying-party-service-secrets
kubectl -n $NS delete --ignore-not-found=true secrets jwe-userinfo-service-secrets
kubectl -n $NS create secret generic mock-relying-party-service-secrets --from-file="/tmp/client-private-key"
kubectl -n $NS create secret generic jwe-userinfo-service-secrets --from-file="/tmp/jwe-userinfo-private-key"

API_HOST=$(kubectl get cm global -o jsonpath={.data.mosip-api-host})
echo Installing Mock Relying Party Service
helm -n $NS install mock-relying-party-service mosip/mock-relying-party-service \
    --set mock_relying_party_service.ESIGNET_SERVICE_URL="http://esignet.$NS/v1/esignet" \
    --set mock_relying_party_service.ESIGNET_AUD_URL="https://$API_HOST/v1/esignet/oauth/token" \
    --version $CHART_VERSION

kubectl -n $NS get deploy mock-relying-party-service -o name |  xargs -n1 -t  kubectl -n $NS rollout status

echo Installed mock-relying-party-service service
