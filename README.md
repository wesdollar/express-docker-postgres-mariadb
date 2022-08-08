# Express Docker Postgres Service

## Project Setup

- Clone repo to local working directory
- Run the following commands from project root:
  - `yarn install` to install dependencies
  - `yarn quickstart --init` to set the project up and run Docker containers

The interactive CLI will walk you through the setup process. Reach out to Wes Dollar with any issues.

## ORM for Postgres

This project uses Sequelize ORM. Sequelize provides a CLI for functions such as generating migrations, table seeders, and migrations. For a full list of Sequelize CLI commands, run `yarn sequelize-cli` from your local terminal or see [Sequelize docs](https://sequelize.org/).

If you've never worked with Sequelize before, please take the time to review [the docs](https://sequelize.org/). You are encouraged to the read the docs from start to finish so you, too, can harness the full power of Sequelize.

## pgAdmin

**This is done for you by the `quickstart` command.**

To connect pgAdmin to your local DB instance:

- From you local terminal with the containers running, run `docker inspect pgadmin`
- Grab the `Gateway` IP address
- Use the `Gateway` IP address for "hostname/address" in `./config/config.json

## Housekeeping

This project uses Yarn 3.2.1. **Do not run `npm` commands, as this will cause conflicts**. Yarn 3.2.1 leverages PnP. As such, there is no `node_modules` directory. For more information, please see the [Yarn documentation](https://yarnpkg.com/).

## Docker Setup

To launch dev environment, run `yarn quickstart` from project root.

This project is fully Dockerized for local development. The Docker setup includes:

- NodeJS, 16.16-alpine
- Postgres
- pgAdmin, web-based GUI

#### Development Environment

- Typescript
- VS Code settings are pre-configured; details available in the `.vscode` directory
  - Please do not change these settings without the permission of Wes Dollar
- Auto-formatting by way of Prettier, stock configuration
- ESLint, heavily customized, rules available in `.eslintrc`
  - Please do not modify the ESLint configuration without permission from Wes Dollar
- Jest for unit tests
- Yarn 3.2.1 for package management
- Joi for data validation
- Sequelize for ORM, db migrations and seeding

Please see `package.json` for additional tools that have been installed to make life easier, such as Lodash, Numbro, and many others.

## To Do Items

[ ] Comb through package dependencies to remove unused packages
