const chalk = require("chalk");
const figlet = require("figlet");
const inquirer = require("inquirer");
const shell = require("shelljs");

// const { handleCOUNT, handleDELETE, handleGET, handleSET } = require("./db");
const db = require("./db");

const actions = async (PROMPT) => {
  const query = PROMPT.split(" ");
  switch (query[0]) {
    case "DELETE":
      const deleteResponse = await db.handleDELETE({ key: query[1] });
      deleteResponse && messageUser({ messages: [deleteResponse] });
      return promptUser();
    case "GET":
      const getResponse = await db.handleGET({ key: query[1] });
      getResponse && messageUser({ messages: [getResponse] });
      return promptUser();
    case "SET":
      const setResponse = await db.handleSET({ key: query[1], value: query[2] });
      setResponse && messageUser({ messages: [setResponse] });
      return promptUser();
    case "HELP":
      messageUser({
        messages: [
          "- BEGIN (begins transaction)\n- COMMIT (commits open transaction)\n- COUNT <value>\n- DELETE <key>\n- GET <key>\n- HELP (lists possible commands)\n- ROLLBACK (discards changes inside open transaction)\n- or SET <key> <value>",
        ],
      });
      return promptUser();
    case "KILL":
      handleError({ error: "KILLING PROGRAM! GOODBYE FATHER!" });
      break;
    default:
      handleError({
        error: `Command "${query[0]}" does not exist. Type HELP for list of commands.`,
      });
      return promptUser();
  }
};

const handleError = async ({ error }) => {
  return console.log(chalk.red.bold("ERROR: ", error));
};

const messageUser = ({ messages }) => {
  return messages.map((message) => console.log(chalk.cyanBright.bold(message)));
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
    handleError({ error });
    return promptUser();
  }
};

module.exports = {
  handleError,
  messageUser,
  promptUser,
};
