# Saedbox
Saedbox

[![Known Vulnerabilities](https://snyk.io/test/github/saedbox/saedbox/b6a9af15ff053f4b5ee7f1099abd52251b112082/badge.svg)](https://snyk.io/test/github/saedbox/saedbox/b6a9af15ff053f4b5ee7f1099abd52251b112082)  [![Build Status](https://travis-ci.org/saedbox/Saedbox.svg?branch=master)](https://travis-ci.org/saedbox/Saedbox)

![Saedbox](https://trello-attachments.s3.amazonaws.com/582c248a24efb954aa1a1d82/500x500/d0fa689b6f6fcb4a39e73e51049f441a/dgxye1O.png)

Saedbox is a web app used to easily deploy a seedbox managing web panel and dockerized applications without hassle. It's powered by NodeJS, Express, Dockerode, Traefik and a few bits of html & css.

Saedbox is developped by a team of passionate members who believe in open-source and modularity. We encourage you to pass by our forum and to also check our wiki for any question, request or guidance.

Saedbox is developped under the MIT license.

## Features


## API usage

### Authentification

### System info
```
GET /api/system
```

### Service Manipulating
```
GET /api/services  List services
GET /api/services/:id  Get service informations
POST /api/services  Create new service
GET /api/services/:id/start Start service
GET /api/services/:id/stop  Stop service
PATCH /api/services/:id Update service
DELETE /api/services/:id Delete service
```
### Users Manipulating
```
GET /api/users List Users
GET /api/users/:id Get user information
POST /api/users Create new user
DELETE /api/users/:id Delete user
PUT /api/users/:id Modify user
```
### Groups Manipulating
```
GET /api/groups List groups
GET /api/groups/:id Get group information
POST /api/groups Create new group
DELETE /api/groups/:id Delete group
PUT /api/groups/:id Modify group
```
## Manual installation

### Requirements:
- Docker
- NodeJS
- One beer (or more)


## Docker installation

### Requirements
- Docker
- One beer (or more)

## Run (Actually here is not build on hub)
```shell
$ docker run -d \
    -v /var/run/docker.sock \
    -p 9000:9000 \
    saedbox/saedbox
```

## Development installation
### Requirements
- Docker
- One beer (or more... surely more !)

### Run
```shell
$ docker build -t saedbox/saedbox .
$ docker run -d \
    -v /var/run/docker.sock \
    -p 9000:9000 \
    saedbox/saedbox
```
or
```shell
$ docker run -ti --rm \
    -v /path/of/saedbox:/usr/app/src \
    -v /var/run/docker.sock:/var/run/docker.sock \
    -w /usr/app/src \
    -p 9000:9000 \
    xataz/node:7 sh -c "npm i && npm run start"
```
