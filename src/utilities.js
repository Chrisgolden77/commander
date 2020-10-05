const chalk = require("chalk");
const inquirer = require("inquirer");
// const shell = require("shelljs");

let db = require("./db");
let transactionOpen = false;
let transactionDB = { SP: {} };

const handleUserActions = async (PROMPT) => {
  const query = PROMPT.split(" ");
  let response;
  let activeDB = transactionOpen ? transactionDB : db;
  try {
    switch (query[0]) {
      case "BEGIN":
        const beginResponse = await handleBEGIN();
        beginResponse && (response = beginResponse);
        break;
      case "COMMIT":
        const commitResponse = await handleCOMMIT();
        commitResponse && (response = commitResponse);
        break;
      case "COUNT":
        const countResponse = await activeDB.SP.handleCOUNT({
          database: activeDB,
          value: query[1],
        });
        countResponse && (response = countResponse);
        break;
      case "DELETE":
        const deleteResponse = await activeDB.SP.handleDELETE({
          database: activeDB,
          key: query[1],
        });
        deleteResponse && (response = deleteResponse);
        break;
      case "GET":
        const getResponse = await activeDB.SP.handleGET({
          database: activeDB,
          key: query[1],
        });
        getResponse && (response = getResponse);
        break;
      case "SET":
        const setResponse = await activeDB.SP.handleSET({
          database: activeDB,
          key: query[1],
          value: query[2],
        });
        setResponse && (response = setResponse);
        break;
      case "UPDATE":
        const updateResponse = await activeDB.SP.handleUPDATE({
          database: activeDB,
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
      case "ROLLBACK":
        const rollbackResponse = await handleROLLBACK();
        rollbackResponse && (response = rollbackResponse);
        break;
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
const handleBEGIN = async () => {
  if (transactionOpen)
    return "A transaction is already Open. Please COMMIT or ROLLBACK changes to start a different transaction";

  transactionOpen = true;
  transactionDB = { ...db };
  Object.defineProperty(transactionDB, 'SP', {configurable: false, writable: false});

  return "Opened a transaction.\n Enter COMMIT to submit any following changes, or ROLLBACK to discard.\n Both will end the transaction.";
};
const handleCOMMIT = async () => {
  if (!transactionOpen)
    return "No transaction opened. Enter BEGIN to open a transaction.";
  const { CONFIRM_COMMIT } = await promptUserActions({
    defaultPrompt: false,
    name: "CONFIRM_COMMIT",
    type: "confirm",
    messages: [
      "\nAre you sure you want to commit your changes?(this cannot be undone):",
    ],
  });
  if (!CONFIRM_COMMIT) return "COMMIT cancelled. Transaction still open.";
  db = transactionDB;
  // Object.defineProperty(db, 'SP', {configurable: false, writable: false});
  transactionOpen = false;
  transactionDB = { SP: {} };
  return "Changes committed. Transaction is now closed.";
};
const handleError = async ({ error }) => {
  return console.log(chalk.red.bold("ERROR: ", error));
};
const handleROLLBACK = async () => {
  if (!transactionOpen)
    return "No transaction opened. Enter BEGIN to open a transaction.";
  const { CONFIRM_ROLLBACK } = await promptUserActions({
    defaultPrompt: false,
    name: "CONFIRM_ROLLBACK",
    type: "confirm",
    messages: [
      "\nAre you sure you want to ROLLBACK your changes?(this cannot be undone):",
    ],
  });
  if (!CONFIRM_ROLLBACK) return "ROLLBACK cancelled. Transaction still open.";
  transactionOpen = false;
  transactionDB = { SP: {} };
  return "Rolled back changes. Transaction is now closed.";
};
const messageUser = ({ messages }) => {
  return messages.map((message) => console.log(chalk.cyanBright.bold(message)));
};
const promptUserActions = async ({
  defaultPrompt = true,
  messages = ["\nWhat would you like to do?:"],
  name = "PROMPT",
  type = "input",
} = {}) => {
  console.log(`*****transactionOpen:*****`, transactionOpen);
  console.log(`*****tbd:*****`, transactionDB);
  console.log(`*****DB:*****`, db);
  try {
    const userAnswer = await inquirer.prompt([
      {
        name: name,
        type: type,
        message: messageUser({ messages }),
      },
    ]);
    return defaultPrompt
      ? await handleUserActions(userAnswer[name])
      : userAnswer;
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
