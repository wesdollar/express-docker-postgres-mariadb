import chalk from "chalk";
import { writeFileSync } from "fs";
import { cwd } from "process";
import { getEnvFileContents } from "../get-env-file-contents";
import { generateEnvFile } from "./generate-env-file";

jest.mock("fs", () => ({
  writeFileSync: jest.fn(),
}));

jest.mock("process", () => ({
  cwd: jest.fn(() => "/home/user"),
}));

jest.mock("../get-env-file-contents", () => ({
  getEnvFileContents: jest.fn(() => "env file contents"),
}));

jest.mock("chalk", () => ({
  blue: jest.fn((text) => text),
}));

console.log = jest.fn();

describe("generateEnvFile", () => {
  const servicePort = "3000";
  const dbPort = "5432";
  const serviceName = "test-service";
  const dbPassword = "test-password";
  const emailAddress = "test@email.com";
  const pgAdminPort = "5050";
  const dbSelection = "postgres";

  it("should call writeFileSync with correct arguments", () => {
    generateEnvFile({
      servicePort,
      dbPort,
      serviceName,
      dbPassword,
      emailAddress,
      pgAdminPort,
      dbSelection,
    });

    expect(writeFileSync).toHaveBeenCalledWith(
      "/home/user/.env",
      "env file contents"
    );
  });

  it("should call console.log with correct arguments", () => {
    generateEnvFile({
      servicePort,
      dbPort,
      serviceName,
      dbPassword,
      emailAddress,
      pgAdminPort,
      dbSelection,
    });

    expect(console.log).toHaveBeenCalledWith(chalk.blue("Created .env file"));
  });

  it("should call getEnvFileContents with correct arguments", () => {
    generateEnvFile({
      servicePort,
      dbPort,
      serviceName,
      dbPassword,
      emailAddress,
      pgAdminPort,
      dbSelection,
    });

    expect(getEnvFileContents).toHaveBeenCalledWith(
      servicePort,
      dbPort,
      serviceName,
      dbPassword,
      emailAddress,
      pgAdminPort,
      dbSelection
    );
  });

  it("should call cwd with correct arguments", () => {
    generateEnvFile({
      servicePort,
      dbPort,
      serviceName,
      dbPassword,
      emailAddress,
      pgAdminPort,
      dbSelection,
    });

    expect(cwd).toHaveBeenCalledWith();
  });
});
