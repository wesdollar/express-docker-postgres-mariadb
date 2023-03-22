import prompts from "prompts";

export const getUsersName = async () => {
  const { name } = await prompts({
    type: "text",
    name: "name",
    message: "Hi, what's your name?",
  });

  console.log(
    `
      Hello, ${name}! Let's get started setting up your environment!

      Here's what we'll be doing:

      - Creating your .env file
      - Setting up the Docker containers for the service, DB, and DB web interface
      - Configuring your DB connection
      - Running the DB migration and seeds
      `
  );
};
