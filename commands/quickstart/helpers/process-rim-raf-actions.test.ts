import chalk from "chalk";
import rimraf from "rimraf";
import { processRimRafActions } from "./process-rim-raf-actions";

// mock rimraf sync
jest.mock("rimraf", () => ({
  sync: jest.fn(),
}));

// mock chalk blue return string
jest.mock("chalk", () => ({
  blue: jest.fn((text) => text),
}));

const mockRimraf = rimraf as jest.Mocked<typeof rimraf>;

// mock console.log to return a string
console.log = jest.fn((text) => text);
console.error = jest.fn((text) => text);

describe("processRimRafActions", () => {
  it("should call rimraf.sync with correct arguments", () => {
    processRimRafActions();

    expect(rimraf.sync).toHaveBeenCalledWith("config");
    expect(rimraf.sync).toHaveBeenCalledWith(".env");
    expect(rimraf.sync).toHaveBeenCalledWith("docker-compose.yml");
  });

  it("should call console.log with correct arguments", () => {
    processRimRafActions();

    expect(console.log).toHaveBeenCalledWith(chalk.blue("rerun files cleared"));
  });

  // test throwing error console.error should be called
  it("should call console.error with correct arguments", () => {
    mockRimraf.sync.mockImplementationOnce(() => {
      throw new Error("mocked error");
    });

    processRimRafActions();

    expect(console.error).toHaveBeenCalledWith(Error("mocked error"));
  });
});
