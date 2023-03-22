import { createDockerComposeYml } from "./create-docker-compose-yml";
import { getDockerComposeContents } from "../get-docker-compose-contents";
import chalk from "chalk";

global.console.log = jest.fn();

jest.mock("process", () => ({
  cwd: jest.fn(() => "test"),
}));

jest.mock("chalk", () => ({
  blue: jest.fn(() => "test"),
}));

jest.mock("../get-docker-compose-contents", () => ({
  getDockerComposeContents: jest.fn(() => "test"),
}));

jest.mock("fs", () => ({
  writeFileSync: jest.fn(() => "test"),
}));

describe("createDockerComposeYml", () => {
  it("should call getDockerComposeContents with the correct arguments", () => {
    createDockerComposeYml("test", "test");

    expect(getDockerComposeContents).toHaveBeenCalledWith("test", "test");
  });

  it("should call chalk.blue with the correct text", () => {
    createDockerComposeYml("test", "test");

    expect(chalk.blue).toHaveBeenCalledWith("docker-compose file created");
  });
});
