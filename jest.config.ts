import type { Config } from "@jest/types";

const config: Config.InitialOptions = {
  roots: ["commands"],
  setupFiles: ["dotenv-flow/config"],
  testResultsProcessor: "jest-sonar-reporter",
};

export default config;
