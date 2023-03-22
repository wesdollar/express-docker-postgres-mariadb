import { getEnvFileContents } from "./get-env-file-contents";

describe("getEnvFileContents", () => {
  it("should return env file contents", () => {
    const result = getEnvFileContents(
      "mock service port",
      "mock db port",
      "mock service name",
      "mock db password",
      "mock email address",
      "mock pg admin port",
      "postgres"
    );

    expect(result).toEqual(`NODE_ENV=development
PORT=mock service port
API_BASE=localhost:\${PORT}
API_VERSION=v1

DB_USER=root
DB_NAME=mock service name_postgres
DB_PASSWORD=mock db password
DB_PORT=mock db port

PGADMIN_DEFAULT_EMAIL=mock email address
PGADMIN_DEFAULT_PASSWORD=\${DB_PASSWORD}
PGADMIN_LISTEN_PORT=mock pg admin port
`);
  });
});
