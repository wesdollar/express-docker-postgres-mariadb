import { exec, execSync } from "child_process";
import { readFileSync } from "fs";
import { cwd } from "process";
import chalk from "chalk";
import path from "path";
import { spinUpDockerContainers } from "./spin-up-docker-containers";

// mock console.log
console.log = jest.fn();

// create pgAdminInspectResponse mock return array
const pgAdminInspectResponse = [
  {
    NetworkSettings: {
      Networks: {
        "mocked basename_default": {
          Gateway: "mocked Gateway",
        },
      },
    },
  },
];

// mock execSync to return toString method
jest.mock("child_process", () => ({
  execSync: jest.fn(() => ({
    toString: jest.fn(() => "mocked execSync"),
  })),
  exec: jest.fn(() => ({
    toString: jest.fn(() => "mocked exec"),
  })),
}));

// mock chalk.blue return string
jest.mock("chalk", () => ({
  blue: jest.fn(() => "mocked blue"),
  red: jest.fn(() => "mocked red"),
}));

// mock path.basename return string
jest.mock("path", () => ({
  basename: jest.fn(() => "mocked basename"),
}));

// mock readFileSync return string and toString method
jest.mock("fs", () => ({
  readFileSync: jest.fn(() => ({
    toString: jest.fn(() => "mocked readFileSync"),
  })),
}));

// mock cwd return string
jest.mock("process", () => ({
  cwd: jest.fn(() => "mocked cwd"),
}));

describe("spinUpDockerContainers", () => {
  it("should call console.log", () => {
    spinUpDockerContainers("mocked serviceName", "mocked dbSelection", false);

    expect(console.log).toHaveBeenCalled();
  });

  // it should call exec with "docker-compose up"
  it("should call exec with docker-compose up", () => {
    spinUpDockerContainers("mocked serviceName", "mocked dbSelection", false);

    expect(exec).toHaveBeenCalledWith("docker-compose up");
  });
});
