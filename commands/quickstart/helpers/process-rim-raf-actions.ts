import chalk from "chalk";
import rimraf from "rimraf";

export const processRimRafActions = () => {
  try {
    rimraf.sync("config");
    rimraf.sync(".env");
    rimraf.sync("docker-compose.yml");
  } catch (error) {
    console.error(error);
  }

  console.log(chalk.blue("rerun files cleared"));
};
