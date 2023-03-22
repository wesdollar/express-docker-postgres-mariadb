import { mkdirSync, readFileSync, writeFileSync } from "fs";
import chalk from "chalk";
import { spinUpAndConfigureDatabase } from "./spin-up-and-configure-database";

console.log = jest.fn();
console.error = jest.fn();

// mock mkdirSync to return a string
jest.mock("fs", () => ({
  mkdirSync: jest.fn(),
  readFileSync: jest.fn(() => "mocked readFileSync"),
  writeFileSync: jest.fn(),
}));

// mock cwd to return a string
jest.mock("process", () => ({
  cwd: jest.fn(() => "mocked cwd"),
}));

// mock getPgConfigContents to return a string
jest.mock("../get-pg-config-contents", () => ({
  getPgConfigContents: jest.fn(() => "mocked getPgConfigContents"),
}));

// beforeEach json.parse mock implementation once return string
beforeEach(() => {
  JSON.parse = jest.fn().mockImplementationOnce(() => ({
    development: {
      password: "mocked password",
      port: "mocked port",
      database: "mocked database",
      dialect: "mocked dialect",
    },
  }));
});

describe("spinUpAndConfigureDatabase", () => {
  it("should call mkdirSync with correct arguments", () => {
    spinUpAndConfigureDatabase(
      true,
      "mocked serviceName",
      "mocked dbSelection",
      "mocked dbPort",
      "mocked dbPassword",
      "mocked pgAdminGatewayIp"
    );

    expect(mkdirSync).toHaveBeenCalledWith("mocked cwd/config");
  });

  it("should call writeFileSync with correct arguments", () => {
    spinUpAndConfigureDatabase(
      true,
      "mocked serviceName",
      "mocked dbSelection",
      "mocked dbPort",
      "mocked dbPassword",
      "mocked pgAdminGatewayIp"
    );

    expect(writeFileSync).toHaveBeenCalledWith(
      "mocked cwd/config/config.json",
      "mocked getPgConfigContents"
    );
  });

  it("should call console.log with correct arguments", () => {
    spinUpAndConfigureDatabase(
      true,
      "mocked serviceName",
      "mocked dbSelection",
      "mocked dbPort",
      "mocked dbPassword",
      "mocked pgAdminGatewayIp"
    );

    expect(console.log).toHaveBeenCalledWith(
      chalk.blue("Sequelize config file created")
    );
  });

  it("should call readFileSync with correct arguments", () => {
    spinUpAndConfigureDatabase(
      false,
      "mocked serviceName",
      "mocked dbSelection",
      "mocked dbPort",
      "mocked dbPassword",
      "mocked pgAdminGatewayIp"
    );

    expect(readFileSync).toHaveBeenCalledWith("mocked cwd/config/config.json");
  });

  it("should call writeFileSync with correct arguments when isInit is false", () => {
    spinUpAndConfigureDatabase(
      false,
      "mocked serviceName",
      "mocked dbSelection",
      "mocked dbPort",
      "mocked dbPassword",
      "mocked pgAdminGatewayIp"
    );

    expect(writeFileSync).toHaveBeenCalledWith(
      "mocked cwd/config/config.json",
      "mocked getPgConfigContents"
    );
  });
});
