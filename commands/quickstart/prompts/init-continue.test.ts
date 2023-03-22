import prompt from "prompts";
import { initContinue } from "./init-continue";

jest.mock("prompts", () => ({
  __esModule: true,
  default: jest.fn(() => ({
    initContinue: "mocked initContinue",
  })),
}));

describe("initContinue", () => {
  it("should call prompt", async () => {
    await initContinue();

    expect(prompt).toHaveBeenCalled();
  });

  it("should return initContinue", async () => {
    const result = await initContinue();

    expect(result).toEqual("mocked initContinue");
  });
});
