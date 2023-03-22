import chalk from "chalk";
import { execSync } from "child_process";
import { execInstallYarnDependencies } from "./install-yarn-dependencies";

// mock execSync to return a string
jest.mock("child_process", () => ({
  execSync: jest.fn(() => "mocked execSync"),
}));

// mock console.log to return a string
console.log = jest.fn();

// mock chalk blue
jest.mock("chalk", () => ({
  blue: jest.fn((text) => text),
}));

describe("execInstallYarnDependencies", () => {
  it("should call execSync with correct arguments", () => {
    execInstallYarnDependencies();

    expect(execSync).toHaveBeenCalledWith("yarn install");
  });

  it("should call console.log with correct arguments", () => {
    execInstallYarnDependencies();

    expect(console.log).toHaveBeenCalledWith(
      chalk.blue("Yarn dependencies installed")
    );
  });

  it("should call execSync with correct arguments when skipExtraDependencies is true", () => {
    execInstallYarnDependencies(true);

    expect(execSync).toHaveBeenCalledWith("yarn install");
  });
});
