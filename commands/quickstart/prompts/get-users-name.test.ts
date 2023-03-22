import prompts from "prompts";
import { getUsersName } from "./get-users-name";

// mock prompts return object with nanme property
jest.mock("prompts", () => ({
  __esModule: true,
  default: jest.fn(() => ({
    name: "mocked name",
  })),
}));

// mock console.log
console.log = jest.fn((text) => text);

describe("getUsersName", () => {
  it("should call prompts", async () => {
    await getUsersName();

    expect(prompts).toHaveBeenCalled();
  });

  // it should call console.log with correct string
  it("should call console.log with correct string", async () => {
    await getUsersName();

    expect(console.log).toHaveBeenCalledWith(
      `
      Hello, mocked name! Let's get started setting up your environment!

      Here's what we'll be doing:

      - Creating your .env file
      - Setting up the Docker containers for the service, DB, and DB web interface
      - Configuring your DB connection
      - Running the DB migration and seeds
      `
    );
  });
});
