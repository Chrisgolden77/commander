#!/user/bin/env node

const chalk = require("chalk");
const figlet = require("figlet");

const { handleError, messageUser, promptUserActions } = require("./utilities");

const init = () => {
  messageUser({
    messages: [
      chalk.magentaBright.bold(
        figlet.textSync("WELCOME COMMANDER!", {
          font: "small",
          horizontalLayout: "default",
          verticalLayout: "default",
        })
      ),
      chalk.grey("\nI live to serve you.\nEnter HELP for a list of possible commands."),
    ],
  });
};

const run = async () => {
  // intro
  init();
  //Ask questions
  try {
    await promptUserActions();
  } catch (error) {
    await handleError({ error });
    return promptUserActions();
  }
  //show success message
};

run();
