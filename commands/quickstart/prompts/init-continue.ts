import prompt from "prompts";

export const initContinue = async (): Promise<string> => {
  const { initContinue } = await prompt({
    type: "confirm",
    name: "initContinue",
    message: "Are you ready to begin?",
  });

  return initContinue;
};
