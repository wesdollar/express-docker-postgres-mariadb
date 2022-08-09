import { exec, execSync, spawn } from "child_process";
import { program } from "commander";
import { mkdirSync, readFileSync, writeFileSync } from "fs";
import { cwd } from "process";
import prompts from "prompts";
import { getEnvFileContents } from "./get-env-file-contents";
import { getPgConfigContents } from "./get-pg-config-contents";
import chalk from "chalk";
import rimraf from "rimraf";
import { getDockerComposeContents } from "./get-docker-compose-contents";
import path from "path";

program
  .name("quickstart")
  .description("fancy CLI tool for launching the services")
  .version("1.0.0");

program
  .option("-i, --init", "set up the local dev environment")
  .option("-y, --yarn", "install yarn dependencies")
  .option("-r, --rerun", "clears out config and .env file")
  .description(
    "Start local dev environment. Pass --init if this is your first run."
  )
  // @ts-ignore TODO: typing
  .action(async () => {
    const options = program.opts();
    const isInit = options.init || null;
    const installYarnDependencies = options.yarn || null;
    let dbPassword = "";
    let dbPort;
    let emailAddress;
    let promptedDbPassword;
    let servicePort: string;
    let pgAdminPort;
    let serviceName;
    let dbSelection;

    rimraf.sync("dist");

    if (options.rerun) {
      try {
        rimraf.sync("config");
        rimraf.sync(".env");
        rimraf.sync("docker-compose.yml");
      } catch (error) {
        console.error(error);
      }

      console.log(chalk.blue("rerun files cleared"));
    }

    if (isInit) {
      const { name } = await prompts({
        type: "text",
        name: "name",
        message: "Hi, what's your name?",
      });

      console.log(
        `
      Hello, ${name}! Let's get started setting up your environment!

      Here's what we'll be doing:

      - Creating your .env file
      - Setting up the Docker containers for the service, DB, and DB web interface
      - Configuring your DB connection
      - Running the DB migration and seeds
      `
      );

      const { initContinue } = await prompts({
        type: "confirm",
        name: "initContinue",
        message: "Are you ready to begin?",
      });

      ({
        emailAddress,
        promptedDbPassword,
        servicePort,
        dbPort,
        pgAdminPort,
        serviceName,
        dbSelection,
      } = await prompts([
        {
          type: "text",
          name: "emailAddress",
          message: "Email address:",
        },
        {
          type: "text",
          name: "serviceName",
          message: "Service Name:",
        },
        {
          type: "text",
          name: "servicePort",
          message: "Service Port:",
          initial: "34567",
        },
        {
          type: "select",
          name: "dbSelection",
          message: "DB Selection:",
          initial: 0,
          choices: [
            { title: "Postgres", value: "postgres" },
            { title: "MariaDB", value: "mariadb" },
          ],
        },
        {
          type: "text",
          name: "dbPort",
          message: "DB Port:",
          initial: "5433",
        },
        {
          type: "text",
          name: "promptedDbPassword",
          message: "DB Password:",
        },
        {
          type: "text",
          name: "pgAdminPort",
          message: "DB GUI Port:",
          initial: "34568",
        },
      ]));

      dbPassword = promptedDbPassword;

      if (!initContinue) {
        return console.log("Ok, come back when you're ready.");
      }

      /**
       * create docker-compose.yml
       */
      writeFileSync(
        `${cwd()}/docker-compose.yml`,
        getDockerComposeContents(serviceName, dbSelection)
      );

      console.log(chalk.blue("docker-compose file created"));

      /**
       * install yarn dependencies
       */
      execSync("yarn install");
      execSync("yarn dlx @yarnpkg/sdks vscode");

      console.log(chalk.blue("Yarn dependencies installed"));

      /********************
       * generate env file
       */
      writeFileSync(
        `${cwd()}/.env`,
        getEnvFileContents(
          servicePort,
          dbPort,
          serviceName,
          dbPassword,
          emailAddress,
          pgAdminPort,
          dbSelection
        )
      );

      console.log(chalk.blue("Created .env file"));

      /**
       * initialize husky for git hooks
       */
      const huskyProcess = spawn("yarn", ["husky-init"]);

      huskyProcess.on("exit", () => {
        console.log(chalk.blue("Husky initialized"));
      });
    }

    if (installYarnDependencies) {
      /**
       * install yarn dependencies
       */
      execSync("yarn install");

      console.log(chalk.blue("Yarn dependencies installed"));
    }

    /**
     * spin up Docker containers for service, Postgres, pgAdmin
     */
    console.log(chalk.blue("Spawning Docker (docker-compose up)"));

    exec("docker-compose up");

    let pgAdminGatewayIp = "";
    let pgAdminInspectResponse: Record<string, unknown> = {};
    let ipCheckAttempt = 1;

    while (!pgAdminGatewayIp.length) {
      console.log(
        chalk.blue(`Checking for Postgres IP, attempt ${ipCheckAttempt}`)
      );

      await new Promise((resolve) => setTimeout(resolve, 2000));

      /*************************
       * get pgAdmin Gateway IP
       */
      try {
        let inspectService = `${serviceName}_${dbSelection}`;

        if (!isInit) {
          const {
            development: { database },
          } = JSON.parse(
            readFileSync(`${cwd()}/config/config.json`).toString()
          );

          inspectService = database;
        }

        const inspectProcess = execSync(
          `docker inspect ${inspectService}`
        ).toString();

        pgAdminInspectResponse = JSON.parse(inspectProcess);
      } catch (error) {
        console.log(
          chalk.red(`Postgres service not yet available ${ipCheckAttempt}`)
        );
      }

      // TODO: variablize "express-docker-postgres" for universal installation
      pgAdminGatewayIp =
        // @ts-ignore TODO: typing
        pgAdminInspectResponse[0]?.NetworkSettings?.Networks[
          `${path.basename(cwd())}_default`
        ].Gateway || "";

      ipCheckAttempt++;
    }

    if (isInit) {
      console.log(chalk.blue("Generating Sequelize config file"));

      /*********************************
       * generate sequelize config file
       */
      mkdirSync(`${cwd()}/config`);
      writeFileSync(
        `${cwd()}/config/config.json`,
        // @ts-ignore TODO: typing
        getPgConfigContents(
          `${serviceName}_${dbSelection}`,
          dbPort,
          dbPassword,
          pgAdminGatewayIp,
          dbSelection
        )
      );

      console.log(chalk.blue("Sequelize config file created"));
    } else {
      /*********************************
       * update sequelize config file with current pgAdmin IP
       */
      const {
        development: { password, port, database, dialect },
      } = JSON.parse(readFileSync(`${cwd()}/config/config.json`).toString());

      writeFileSync(
        `${cwd()}/config/config.json`,
        getPgConfigContents(database, port, password, pgAdminGatewayIp, dialect)
      );

      console.log(chalk.blue("Sequelize config updated with DB IP"));
    }

    /**
     * run db migration and seeds
     */
    console.log(chalk.blue("Running DB migrations and seeds"));

    try {
      execSync("yarn sequelize-db-update-local");
    } catch (error) {
      console.error(error);
    }

    console.log(chalk.blue("DB migrations and seeds completed"));

    console.log(chalk.blue("Firing up TSC watcher"));
    const tscProcess = spawn("yarn", ["tsc-watch"]);

    tscProcess.stdout.on("data", (data) => {
      console.log(data.toString());

      console.log(chalk.blue(`\n\n==== Service Running ====\n`));
      console.log(
        chalk.green(`http://localhost:${servicePort || process.env.PORT}/`)
      );
    });
  });

program.parse();
