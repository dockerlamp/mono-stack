#!/usr/bin/env bash

SUFFIX=$(( RANDOM % 1000000 ))
docker-compose run --rm --no-deps --name "yarn-${SUFFIX}" front-server yarn "$@"