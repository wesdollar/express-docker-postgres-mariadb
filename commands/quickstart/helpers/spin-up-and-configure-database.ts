import { mkdirSync, readFileSync, writeFileSync } from "fs";
import { cwd } from "process";
import { getPgConfigContents } from "../get-pg-config-contents";
import chalk from "chalk";

export const spinUpAndConfigureDatabase = (
  isInit: any,
  serviceName: string,
  dbSelection: string,
  dbPort: string,
  dbPassword: string,
  pgAdminGatewayIp: string
  // eslint-disable-next-line max-params
) => {
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
};
