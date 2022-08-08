export const getPgConfigContents = (
  dbPort: string,
  dbPassword: string,
  gatewayIp: string
) => `{
  "development": {
    "username": "postgres",
    "password": "${dbPassword}",
    "database": "retailer_products",
    "host": "${gatewayIp}",
    "dialect": "postgres",
    "port": ${dbPort}
  },
  "local": {
    "username": "postgres",
    "password": "${dbPassword}",
    "database": "retailer_products",
    "host": "localhost",
    "dialect": "postgres",
    "port": ${dbPort}
  }
}
`;
