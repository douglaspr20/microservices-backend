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

## Running the Api

Execute `docker network create infrastructure && cp .env && docker-compose up -d` from the root of the repository

## Launch services for integration testing (using docker-compose)

- Execute `cp .env`
- Execute `docker-compose -f ./docker-compose.yml up -d` from the root of the repository
- Run `cd ./gateway && yarn install && yarn start` from the root of this repo

## Brief architecture overview

This API showcase consists of the following parts:

- API gateway
- Appointment service - responsible for CRUD operations on appointments (mindbody and cerbo)
- Class service - responsible for CRUD operations on classes (mindbody)
- Client service - responsible for CRUD operations for clients (mindbody)
- Enrrollment service - responsible for CRUD operations on enrrollments (mindbody)
- Patient service - responsible for CRUD operations for patients (cerbo)
- Sale service - responsible for CRUD operations for sales (mindbody)
- Token service - responsible for decoding and create tokens for users
- User service - responsible for CRUD operations on users and user authentication process
- The service interact via **TCP sockets**
