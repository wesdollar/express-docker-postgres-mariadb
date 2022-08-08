export const getEnvFileContents = (
  emailAddress: string,
  dbPassword: string,
  servicePort: string,
  dbPort: string,
  pgAdminPort: string
  // eslint-disable-next-line max-params
) => `NODE_ENV=development
PORT=${servicePort}
API_BASE=localhost:\${PORT}
API_VERSION=v1

DB_USER=postgres
DB_HOST=db
DB_NAME=retailer_products
DB_PASSWORD=${dbPassword}
DB_PORT=${dbPort}

PGADMIN_DEFAULT_EMAIL=${emailAddress}
PGADMIN_DEFAULT_PASSWORD=\${DB_PASSWORD}
PGADMIN_LISTEN_PORT=${pgAdminPort}
`;
