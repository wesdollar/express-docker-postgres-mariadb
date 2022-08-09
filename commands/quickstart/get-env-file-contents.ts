export const getEnvFileContents = (
  servicePort: string,
  dbPort: string,
  serviceName: string,
  dbPassword: string,
  emailAddress: string,
  pgAdminPort: string,
  dbSelection: string
  // eslint-disable-next-line max-params
) => `NODE_ENV=development
PORT=${servicePort}
API_BASE=localhost:\${PORT}
API_VERSION=v1

DB_USER=root
DB_NAME=${serviceName}_${dbSelection}
DB_PASSWORD=${dbPassword}
DB_PORT=${dbPort}

PGADMIN_DEFAULT_EMAIL=${emailAddress}
PGADMIN_DEFAULT_PASSWORD=\${DB_PASSWORD}
PGADMIN_LISTEN_PORT=${pgAdminPort}
`;
