#!/user/bin/env node

const chalk = require("chalk");
const figlet = require("figlet");

const { handleError, messageUser, promptUser } = require("./utilities");

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
      chalk.grey("\nEnter HELP for a list of possible commands."),
    ],
  });
};

const run = async () => {
  // intro
  init();
  //Ask questions
  try {
    await promptUser();
  } catch (error) {
    return await handleError({ error });
  }
  //show success message
};

run();
