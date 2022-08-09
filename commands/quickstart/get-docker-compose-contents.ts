export const getDockerComposeContents = (
  serviceName: string,
  dbSelection: string
) => {
  let dbConfig = "";

  if (dbSelection === "postgres") {
    dbConfig = `
  ${serviceName}_pgadmin:
    container_name: ${serviceName}_pgadmin
    restart: always
    image: dpage/pgadmin4
    env_file:
      - .env
    ports:
      - \${PGADMIN_LISTEN_PORT}:\${PGADMIN_LISTEN_PORT}
    depends_on:
      - ${serviceName}_postgres

  ${serviceName}_postgres:
    container_name: ${serviceName}_${dbSelection}
    image: postgres
    ports:
      - \${DB_PORT}:5432
    volumes:
      - ${serviceName}:/data/db_${serviceName}_${dbSelection}
    environment:
      - POSTGRES_PASSWORD=\${DB_PASSWORD}
      - POSTGRES_DB=\${DB_NAME}`;
  }

  if (dbSelection === "mariadb") {
    dbConfig = `
  ${serviceName}_mariadb:
    container_name: ${serviceName}_${dbSelection}
    image: mariadb:10.5.13
    restart: always
    ports:
      - \${DB_PORT}:${dbSelection === "mariadb" ? 3306 : 5432}
    volumes:
      - ${serviceName}:/data/db_${serviceName}_${dbSelection}
    environment:
      - MARIADB_USER=root
      - MARIADB_ROOT_PASSWORD=\${DB_PASSWORD}
      - MARIADB_DATABASE=\${DB_NAME}

  ${serviceName}_adminer:
    image: adminer
    restart: always
    ports:
      - \${PGADMIN_LISTEN_PORT}:8080
    depends_on:
      - ${serviceName}_mariadb
    environment:
      - ADMINER_DEFAULT_SERVER=${serviceName}_mariadb
      - ADMINER_DESIGN=dracula`;
  }

  return `version: '3.9'
services:
  ${serviceName}:
    container_name: ${serviceName}
    # command: yarn docker-develop
    restart: always
    build: .
    ports:
      - \${PORT}:\${PORT}
    env_file:
      - .env
    depends_on:
      - ${serviceName}_${dbSelection}
    volumes:
      - .:/app
      - ./src/public:/app/dist/public
      - ./src:/app/src
      - ./dist:/app/dist

${dbConfig}

volumes:
 ${serviceName}: {}
`;
};
