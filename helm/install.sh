#!/bin/sh
# Installs all oidc helm charts
## Usage: ./install.sh [kubeconfig]

if [ $# -ge 1 ] ; then
  export KUBECONFIG=$1
fi

read -p "Please provide private key file : " PRIVATE_KEY

if [ -z "$PRIVATE_KEY" ]; then
  echo "Private key file not provided; EXITING;";
  exit 0;
fi
if [ ! -f "$PRIVATE_KEY" ]; then
  echo "Private key not found; EXITING;";
  exit 0;
fi

read -p "Please provide oidc domain (eg: healthservices.sandbox.xyz.net ) : " OIDC_HOST

if [ -z "$OIDC_HOST" ]; then
  echo "OIDC Host not provided; EXITING;"
  exit 0;
fi

CHK_OIDC_HOST=$( nslookup "$OIDC_HOST" )
if [ $? -gt 0 ]; then
  echo "OIDC Host does not exists; EXITING;"
  exit 0;
fi

NS=idp
CHART_VERSION=0.0.1

echo Create $NS namespace
kubectl create ns $NS

echo Istio label
kubectl label ns $NS istio-injection=enabled --overwrite

echo "Build oidc charts"
cd oidc-server
helm dependency update
cd ../oidc-ui
helm dependency update

cd ../

echo "Copy configmaps"
./copy_cm.sh

echo "Create secret for oidc-server-secrets, delete if exists"
cat "$PRIVATE_KEY" | sed "s/'//g" | sed -z 's/\n/\\n/g' > /tmp/private-key

kubectl -n $NS delete --ignore-not-found=true secrets oidc-server-secrets
kubectl -n $NS create secret generic oidc-server-secrets --from-file="/tmp/private-key"

API_HOST=$(kubectl get cm global -o jsonpath={.data.mosip-api-host})
IDP_HOST=$(kubectl get cm global -o jsonpath={.data.mosip-idp-host})

echo Installing OIDC Server
helm -n $NS install oidc-server ./oidc-server \
    --set oidc_server.IDP_BASE_URL="https://$API_HOST"/v1/idp"" \
    --set oidc_server.IDP_AUD_URL="https://$API_HOST"/v1/idp/oauth/token""

echo Installing OIDC UI
helm -n $NS install oidc-ui ./oidc-ui \
    --set oidc_ui.oidc_service_host="$OIDC_HOST" \
    --set oidc_ui.IDP_UI_BASE_URL="https://$IDP_HOST" \
    --set oidc_ui.OIDC_BASE_URL="https://$OIDC_HOST/oidc-server" \
    --set oidc_ui.REDIRECT_URI="https://$OIDC_HOST/userprofile" \
    --set istio.hosts\[0\]="$OIDC_HOST"

kubectl -n $NS get deploy oidc-ui oidc-server -o name |  xargs -n1 -t  kubectl -n $NS rollout status

echo "Installed OIDC Server & OIDC-UI"
