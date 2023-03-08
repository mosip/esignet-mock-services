#!/bin/sh
# Installs all esignet mock service helm charts
## Usage: ./install.sh [kubeconfig]

if [ $# -ge 1 ] ; then
  export KUBECONFIG=$1
fi

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

read -p "Please provide mock relying party ui domain (eg: healthservices.sandbox.xyz.net ) : " MOCK_UI_HOST

if [ -z "$MOCK_UI_HOST" ]; then
  echo "Mock relying party UI Host not provided; EXITING;"
  exit 0;
fi

CHK_MOCK_UI_HOST=$( nslookup "$MOCK_UI_HOST" )
if [ $? -gt 0 ]; then
  echo "Mock relying party UI Host does not exists; EXITING;"
  exit 0;
fi

NS=esignet
CHART_VERSION=0.0.1

echo Create $NS namespace
kubectl create ns $NS

echo Istio label
kubectl label ns $NS istio-injection=enabled --overwrite

echo "Build esignet mock service charts"
cd mock-relying-party-service
helm dependency update
cd ../mock-relying-party-ui
helm dependency update
cd ../mock-identity-system
helm dependency update

cd ../

echo "Copy configmaps"
./copy_cm.sh

echo "Create secret for mock-relying-party-service-secrets and jwe-userinfo-private-key delete if exists"
cat "$CLIENT_PRIVATE_KEY" | sed "s/'//g" | sed -z 's/\n/\\n/g' > /tmp/client-private-key
cat "$JWE_USERINFO_PRIVATE_KEY" | sed "s/'//g" | sed -z 's/\n/\\n/g' > /tmp/jwe-userinfo-private-key


kubectl -n $NS delete --ignore-not-found=true secrets mock-relying-party-service-secrets
kubectl -n $NS delete --ignore-not-found=true secrets jwe-userinfo-service-secrets
kubectl -n $NS create secret generic mock-relying-party-service-secrets --from-file="/tmp/client-private-key"
kubectl -n $NS create secret generic jwe-userinfo-service-secrets --from-file="/tmp/jwe-userinfo-private-key"

API_HOST=$(kubectl get cm global -o jsonpath={.data.mosip-api-host})
ESIGNET_HOST=$(kubectl get cm global -o jsonpath={.data.mosip-esignet-host})

echo Installing Mock Relying Party Service
helm -n $NS install mock-relying-party-service ./mock-relying-party-service \
    --set mock_relying_party_service.ESIGNET_SERVICE_URL="https://$API_HOST"/v1/esignet"" \
    --set mock_relying_party_service.ESIGNET_AUD_URL="https://$API_HOST"/v1/esignet/oauth/token""

echo Installing Mock Relying Party UI
helm -n $NS install mock-relying-party-ui ./mock-relying-party-ui \
    --set mock_relying_party_ui.mock_relying_party_ui_service_host="$MOCK_UI_HOST" \
    --set mock_relying_party_ui.ESIGNET_UI_BASE_URL="https://$ESIGNET_HOST" \
    --set mock_relying_party_ui.MOCK_RELYING_PARTY_SERVER_URL="https://$MOCK_UI_HOST/mock-relying-party-service" \
    --set mock_relying_party_ui.REDIRECT_URI="https://$MOCK_UI_HOST/userprofile" \
    --set mock_relying_party_ui.REDIRECT_URI_REGISTRATION="https://$MOCK_UI_HOST/registration" \
    --set istio.hosts\[0\]="$MOCK_UI_HOST"

echo Installing mock-identity-system
helm -n $NS install mock-identity-system ./mock-identity-system --version $CHART_VERSION

kubectl -n $NS get deploy mock-relying-party-ui mock-relying-party-service mock-identity-system -o name |  xargs -n1 -t  kubectl -n $NS rollout status

echo "Installed Mock Relying Party Service, Mock Relying Party UI & Mock Identity System"
