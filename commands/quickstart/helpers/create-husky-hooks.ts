import chalk from "chalk";
import { spawn } from "child_process";

export const createHuskyHooks = () => {
  const huskyProcess = spawn("yarn", ["husky-init"]);

  huskyProcess.on("exit", () => {
    console.log(chalk.blue("Husky initialized"));
  });
};
