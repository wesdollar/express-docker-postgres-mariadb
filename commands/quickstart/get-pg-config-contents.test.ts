import { getPgConfigContents } from "./get-pg-config-contents";

describe("getPgConfigContents", () => {
  // it should return pg config contents
  it("should return pg config contents", () => {
    const result = getPgConfigContents(
      "mock db name",
      "mock db port",
      "mock db password",
      "mock gateway ip",
      "postgres"
    );

    expect(result).toEqual(`{
  "development": {
    "username": "root",
    "password": "mock db password",
    "database": "mock db name",
    "host": "mock gateway ip",
    "dialect": "postgres",
    "port": "mock db port",
    "seederStorage": "sequelize"
  },
  "local": {
    "username": "root",
    "password": "mock db password",
    "database": "mock db name",
    "host": "localhost",
    "dialect": "postgres",
    "port": "mock db port",
    "seederStorage": "sequelize"
  }
}
`);
  });
});
