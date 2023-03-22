import { execSync } from "child_process";
import chalk from "chalk";

export function runDatabaseSeedsAndMigrations() {
  console.log(chalk.blue("Running DB migrations and seeds"));

  try {
    execSync("yarn sequelize-db-update-local");
  } catch (error) {
    console.error(error);
  }

  console.log(chalk.blue("DB migrations and seeds completed"));
}
