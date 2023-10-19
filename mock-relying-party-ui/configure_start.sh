#!/bin/bash

#installs the pre-requisites.
set -e

echo "Downloading pre-requisites install scripts"
wget --no-check-certificate --no-cache --no-cookies $artifactory_url_env/artifactory/libs-release-local/i18n/mock-relying-party-i18n-bundle.zip -O $i18n_path/mock-relying-party-i18n-bundle.zip

echo "unzip pre-requisites.."
chmod 775 $i18n_path/*

cd $i18n_path
unzip -o mock-relying-party-i18n-bundle.zip

echo "unzip pre-requisites completed."

echo "Updating sign-in-plugin-url-placeholder with sign-in-plugin URL: ${SIGN_IN_BUTTON_PLUGIN_URL}"

rpSignInCmd="s#sign-in-plugin-url-placeholder#${SIGN_IN_BUTTON_PLUGIN_URL}#"
sed -i $rpSignInCmd $work_dir/index.html

echo "Update for sign-in-plugin url completed."

echo "Replacing public url placeholder with public url"

workingDir=$nginx_dir/html
if [ -z "$MOCK_RP_UI_PUBLIC_URL" ]; then
  rpCmd="s/_PUBLIC_URL_//g"
  grep -rl '_PUBLIC_URL_' $workingDir | xargs sed -i $rpCmd
else
  workingDir=$nginx_dir/${MOCK_RP_UI_PUBLIC_URL}
  mkdir $workingDir
  mv  -v $nginx_dir/html/* $workingDir/
  rpCmd="s/_PUBLIC_URL_/\/${MOCK_RP_UI_PUBLIC_URL}/g"
  grep -rl '_PUBLIC_URL_' $workingDir | xargs sed -i $rpCmd
fi

echo "Replacing completed."

echo "generating env-config file"

echo "window._env_ = {" > ${workingDir}/env-config.js
awk -F '=' '{ print $1 ": \"" (ENVIRON[$1] ? ENVIRON[$1] : $2) "\"," }' ${workingDir}/env.env >> ${workingDir}/env-config.js
echo "}" >> ${workingDir}/env-config.js

echo "generation of env-config file completed!"

exec "$@"
