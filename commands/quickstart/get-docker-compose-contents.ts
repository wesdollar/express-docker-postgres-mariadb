export const getDockerComposeContents = (serviceName: string) => {
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
      - ${serviceName}_postgres
    volumes:
      - .:/app
      - ./src/public:/app/dist/public
      - ./src:/app/src
      - ./dist:/app/dist

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
    container_name: ${serviceName}_postgres
    image: postgres
    ports:
      - \${DB_PORT}:5432
    volumes:
      - ${serviceName}:/data/db_${serviceName}_postgres
    environment:
      - POSTGRES_PASSWORD=\${DB_PASSWORD}
      - POSTGRES_DB=\${DB_NAME}

volumes:
 ${serviceName}: {}
`;
};
