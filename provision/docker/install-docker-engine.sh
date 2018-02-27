#!/bin/bash
DOCKER_ENGINE_VERSION=17.12.0\*

#uninstall old versions
apt-get remove -y docker docker-engine docker.io

echo "--- Register repository & install required tools:"
curl -fsSL https://download.docker.com/linux/ubuntu/gpg | apt-key add -
add-apt-repository \
   "deb [arch=amd64] https://download.docker.com/linux/ubuntu \
   $(lsb_release -cs) \
   stable"
apt-get update
apt-get install -y \
    apt-transport-https \
    ca-certificates \
    curl \
    software-properties-common

echo "--- Install docker-ce"
apt-get install -y docker-ce=${DOCKER_ENGINE_VERSION}

echo "--- Add groups and users"
groupadd -f docker
usermod -aG docker vagrant

echo "--- Expose docker port from vagrant"
mkdir -p /etc/docker/
cp -f /vagrant/provision/docker/daemon.json /etc/docker/daemon.json

echo "--- Restart"
service docker restart
apt-get autoremove -y

echo "--- Newest avaialble docker-engine version:"
apt-cache policy docker-ce | grep "Candidate"