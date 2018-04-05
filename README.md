[![Build Status](https://travis-ci.org/dockerlamp/mono-stack.svg?branch=develop)](https://travis-ci.org/dockerlamp/mono-stack)
# Config

## Dependencies

`yarn` is required for dependency management and utility scripts:
```
npm install -g yarn
yarn install
```

## Development environment on windows < 10

We use `vagrant` to install docker & docker-compose environment. Docker api is available outside vagrant on port `12345`

Start Vagrant and enter services folder:
```
vagrant up
vagrant ssh
$ cd /vagrant/provision/services
```

Host mapping in file: `c:\Windows\System32\drivers\etc\hosts`
```
192.168.56.131	monostack.vagrant
```

## Development environment on host's docker

Enter services folder:
```
cd provision/services
```

## Common development scripts

```
./yarn.sh install
./yarn.sh build
docker-compose up -d
```

You can create file `.env` in services folder to setup some enviromental variables. Example of docker-compose project name change:
```
COMPOSE_PROJECT_NAME=monostack
```

# UI

http://localhost:3000 or http://monostack.vagrant:3000