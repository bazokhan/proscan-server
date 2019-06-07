# Setting up the project

## Install Docker
Docker is the engine that will run containers needed for this service:
[Download Link For Windows](https://hub.docker.com/editions/community/docker-ce-desktop-windows)
* prisma: prismagraphql/prisma:1.34
* mysql: mysql:5.7

## Install Prisma and yarn
Prisma is the ORM that deals with the database
[Yarn](https://yarnpkg.com/en/docs/install) is the package manager for the node application
```
npm install -g prisma
npm install -g yarn
```

## Install Dependencies
```
yarn
```
or
```
yarn install
```

# Running the project

## Start docker containers
The following command will pull required images if they don't exist locally.
It will then start them on the docker engine in containers.
It uses the ```docker-compose.yml``` file for configuration.
A sample file can be found [here](https://www.prisma.io/docs/1.34/get-started/01-setting-up-prisma-new-database-JAVASCRIPT-a002/#add-prisma-and-database-docker-images)
```
docker-compose up -d
```

## Deploy to prisma
```
yarn deploy
```

## Start developing!
```
yarn start
```