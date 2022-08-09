export const getPgConfigContents = (
  database: string,
  dbPort: string,
  dbPassword: string,
  gatewayIp: string,
  dialect: string
  // eslint-disable-next-line max-params
) => {
  database = database.replace("_postgres", "");

  return `{
  "development": {
    "username": "root",
    "password": "${dbPassword}",
    "database": "${database}",
    "host": "${gatewayIp}",
    "dialect": "${dialect}",
    "port": "${dbPort}",
    "seederStorage": "sequelize"
  },
  "local": {
    "username": "root",
    "password": "${dbPassword}",
    "database": "${database}",
    "host": "localhost",
    "dialect": "${dialect}",
    "port": "${dbPort}",
    "seederStorage": "sequelize"
  }
}
`;
};
