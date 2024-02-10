# syntax = docker/dockerfile:1

# Adjust NODE_VERSION as desired
ARG NODE_VERSION=18.14.2
FROM node:${NODE_VERSION}-slim as base

# Set arguments to be used throughout the image
ARG OPERATOR_HOME="/home/op"
ARG OPERATOR_USER="op"
ARG OPERATOR_UID="50000"
ARG BUCKET_NAME=""


# Add environment variables based on arguments
ENV OPERATOR_HOME ${OPERATOR_HOME}
ENV OPERATOR_USER ${OPERATOR_USER}
ENV OPERATOR_UID ${OPERATOR_UID}
ENV BUCKET_NAME ${BUCKET_NAME}
 
# Add user for code to be run as (we don't want to be using root)
RUN useradd -ms /bin/bash -d ${OPERATOR_HOME} --uid ${OPERATOR_UID} ${OPERATOR_USER}

# install s3fs
RUN set -ex && \
    apt-get update && \
    apt-get install -y s3fs wget gzip sudo && \
    wget https://github.com/mbrubeck/agate/releases/download/v3.3.4/agate.aarch64-unknown-linux-gnu.gz -O /tmp/agate.gz && \
    gzip -d /tmp/agate.gz && \
    mv /tmp/agate /usr/local/bin/agate && \
    chmod +x /usr/local/bin/agate

# setup s3fs configs
RUN echo "s3fs#${BUCKET_NAME} ${OPERATOR_HOME}/s3_bucket fuse _netdev,allow_other 0 0" >> /etc/fstab
# RUN echo "s3fs ${BUCKET_NAME} ${OPERATOR_HOME}/s3_bucket fuse _netdev,allow_other,nonempty,umask=000,uid=${OPERATOR_UID},gid=${OPERATOR_UID},passwd_file=${OPERATOR_HOME}/.s3fs-creds,use_cache=/tmp 0 0" >> /etc/fstab

RUN sed -i '/user_allow_other/s/^#//g' /etc/fuse.conf


RUN touch /etc/passwd-s3fs && \
    chmod 600 /etc/passwd-s3fs && \
    chown ${OPERATOR_USER} /etc/passwd-s3fs

# Grant sudo privileges to the operator user
RUN echo "${OPERATOR_USER}:${OPERATOR_USER}" | chpasswd && adduser "${OPERATOR_USER}" sudo
RUN echo '%sudo ALL=(ALL) NOPASSWD:ALL' >> /etc/sudoers

# Set our user to the operator user
USER ${OPERATOR_USER}
WORKDIR ${OPERATOR_HOME}

RUN printf '#!/usr/bin/env bash  \n\
echo ${ACCESS_KEY_ID}:${SECRET_ACCESS_KEY} > /etc/passwd-s3fs \n\
chmod 600 /etc/passwd-s3fs \n\
mkdir ${OPERATOR_HOME}/s3_bucket \n\
mount -a \n\
agate --content ${OPERATOR_HOME}/s3_bucket --hostname ${HOSTNAME} --addr 0.0.0.0:1965 --lang=${LANG} \
' >> ${OPERATOR_HOME}/entrypoint.sh

RUN chmod 700 ${OPERATOR_HOME}/entrypoint.sh
ENTRYPOINT [ "/home/op/entrypoint.sh" ]

