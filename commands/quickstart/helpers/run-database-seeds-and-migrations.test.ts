import { execSync } from "child_process";
import chalk from "chalk";
import { runDatabaseSeedsAndMigrations } from "./run-database-seeds-and-migrations";

// mock console log
console.log = jest.fn();
console.error = jest.fn();

// mock execSync to return a string
jest.mock("child_process", () => ({
  execSync: jest.fn(() => "mocked execSync"),
}));

// mock chalk blue return string
jest.mock("chalk", () => ({
  blue: jest.fn((text) => text),
}));

describe("runDatabaseSeedsAndMigrations", () => {
  it("should call execSync with correct arguments", () => {
    runDatabaseSeedsAndMigrations();

    expect(execSync).toHaveBeenCalledWith("yarn sequelize-db-update-local");
  });

  it("should call console.log with correct arguments", () => {
    runDatabaseSeedsAndMigrations();

    expect(console.log).toHaveBeenCalledWith(
      chalk.blue("DB migrations and seeds completed")
    );
  });

  it("should call console.error with correct arguments", () => {
    (execSync as jest.MockedFunction<typeof execSync>).mockImplementationOnce(
      () => {
        throw new Error("mocked error");
      }
    );

    runDatabaseSeedsAndMigrations();

    expect(console.error).toHaveBeenCalledWith(Error("mocked error"));
  });
});
