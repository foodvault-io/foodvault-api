---
id: 5nnd1
title: Getting Started
file_version: 1.1.2
app_version: 1.4.5
---

This is the documentation for the FoodVault API. It is written using \[NestJS\](nestjs.com).

## Getting Started:

In order to locally run this project, you need to have [Docker](https://www.docker.com/) and [Docker Compose](https://docs.docker.com/compose) installed. You must also have [NestJS](https://nestjs.com) installed globally.

<br/>

### Run the Project

To run the project, you need to execute the following command in the root directory of the project:

```bash
docker-compose up
```

This will start the [PostgreSQL](https://www.postgresql.org/) database.

Make sure to create a `.env` & `.env.test` file and create a `POSTGRES_PASSWORD=yourownawesomepassword`

To run the [Prisma](https://www.prisma.io/) client, you need to execute the following command in the root directory of the project:

```
pnpm run prisma:dev:deploy
```

This will make the initial migrations to the dev db in the docker. To run the test db:

```
pnpm run prisma:test:deploy
```

After that, you need to run the NestJS application. To do so, you need to execute the following command in the root directory of the project:

```bash
pnpm run start:dev
```

## Swagger Documentation

This will start the NestJS application and the [Swagger](https://swagger.io/) documentation.

The Swagger documentation can be found [here](http://localhost:3000/swagger](http://localhost:3000/swagger)).

<br/>

## **Test**

Unit Test

```bash
pnpm run test
```

e2e Testing

```bash
pnpm run test:e2e
```

Test Coverage

```bash
pnpm run test:cov
```

Update the Test Coverage Badge in the `📄 README.md` file:

```bash
pnpm run make-badges
```

<br/>

This file was generated by Swimm. [Click here to view it in the app](/repos/Z2l0aHViJTNBJTNBZm9vZHZhdWx0LWFwaSUzQSUzQWZvb2R2YXVsdC1pbw==/docs/5nnd1).