FROM node:16.13.2-alpine as build

ARG SOURCE
ARG COMMIT_HASH
ARG COMMIT_ID
ARG BUILD_TIME
LABEL source=${SOURCE}
LABEL commit_hash=${COMMIT_HASH}
LABEL commit_id=${COMMIT_ID}
LABEL build_time=${BUILD_TIME}

# can be passed during Docker build as build time environment for github branch to pickup configuration from.
ARG container_user=mosip
ARG container_user_group=mosip
ARG container_user_uid=1001
ARG container_user_gid=1001

ARG esignet_service_url
ARG esignet_aud_url
ARG client_private_key
ARG userinfo_response_type
ARG jwe_userinfo_private_key

ENV work_dir=/app

ENV work_dir=${work_dir}

WORKDIR /home/${container_user}

RUN addgroup -g ${container_user_gid} ${container_user} && \
    adduser ${container_user} -G ${container_user} -u ${container_user_uid} --disabled-password
  
#Copy the app
COPY . ./
ENV PORT=8888
ENV ESIGNET_SERVICE_URL=${esignet_service_url}
ENV ESIGNET_AUD_URL=${esignet_aud_url}
ENV CLIENT_PRIVATE_KEY=${client_private_key}
ENV USERINFO_RESPONSE_TYPE=${userinfo_response_type}
ENV JWE_USERINFO_PRIVATE_KEY=${jwe_userinfo_private_key}

# change permissions of file inside working dir
RUN chown -R ${container_user}:${container_user} /home/${container_user} ${work_dir}

# select container user for all tasks
USER ${container_user}

USER ${container_user_uid}:${container_user_gid}

EXPOSE ${PORT}

RUN npm install
CMD ["node", "./app.js"]
