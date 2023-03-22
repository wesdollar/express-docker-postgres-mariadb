import chalk from "chalk";
import { execSync } from "child_process";

export const execInstallYarnDependencies = (skipExtraDependencies = false) => {
  execSync("yarn install");

  if (!skipExtraDependencies) {
    execSync("yarn dlx @yarnpkg/sdks vscode");
  }

  console.log(chalk.blue("Yarn dependencies installed"));
};
