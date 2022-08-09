export const getPgConfigContents = (
  serviceName: string,
  dbPort: string,
  dbPassword: string,
  gatewayIp: string
  // eslint-disable-next-line max-params
) => {
  serviceName = serviceName.replace("_postgres", "");

  return `{
  "development": {
    "username": "postgres",
    "password": "${dbPassword}",
    "database": "${serviceName}_postgres",
    "host": "${gatewayIp}",
    "dialect": "postgres",
    "port": "${dbPort}"
  },
  "local": {
    "username": "postgres",
    "password": "${dbPassword}",
    "database": "${serviceName}_postgres",
    "host": "localhost",
    "dialect": "postgres",
    "port": "${dbPort}"
  }
}
`;
};
