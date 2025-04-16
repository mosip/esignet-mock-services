FROM eclipse-temurin:21-jre

# Metadata
ARG SOURCE
ARG COMMIT_HASH
ARG COMMIT_ID
ARG BUILD_TIME
LABEL source=${SOURCE}
LABEL commit_hash=${COMMIT_HASH}
LABEL commit_id=${COMMIT_ID}
LABEL build_time=${BUILD_TIME}

# Configurable container user details
ARG container_user=mosip
ARG container_user_group=mosip
ARG container_user_uid=1001
ARG container_user_gid=1001

# Install packages and create user + home dir
RUN apt-get -y update \
  && apt-get install -y unzip sudo \
  && groupadd -g ${container_user_gid} ${container_user_group} \
  && useradd -u ${container_user_uid} -g ${container_user_group} -s /bin/sh -m ${container_user} \
  && usermod -aG sudo ${container_user} \
  && rm -rf /var/cache/apt/archives /var/lib/apt/lists/*

# Set working directory
WORKDIR /home/${container_user}
ENV work_dir=/home/${container_user}

# Copy Spring Boot jar
COPY ./target/usecase-compass-*.jar usecase-compass.jar

# Fix permissions
RUN chown -R ${container_user}:${container_user} /home/${container_user}

# Set user for following commands
USER ${container_user_uid}:${container_user_gid}

# Expose application ports
EXPOSE 8091
EXPOSE 9010

# Run the app
CMD ["java", "-jar", "usecase-compass.jar"]
