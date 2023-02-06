#!/bin/sh
# line endings must be \n, not \r\n !
echo "window._env_ = {" > ${work_dir}/env-config.js
awk -F '=' '{ print $1 ": \"" (ENVIRON[$1] ? ENVIRON[$1] : $2) "\"," }' ${work_dir}/.env >> ${work_dir}/env-config.js
echo "}" >> ${work_dir}/env-config.js