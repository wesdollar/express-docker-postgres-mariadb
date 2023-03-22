import chalk from "chalk";
import { writeFileSync } from "fs";
import { cwd } from "process";
import { getDockerComposeContents } from "../get-docker-compose-contents";

export const createDockerComposeYml = (
  serviceName: string,
  dbSelection: string
) => {
  writeFileSync(
    `${cwd()}/docker-compose.yml`,
    getDockerComposeContents(serviceName, dbSelection)
  );

  console.log(chalk.blue("docker-compose file created"));
};
