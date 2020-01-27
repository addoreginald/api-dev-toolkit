#! /usr/bin/env node

const commander = require("commander");
const { prompt } = require("inquirer");
const colors = require("colors");
const cTable = require("console.table");

const {
  ApplicationNameExists,
  NewAccessKey,
  ListAccessKeys
} = require("./../security/ApplicationFirewall");
const uuid = require("uuid/v4");

/**
 * Menus
 * -----
 */

const mainMenu = [
  {
    type: "list",
    name: "mainMenu",
    message: "Main Menu",
    choices: ["Firewall Management"]
  }
];

const firewallManagementMenu = [
  {
    type: "list",
    name: "firewallManagementMenu",
    message: "Firewall Management Menu",
    choices: ["Application Access Keys"]
  }
];

const applicationAccessKeysMenu = [
  {
    type: "list",
    name: "applicationAccessKeysMenu",
    message: "Application Access Keys Menu",
    choices: ["New access key", "List access keys"]
  }
];

/**
 * Questions
 * ---------
 */

const createAccessKeyQuestions = [
  {
    type: "input",
    name: "applicationAlias",
    message: "Enter a unique application name",
    validate: async (answer, hash) => {
      try {
        const response = await ApplicationNameExists(answer);

        if (response === false) {
          return true;
        } else {
          return "Application name already exists";
        }
      } catch (error) {
        return "Application name already exists";
      }
    }
  },
  {
    type: "input",
    name: "applicationID",
    message: "Please provide an applicationID"
  },
  {
    type: "confirm",
    name: "isThirdParty",
    message: "Is this application a third party application?"
  },
  {
    type: "confirm",
    name: "isDev",
    message: "Is this application in the developement stage?"
  },
  {
    type: "input",
    name: "applicationIconUrl",
    message: "Please provide an application icon url"
  }
];

/**
 * Functions
 * ---------
 */

async function listAccessKeys() {
  try {
    // create new access key
    const results = await ListAccessKeys();

    console.table(results);
  } catch (error) {
    console.log(error);
  }
}

async function createAccessKey() {
  try {
    let answers = await prompt(createAccessKeyQuestions);

    const timestamp = new Date();

    // generate access key
    payload = {
      ...answers,
      applicationID: Number.parseInt(answers.applicationID),
      isThirdParty: answers.isThirdParty ? 1 : 0,
      isDev: answers.isDev ? 1 : 0,
      accessKeyID: uuid(),
      accessKeyValue: uuid().replace(/-/g, ""),
      createdAt: timestamp,
      updatedAt: timestamp
    };

    // create new access key
    const results = await NewAccessKey(payload);

    console.log(`Access-Key: ${results.accessKeyValue}`.cyan.bold);
  } catch (error) {
    console.log(error);
  }
}

/**
 * Commands
 * --------
 */

commander.version("1.0.0").description("SDK CLI for mftl-service-sdk");

/**
 * Name: New App Key
 * Description: This command creates a new application key
 */

commander
  .command("firewall")
  .description("Manage firewall")
  .action(async () => {
    // Get choice from user
    const choice = await prompt(mainMenu);

    switch (choice.mainMenu) {
      case "Firewall Management":
        const choice = await prompt(firewallManagementMenu);

        switch (choice.firewallManagementMenu) {
          case "Application Access Keys":
            const choice = await prompt(applicationAccessKeysMenu);
            switch (choice.applicationAccessKeysMenu) {
              case "New access key":
                createAccessKey();
                break;

              case "List access keys":
                listAccessKeys();
                break;

              default:
                break;
            }

            break;

          default:
            break;
        }

        break;

      default:
        break;
    }
  });

commander.parse(process.argv);
