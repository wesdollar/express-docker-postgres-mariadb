import { createFsDirectory } from "./create-fs-directory";
import rimraf from "rimraf";

// jest mock rimraf to return a mock function
jest.mock("rimraf", () => ({
  sync: jest.fn(),
}));

describe("createFsDirectory", () => {
  it("should call rimraf.sync with the correct arguments", () => {
    createFsDirectory("test");

    expect(rimraf.sync).toHaveBeenCalledWith("test");
  });
});
