import arg from "arg";
import inquirer from "inquirer";
import chalk from "chalk";
import fs from "fs";
import { createComponent } from "./main";

function printHelp() {
  console.log(`
    matija <flags>

    flags:
      -t (--type) -> type of the component
        %s: component | reusable
        %s: 
          component - regular .vue file with specified hooks and imports, html template, script and style (defaults to regular css)
          reusable - .js file with specified imports, mixin for Vue 2
        %s: component

      -n (--name) -> name of the component, if the component type is reusable it does not need to be supplied
        %s: test

      -v (--version) -> vue version, either vue 2 or vue 3 composition API syntax
        %s: 2 | 3
        %s: 3

      -h (--help) -> print help message

      -d (--directory) -> where the file will be created
        %s: current directory (/.), can also be written explicitly with . or /.

      -s (--skip) -> skip all prompts

      -f (--file) -> name of the newly created file
        %s: name of the component

      -hks (--hooks) -> list of injected lifecycle hooks, separated by a comma
        %s: 
          beforeCreate -> bC (Not in Vue 3)
          created -> c (Not in Vue 3)

          beforeMount -> bM
          mounted -> m

          beforeUpdate -> bU
          updated -> u

          beforeDestroy -> bD
          destroyed -> d

          activated -> a
          deactivated -> da

          errorCaptured -> eC

          onRenderTracked -> oRT (Not in Vue 2)
          onRenderTriggered -> oRTg (Not in Vue 2)

        %s: null
        %s: bM,bU,bD (can be separated by a space as well -> bM, bU, bD)
        `,
    chalk.yellow("options"),
    chalk.green("explanation"),
    chalk.blue("default"),
    chalk.blue("default"),
    chalk.yellow("options"),
    chalk.blue("default"),
    chalk.blue("default"),
    chalk.blue("default"),
    chalk.yellow("options"),
    chalk.blue("default"),
    chalk.magenta("example"),
  );
}

function parseHooks(hooks, version) {
  let areHooksValid = true;
  let splitHooks = hooks.replace(/\s/g, "").split(",");

  // Validity of hooks in general
  let validHooks = ["bC", "c", "bM", "m", "bU", "u", "bD", "d", "a", "da", "eC", "oRT", "oRTg"];

  splitHooks.forEach(x => {
    if (!validHooks.includes(x)) {
      areHooksValid = false;
    }
  });

  // Validity of the hooks according to the version
  let validHooksV2 = ["bC", "c", "bM", "m", "bU", "u", "bD", "d", "a", "da", "eC"];
  let validHooksV3 = ["bM", "m", "bU", "u", "bD", "d", "a", "da", "eC", "oRT", "oRTg"];

  if (version == 2) {
    splitHooks.forEach(x => {
      if (!validHooksV2.includes(x)) {
        areHooksValid = false;
      }
    });
  } else {
    splitHooks.forEach(x => {
      if (!validHooksV3.includes(x)) {
        areHooksValid = false;
      }
    });
  }

  return { areHooksValid, hooks: splitHooks }
}

function validateOptions(options) {
  let valid = true;

  if (!["component", "reusable"].includes(options.type)) {
    console.log(`%s`, chalk.red.bold("Invalid file type!"));
    valid = false;
  }

  if (![2, 3].includes(options.version)) {
    console.log(`%s`, chalk.red.bold("Invalid Vue version!"));
    valid = false;
  }

  if (options.hooks != null) {
    let { areHooksValid, hooks } = parseHooks(options.hooks, options.version);

    if (!areHooksValid) {
      console.log(`%s`, chalk.red.bold("Invalid hooks supplied!"));
      valid = false;
    }

    options.hooks = hooks
  }

  if (options.directory !== null) {
    if (!fs.existsSync(options.directory)) {
      console.log(`%s`, chalk.red.bold("Invalid directory!"));
      valid = false;
    }
  }

  if (options.type == "reusable" && options.name !== "test") {
    console.log(`%s`, chalk.blue.bold("You do not need to supply a name for a reusable component!"));
  }

  return valid;
}

function parseArgumentIntoOptions(rawArgs) {
  const args = arg({
    "--type": String,
    "--name": String,
    "--version": Number,
    "--help": Boolean,
    "--directory": String,
    "--hooks": String,
    "--skip": Boolean,
    "--file": String,
    "--imports": String,
    "-n": "--name",
    "-t": "--type",
    "-v": "--version",
    "-h": "--help",
    "-d": "--directory",
    "-hks": "--hooks",
    "-s": "--skip",
    "-f": "--file",
    "-i": "--imports"
  }, {
    argv: rawArgs.slice(2)
  });
  return {
    type: args["--type"] || "component",
    name: args["--name"] || "test",
    file: args["--file"] || args["--name"] || "test",
    version: args["--version"] || 3,
    help: args["--help"] || false,
    directory: args["--directory"] || null,
    hooks: args["--hooks"] || null,
    skip: args["--skip"] || false
  }
}

async function promptForMissingOptions(options) {
  const defaultComponent = "component";
  const questions = [];

  if (!options.skip) {
    questions.push({
      type: "list",
      name: "component-type",
      message: "Which type of file do you want to generate?",
      choices: ["component", "reusable"],
      default: defaultComponent
    });
  }

  const answers = await inquirer.prompt(questions);

  return {
    ...options,
    type: options.type || answers["component-type"]
  }
}

export async function cli(args) {
  let options = parseArgumentIntoOptions(args);

  if (options.help) {
    printHelp();
    return;
  }

  if (!validateOptions(options)) {
    console.log(`%s`, chalk.red.bold("Failed to create file!"));
    return;
  }

  options = await promptForMissingOptions(options);

  await createComponent(options);
}