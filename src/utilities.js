const chalk = require("chalk");
const figlet = require("figlet");
const inquirer = require("inquirer");
const shell = require("shelljs");

const actions = (PROMPT) => {
  switch (PROMPT) {
    case "HELP":
      messageUser({
        messages: [
          "- BEGIN (begins transaction)\n- COMMIT (commits open transaction)\n- COUNT <value>\n- DELETE <key>\n- GET <key>\n- HELP (lists possible commands)\n- ROLLBACK (discards changes inside open transaction)\n- or SET <key> <value>",
        ],
      });
      return promptUser();
    case "KILL":
      handleError({ errors: ["KILLING PROGRAM! GOODBYE FATHER!"] });
      break;
    default:
      handleError({
        errors: ["Command does not exist. Type HELP for list of commands."],
      });
      return promptUser();
  }
};

const handleError = async ({ errors }) => {
  return errors.map((error) => console.log(chalk.red.bold("ERROR: ", error)));
};
const messageUser = ({ messages }) => {
  return messages.map((message) =>
    console.log(chalk.cyanBright.bold(message))
  );
};
const promptUser = async () => {
  try {
    const answers = await inquirer.prompt([
      {
        name: "PROMPT",
        type: "input",
        message: messageUser({ messages: ["\nWhat would you like to do?:"] }),
      },
    ]);
    const { PROMPT } = answers;
    //respond to command
    const result = await actions(PROMPT);
  } catch (error) {
    return handleError({ errors: [...error] });
  }
};

module.exports = {
  handleError,
  messageUser,
  promptUser,
};
