import { spawn } from "child_process";
import { program } from "commander";
import chalk from "chalk";
import { processRimRafActions as copyConfigsToDist } from "./helpers/process-rim-raf-actions";
import { createFsDirectory } from "./helpers/create-fs-directory";
import { getUsersName } from "./prompts/get-users-name";
import { initContinue } from "./prompts/init-continue";
import { collectEnvironmentInfo } from "./prompts/collect-environment-info";
import { createDockerComposeYml } from "./helpers/create-docker-compose-yml";
import { generateEnvFile } from "./helpers/generate-env-file";
import { createHuskyHooks } from "./helpers/create-husky-hooks";
import { execInstallYarnDependencies } from "./helpers/install-yarn-dependencies";
import { spinUpDockerContainers } from "./helpers/spin-up-docker-containers";
import { spinUpAndConfigureDatabase } from "./helpers/spin-up-and-configure-database";
import { runDatabaseSeedsAndMigrations } from "./helpers/run-database-seeds-and-migrations";

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
    console.info(program.opts());
    const options = program.opts();
    const isInit = options.init || null;
    const installYarnDependencies = options.yarn || null;
    let dbPassword;
    let dbPort;
    let servicePort: string;
    let serviceName;
    let dbSelection;

    createFsDirectory("dist");

    if (options.rerun) {
      copyConfigsToDist();
    }

    if (isInit) {
      getUsersName();

      const userIsReadyToBegin = await initContinue();

      const {
        emailAddress,
        promptedDbPassword,
        servicePort,
        dbPort,
        pgAdminPort,
        serviceName,
        dbSelection,
      } = await collectEnvironmentInfo();

      dbPassword = promptedDbPassword;

      if (!userIsReadyToBegin) {
        return console.log("Ok, come back when you're ready.");
      }

      createDockerComposeYml(serviceName, dbSelection);
      execInstallYarnDependencies();

      generateEnvFile({
        servicePort,
        dbPort,
        serviceName,
        dbPassword,
        emailAddress,
        pgAdminPort,
        dbSelection,
      });

      createHuskyHooks();
    }

    if (installYarnDependencies) {
      execInstallYarnDependencies(installYarnDependencies);
    }

    const pgAdminGatewayIp = await spinUpDockerContainers(
      serviceName,
      dbSelection,
      isInit
    );

    spinUpAndConfigureDatabase(
      isInit,
      serviceName,
      dbSelection,
      dbPort,
      dbPassword,
      pgAdminGatewayIp
    );

    runDatabaseSeedsAndMigrations();

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
