import chalk from "chalk";
import { writeFileSync } from "fs";
import { cwd } from "process";
import { getEnvFileContents } from "../get-env-file-contents";
import { EnvFileContents } from "../types/env-file-contents";

export const generateEnvFile = ({
  servicePort,
  dbPort,
  serviceName,
  dbPassword,
  emailAddress,
  pgAdminPort,
  dbSelection,
}: EnvFileContents) => {
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
};
