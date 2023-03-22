import prompts from "prompts";
import { collectEnvironmentInfo } from "./collect-environment-info";

// mock prompts return object
jest.mock("prompts", () => ({
  __esModule: true,
  default: jest.fn(() => ({
    emailAddress: "mocked emailAddress",
    promptedDbPassword: "mocked promptedDbPassword",
    servicePort: "mocked servicePort",
    dbPort: "mocked dbPort",
    pgAdminPort: "mocked pgAdminPort",
    serviceName: "mocked serviceName",
    dbSelection: "mocked dbSelection",
  })),
}));

describe("collectEnvironmentInfo", () => {
  it("should call prompts", async () => {
    await collectEnvironmentInfo();

    expect(prompts).toHaveBeenCalled();
  });
});
