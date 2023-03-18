---
id: j021o
title: Dev Environment Setup
file_version: 1.1.2
app_version: 1.4.5
---

To run your local dev environment you will need a few things on your machine. Follow the steps below.

## Installations

*   Install [Node JS](https://nodejs.org/en/download/), version `18.x`
    
*   Install an IDE (preferably [VS Code](https://code.visualstudio.com/))
    
*   Install Git (if you don't already have it on your machine).
    
*   Install [NestJS CLI](https://docs.nestjs.com/) globally
    

<br/>

## Getting the sources

Clone the repository locally:

```bash
git clone https://github.com/foodvault-io/foodvault-api.git
```

## Start Server

*   Within the repository directory, run `pnpm install` to install the project's dependencies.
    
*   Then, run the project by running `pnpm start:dev`.
    

## Scripts worth mentioning ⚡️✨

Start Server in development mode

```bash
$ pnpm run start:dev
```

Run Prisma Migrations for Development Table

```bash
$ pnpm run prisma:dev:migrate
```

See package.json for full list of supported yarn scripts:

<br/>

Full list of scripts for this project:
<!-- NOTE-swimm-snippet: the lines below link your snippet to Swimm -->
### 📄 package.json
```json
8        "scripts": {
9          "prisma:prod:deploy": "npx prisma migrate deploy",
10         "prisma:dev:deploy": "prisma migrate deploy dev",
11         "db:dev:rm": "docker compose rm db -s -f -v",
12         "db:dev:up": "docker compose up db -d",
13         "db:dev:restart": "pnpm run db:dev:rm && pnpm run db:dev:up && sleep 1 && npm run prisma:dev:deploy",
14         "prisma:test:deploy": "dotenv -e .env.test -- prisma migrate deploy dev",
15         "db:test:rm": "docker compose rm test-db -s -f -v",
16         "db:test:up": "docker compose up test-db -d",
17         "db:test:restart": "pnpm run db:test:rm && pnpm run db:test:up && sleep 1 && npm run prisma:test:deploy",
18         "build": "nest build",
19         "format": "prettier --write \"src/**/*.ts\" \"test/**/*.ts\"",
20         "start": "nest start",
21         "start:dev": "nest start --watch",
22         "start:debug": "nest start --debug --watch",
23         "start:prod": "node dist/main",
24         "lint": "eslint \"{src,apps,libs,test}/**/*.ts\" --fix",
25         "test": "jest",
26         "test:watch": "jest --watch",
27         "test:cov": "jest --coverage",
28         "make-badges": "istanbul-badges-readme --logo='jest' --badge-style='plastic'",
29         "make-badges:ci": "pnpm run make-badges --logo='jest' --badge-style='plastic' -- --ci",
30         "test:debug": "node --inspect-brk -r tsconfig-paths/register -r ts-node/register node_modules/.bin/jest --runInBand",
31         "test:e2e": "jest --config ./test/jest-e2e.json"
32       },
```

<br/>

## Congrats

You now have your dev environment ready 🎉

<br/>

This file was generated by Swimm. [Click here to view it in the app](/repos/Z2l0aHViJTNBJTNBZm9vZHZhdWx0LWFwaSUzQSUzQWZvb2R2YXVsdC1pbw==/docs/j021o).