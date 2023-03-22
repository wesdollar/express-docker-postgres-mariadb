import prompts from "prompts";

type EnvironmentInfo = {
  emailAddress: string;
  promptedDbPassword: string;
  servicePort: string;
  dbPort: string;
  pgAdminPort: string;
  serviceName: string;
  dbSelection: string;
};

export const collectEnvironmentInfo = async (): Promise<EnvironmentInfo> => {
  const {
    emailAddress,
    promptedDbPassword,
    servicePort,
    dbPort,
    pgAdminPort,
    serviceName,
    dbSelection,
  } = await prompts([
    {
      type: "text",
      name: "emailAddress",
      message: "Email address:",
    },
    {
      type: "text",
      name: "serviceName",
      message: "Service Name:",
    },
    {
      type: "text",
      name: "servicePort",
      message: "Service Port:",
      initial: "34567",
    },
    {
      type: "select",
      name: "dbSelection",
      message: "DB Selection:",
      initial: 0,
      choices: [
        { title: "Postgres", value: "postgres" },
        { title: "MariaDB", value: "mariadb" },
      ],
    },
    {
      type: "text",
      name: "dbPort",
      message: "DB Port:",
      initial: "5433",
    },
    {
      type: "text",
      name: "promptedDbPassword",
      message: "DB Password:",
    },
    {
      type: "text",
      name: "pgAdminPort",
      message: "DB GUI Port:",
      initial: "34568",
    },
  ]);

  return {
    emailAddress,
    promptedDbPassword,
    servicePort,
    dbPort,
    pgAdminPort,
    serviceName,
    dbSelection,
  };
};
