#!/user/bin/env node

const chalk = require("chalk");
const figlet = require("figlet");
const inquirer = require("inquirer");
const shell = require("shelljs");

let storageContainer = {};

const init = () => {
  console.log(
    chalk.cyan(
      figlet.textSync("WELCOME COMMANDER!", {
        font: "small",
        horizontalLayout: "default",
        verticalLayout: "default",
      })
    ),
    chalk.green(
      "\nWhat would you like to do?:\nBEGIN\nCLEAR\nCOMMIT\nCOUNT\nDELETE\nGET\nHELP\nROLLBACK\nor SET"
    )
  );
};

const run = async () => {};
// intro
init();
//Ask questions
//respond to command
//show success message

run();
