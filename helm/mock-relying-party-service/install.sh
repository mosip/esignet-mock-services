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

echo "Do you have public domain & valid SSL? (Y/n) "
echo "Y: if you have public domain & valid ssl certificate"
echo "n: If you don't have a public domain and a valid SSL certificate. Note: It is recommended to use this option only in development environments."
read -p "" flag

if [ -z "$flag" ]; then
  echo "'flag' was provided; EXITING;"
  exit 1;
fi
ENABLE_INSECURE=''
if [ "$flag" = "n" ]; then
  ENABLE_INSECURE='--set enable_insecure=true';
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

ESIGNET_HOST=$(kubectl get cm global -o jsonpath={.data.mosip-esignet-host})
DEFAULT_ESIGNET_SERVICE_URL='http://esignet.esignet/v1/esignet'
read -p "Please provide Esignet service url : ( default: http://esignet.esignet/v1/esignet )" USER_PROVIDED_ESIGNET_SERVICE_URL
ESIGNET_SERVICE_URL=${USER_PROVIDED_ESIGNET_SERVICE_URL:-$DEFAULT_ESIGNET_SERVICE_URL}

echo Installing Mock Relying Party Service
helm -n $NS install mock-relying-party-service mosip/mock-relying-party-service \
    --set mock_relying_party_service.ESIGNET_SERVICE_URL="$ESIGNET_SERVICE_URL" \
    --set mock_relying_party_service.ESIGNET_AUD_URL="https://$ESIGNET_HOST/v1/esignet/oauth/token" \
    --version $CHART_VERSION $ENABLE_INSECURE

kubectl -n $NS get deploy mock-relying-party-service -o name |  xargs -n1 -t  kubectl -n $NS rollout status

echo Installed mock-relying-party-service service
