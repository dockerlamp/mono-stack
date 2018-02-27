# Config

## Dependencies

`yarn` is required for dependency management and utility scripts:
```
npm install -g yarn
yarn install
```

## Development on windows < 10

We use `vagrant` to install docker & docker-compose environment. Docker api is available outside vagrant on port `12345`

```
vagrant up
vagrant ssh
$ cd /vagrant/provision/services
$ ./yarn.sh install
$ docker-compose up -d
```

Host mapping in file: `c:\Windows\System32\drivers\etc\hosts`
```
192.168.56.131	monostack.vagrant
```

## Docker commands

```
cd provision/services
./yarn.sh install
docker-compose up -d
```

# UI

http://localhost:3000 or http://monostack.vagrant:3000