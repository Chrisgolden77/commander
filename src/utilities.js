const chalk = require("chalk");
const inquirer = require("inquirer");
// const shell = require("shelljs");

let db = require("./db");
let transactionOpen = false;
let transactionDB = { SP: {} };

const handleUserActions = async (PROMPT) => {
  const query = PROMPT.split(" ");
  let response;
  let dbFunctions = transactionOpen ? transactionDB.SP : db.SP;
  try {
    switch (query[0]) {
      case "BEGIN":
        if (transactionOpen) {
          response =
            "A transaction is already Open. Please COMMIT or ROLLBACK changes to start a different transaction";
        } else {
          transactionOpen = true;
          transactionDB = db;
          response =
            "Opened a transaction.\n Enter COMMIT to submit any following changes, or ROLLBACK to discard.\n Both will end the transaction.";
        }
        break;
      case "COMMIT":
        const commitResponse = await handleCOMMIT();
        commitResponse && (response = commitResponse);
        break;
      case "COUNT":
        const countResponse = await dbFunctions.handleCOUNT({
          value: query[1],
        });
        countResponse && (response = countResponse);
        break;
      case "DELETE":
        const deleteResponse = await dbFunctions.handleDELETE({
          key: query[1],
        });
        deleteResponse && (response = deleteResponse);
        break;
      case "GET":
        const getResponse = await dbFunctions.handleGET({ key: query[1] });
        getResponse && (response = getResponse);
        break;
      case "SET":
        const setResponse = await dbFunctions.handleSET({
          key: query[1],
          value: query[2],
        });
        setResponse && (response = setResponse);
        break;
      case "UPDATE":
        const updateResponse = await dbFunctions.handleUPDATE({
          key: query[1],
          value: query[2],
        });
        updateResponse && (response = updateResponse);
        break;
      case "HELP":
        response =
          "- BEGIN (begins transaction)\n- COMMIT (commits open transaction)\n- COUNT <value>\n- DELETE <key>\n- GET <key>\n- HELP (lists possible commands)\n- ROLLBACK (discards changes inside open transaction)\n- or SET <key> <value>";
        break;
      case "KILL":
        messageUser({
          messages: [chalk.red.bold("KILLING PROGRAM! GOODBYE FATHER!")],
        });
        return;
      default:
        response = `Command "${query[0]}" does not exist. Type HELP for list of commands.`;
        break;
    }

    response && messageUser({ messages: [chalk.yellowBright.bold(response)] });
    return promptUserActions();
  } catch (error) {
    handleError({ error });
    return promptUserActions();
  }
};
const handleCOMMIT = async () => {
  if (!transactionOpen)
    return "No transaction opened. Enter BEGIN to open a transaction.";
  const { CONFIRM_COMMIT } = await inquirer.prompt([
    {
      name: "CONFIRM_COMMIT",
      type: "confirm",
      message: messageUser({
        messages: [
          "\nAre you sure you want to commit your changes?(this cannot be undone):",
        ],
      }),
    },
  ]);
  if (!CONFIRM_COMMIT) return "COMMIT cancelled. Transaction still open ";
  db = transactionDB;
  transactionOpen = false;
  transactionDB = { SP: {} };
  return "Changes committed. Transaction is now closed.";
};
const handleError = async ({ error }) => {
  return console.log(chalk.red.bold("ERROR: ", error));
};

const messageUser = ({ messages }) => {
  return messages.map((message) => console.log(chalk.cyanBright.bold(message)));
};
const promptUserActions = async () => {
  console.log(`*****tbd:*****`, transactionDB);
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
    return await handleUserActions(PROMPT);
  } catch (error) {
    handleError({ error });
    return promptUserActions();
  }
};

module.exports = {
  handleError,
  messageUser,
  promptUserActions,
};
