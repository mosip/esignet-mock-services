#!/bin/bash
# Installs all esignet helm charts
## Usage: ./install.sh [kubeconfig]

if [ $# -ge 1 ] ; then
  export KUBECONFIG=$1
fi

NS=esignet
CHART_VERSION=0.0.1-develop

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

echo Create $NS namespace
kubectl create ns $NS

function installing_mock-relying-party-ui() {
  echo Istio label
  kubectl label ns $NS istio-injection=enabled --overwrite

  ESIGNET_HOST=$(kubectl get cm global -o jsonpath={.data.mosip-esignet-host})

  echo Installing Mock Relying Party UI
  helm -n $NS install mock-relying-party-ui mosip/mock-relying-party-ui \
      --set mock_relying_party_ui.mock_relying_party_ui_service_host="$MOCK_UI_HOST" \
      --set mock_relying_party_ui.ESIGNET_UI_BASE_URL="https://$ESIGNET_HOST" \
      --set mock_relying_party_ui.MOCK_RELYING_PARTY_SERVER_URL="https://$MOCK_UI_HOST/mock-relying-party-service" \
      --set mock_relying_party_ui.REDIRECT_URI="https://$MOCK_UI_HOST/userprofile" \
      --set mock_relying_party_ui.REDIRECT_URI_REGISTRATION="https://$MOCK_UI_HOST/registration" \
      --set mock_relying_party_ui.SIGN_IN_BUTTON_PLUGIN_URL="https://$ESIGNET_HOST/plugins/sign-in-button-plugin.js" \
      --set istio.hosts\[0\]="$MOCK_UI_HOST" \
      -f values.yaml \
      --version $CHART_VERSION

  kubectl -n $NS get deploy mock-relying-party-ui -o name |  xargs -n1 -t  kubectl -n $NS rollout status

  echo Installed mock-relying-party-ui service
  return 0
}

# set commands for error handling.
set -e
set -o errexit   ## set -e : exit the script if any statement returns a non-true return value
set -o nounset   ## set -u : exit the script if you try to use an uninitialised variable
set -o errtrace  # trace ERR through 'time command' and other functions
set -o pipefail  # trace ERR through pipes
installing_mock-relying-party-ui   # calling function
