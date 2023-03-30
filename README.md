# FoodVault API Docs

![Statements](https://img.shields.io/badge/statements-99.46%25-brightgreen.svg?style=flat&logo=jest) ![Branches](https://img.shields.io/badge/branches-95.45%25-brightgreen.svg?style=flat&logo=jest) ![Functions](https://img.shields.io/badge/functions-100%25-brightgreen.svg?style=flat&logo=jest) ![Lines](https://img.shields.io/badge/lines-99.44%25-brightgreen.svg?style=flat&logo=jest) 

This is the documentation for the FoodVault API. It is written using [NestJS](nestjs.com) and [Swagger](swagger.io).

## Getting Started
In order to locally run this project, you need to have [Docker](https://www.docker.com/) and [Docker Compose](https://docs.docker.com/compose/) installed. You also need to have [NestJS](https://nestjs.com/) installed globally. 

### Run the project
To run the project, you need to execute the following command in the root directory of the project:

```bash
docker-compose up
```

This will start the [PostgreSQL](https://www.postgresql.org/) database.

After that, you need to run the NestJS application. To do so, you need to execute the following command in the root directory of the project:

```bash
pnpm run start:dev
```

This will start the NestJS application and the [Swagger](https://swagger.io/) documentation.

To run the [Prisma](https://www.prisma.io/) client, you need to execute the following command in the root directory of the project:

```bash
pnpm run prisma:dev
```

This will start the Prisma client.

## Swagger Documentation
The Swagger documentation can be found at [http://localhost:3000/swagger](http://localhost:3000/swagger).

## Test

```bash
# unit tests
$ pnpm run test

# e2e tests
$ pnpm run test:e2e

# test coverage
$ pnpm run test:cov
```