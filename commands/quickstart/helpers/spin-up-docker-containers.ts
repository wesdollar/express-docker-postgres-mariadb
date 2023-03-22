import { exec, execSync } from "child_process";
import { readFileSync } from "fs";
import { cwd } from "process";
import chalk from "chalk";
import path from "path";

export const spinUpDockerContainers = async (
  serviceName: string,
  dbSelection: string,
  isInit: any
) => {
  console.log(chalk.blue("Spawning Docker (docker-compose up)"));

  exec("docker-compose up");

  let pgAdminGatewayIp = "";
  let pgAdminInspectResponse: Record<string, unknown> = {};
  let ipCheckAttempt = 1;

  while (!pgAdminGatewayIp.length) {
    console.log(
      chalk.blue(`Checking for Postgres IP, attempt ${ipCheckAttempt}`)
    );

    // wait on docker to spin up
    await new Promise((resolve) => setTimeout(resolve, 2000));

    /*************************
     * get pgAdmin Gateway IP
     */
    try {
      let inspectService = `${serviceName}_${dbSelection}`;

      if (!isInit) {
        const {
          development: { database },
        } = JSON.parse(readFileSync(`${cwd()}/config/config.json`).toString());

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

  return pgAdminGatewayIp;
};
