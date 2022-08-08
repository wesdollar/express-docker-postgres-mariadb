import { exec, execSync, spawn } from "child_process";
import { program } from "commander";
import { mkdirSync, readFileSync, writeFileSync } from "fs";
import { cwd } from "process";
import prompts from "prompts";
import { getEnvFileContents } from "./get-env-file-contents";
import { getPgConfigContents } from "./get-pg-config-contents";
import chalk from "chalk";

program
  .name("quickstart-retailer-product-service")
  .description("fancy CLI tools for retailer-product-service")
  .version("1.0.0");

program
  .option("-i, --init", "set up the local dev environment")
  .option("-y, --yarn", "install yarn dependencies")
  .description(
    "Start local dev environment. Pass --init if this is your first run."
  )
  // @ts-ignore TODO: typing
  .action(async () => {
    const options = program.opts();
    const isInit = options.init || null;
    const installYarnDependencies = options.yarn || null;
    let dbPassword: string;
    let dbPort;

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
      - Setting up the Docker containers for the service, Postgres, and pgAdmin
      - Configuring your DB connection
      - Setting up your pgAdmin admin account
      - Running the DB migration and seeds
      `
      );

      const { initContinue } = await prompts({
        type: "confirm",
        name: "initContinue",
        message: "Are you ready to begin?",
      });

      const {
        emailAddress,
        promptedDbPassword,
        servicePort,
        dbPort,
        pgAdminPort,
      } = await prompts([
        {
          type: "text",
          name: "emailAddress",
          message: "Email address:",
        },

        {
          type: "text",
          name: "servicePort",
          message: "Service Port:",
          initial: "34567",
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
          message: "pgAdmin Port:",
          initial: "34568",
        },
      ]);

      dbPassword = promptedDbPassword;

      if (!initContinue) {
        return console.log("Ok, come back when you're ready.");
      }

      /**
       * install yarn dependencies
       */
      execSync("yarn install");

      console.log(chalk.blue("Yarn dependencies installed"));

      /********************
       * generate env file
       */
      writeFileSync(
        `${cwd()}/.env`,
        getEnvFileContents(
          emailAddress,
          dbPassword,
          servicePort,
          dbPort,
          pgAdminPort
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
        const inspectProcess = execSync("docker inspect postgres").toString();

        pgAdminInspectResponse = JSON.parse(inspectProcess);
      } catch (error) {
        console.log(
          chalk.red(`Postgres service not yet available ${ipCheckAttempt}`)
        );
      }

      pgAdminGatewayIp =
        // @ts-ignore TODO: typing
        pgAdminInspectResponse[0]?.NetworkSettings?.Networks[
          "retailer-product-service_default"
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
        getPgConfigContents(dbPort, dbPassword, pgAdminGatewayIp)
      );

      console.log(chalk.blue("Sequelize config file created"));
    } else {
      /*********************************
       * update sequelize config file with current pgAdmin IP
       */
      const {
        json: { development: password, port },
      } = JSON.parse(readFileSync(`${cwd()}/config/config.json`).toString());

      writeFileSync(
        `${cwd()}/config/config.json`,
        getPgConfigContents(port, password, pgAdminGatewayIp)
      );

      console.log(chalk.blue("Sequelize config updated with Postgres IP"));
    }

    /**
     * run db migration and seeds
     */
    console.log(chalk.blue("Running DB migrations and seeds"));
    execSync("yarn sequelize-db-update-local");
    console.log(chalk.blue("DB migrations and seeds completed"));

    console.log(chalk.blue("Firing up TSC watcher"));
    const tscProcess = spawn("yarn", ["tsc-watch"]);

    tscProcess.stdout.on("data", (data) => {
      console.log(data.toString());

      console.log(
        chalk.blue(
          `\n\nService running at http://localhost:34567/proganywhere/retailer-product-service/\n\n`
        )
      );
    });
  });

program.parse();
