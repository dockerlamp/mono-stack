#!/bin/bash

DOCKER_COMPOSE_VERSION=1.19.0

_dc_exists=`which docker-compose`
_install_dc=""
if [ -z "$_dc_exists" ] ; then  
  echo "docker-compose installed: not"
  _install_dc="true"
else
  _dc_installed=`docker-compose -v | grep --color=never -o -E "[0-9]+\.[0-9]+\.[0-9]+"`
  echo "docker-compose already installed: ${_dc_installed}"  
  if [ "${_dc_installed}" == "${DOCKER_COMPOSE_VERSION}" ] ; then
    echo "docker-compose version: ok"
  else  
    echo "installed invalid version of docker-compose"
    _install_dc="true"
  fi
fi

if [ "$_install_dc" == "true" ] 
then
  echo "installing docker-compose: ${DOCKER_COMPOSE_VERSION}"
  curl -sS -L https://github.com/docker/compose/releases/download/${DOCKER_COMPOSE_VERSION}/docker-compose-`uname -s`-`uname -m` > /usr/local/bin/docker-compose
  chmod +x /usr/local/bin/docker-compose
  echo "installed docker-compose: ${DOCKER_COMPOSE_VERSION}"
fi 