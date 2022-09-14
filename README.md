<p align="center">
  <a href="http://nestjs.com/" target="blank"><img src="https://nestjs.com/img/logo-small.svg" width="200" alt="Nest Logo" /></a>
</p>

[circleci-image]: https://img.shields.io/circleci/build/github/nestjs/nest/master?token=abc123def456
[circleci-url]: https://circleci.com/gh/nestjs/nest

  <p align="center">Jyzen Labs Backend created with NestJs</p>
    <p align="center">
</p>

## Description

Jyzen Api created with NestJs

## Configure Enviroment Variables

you can find which environment variables are used by the project in the `env.template` file
rename to .env

## Install Dependencies and run gateway and microservices

For the moment, while I solve the problem with docker, the way to run the different microservices and the gateway is:

````
$ cd gatetway/microservicename

$ yarn install

```bash
# development
$ yarn start

# watch mode
$ yarn start:dev

# production mode
$ yarn start:prod
````
