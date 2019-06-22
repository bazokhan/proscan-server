# Quiz Tool Server

## Installation

### Install Docker

Docker is the engine that will run containers needed for this service:
[Download Link For Windows](https://hub.docker.com/editions/community/docker-ce-desktop-windows).

- prisma: prismagraphql/prisma:1.34
- mysql: mysql:5.7

### Install Prisma and yarn

Prisma is the ORM that deals with the database.
[Yarn](https://yarnpkg.com/en/docs/install) is the package manager for the node application.

```bash
npm install -g prisma
npm install -g yarn
```

### Install Dependencies

```bash
yarn
```

or

```bash
yarn install
```

## Developing

### Start docker containers

The following command will pull required images if they don't exist locally.
It will then start them on the docker engine in containers.
It uses the `docker-compose.yml` file for configuration.
A sample file can be found [here](https://www.prisma.io/docs/1.34/get-started/01-setting-up-prisma-new-database-JAVASCRIPT-a002/#add-prisma-and-database-docker-images).

```bash
docker-compose up -d
```

### Deploy to prisma

```bash
yarn deploy
```

### Start developing

```bash
yarn start
```

## Other Available Scripts

### Delete the deployed service from the prisma server

This allows you to do a fresh deploy after changing the datamodel.

```bash
yarn delete
```

### Get authentication token for prisma

This script generates a prisma token and copies it to the clipboard.
It can then be used to authenticate queries and mutations sent from the playground.

```bash
yarn get-token
```

More about authentication and security of Prisma server can be found here: [Prisma Authentication & Security](https://www.prisma.io/docs/prisma-server/authentication-and-security-kke4/)
