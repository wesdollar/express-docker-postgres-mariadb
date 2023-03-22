import chalk from "chalk";
import { spawn } from "child_process";
import { createHuskyHooks } from "./create-husky-hooks";

const mockOn = jest.fn();

jest.mock("child_process", () => ({
  spawn: jest.fn(() => ({
    on: mockOn,
  })),
}));

describe("createHuskyHooks", () => {
  it("should call spawn with the correct arguments", () => {
    createHuskyHooks();

    expect(spawn).toHaveBeenCalledWith("yarn", ["husky-init"]);
  });

  it("should call huskyProcess.on with the correct arguments", () => {
    createHuskyHooks();

    expect(mockOn).toHaveBeenCalledWith("exit", expect.any(Function));
  });
});
