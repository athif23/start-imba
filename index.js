#!/usr/bin/env node

/**
 * All the thing here is inspired by https://github.com/facebook/create-react-app/blob/master/packages/create-react-app/createReactApp.js.
 * I did not own any code here, I just write it.
 */

const validateProjectName = require("validate-npm-package-name");
const chalk = require("chalk");
const commander = require("commander");
const enquirer = require("enquirer");
const fs = require("fs-extra");
const path = require("path");
const semver = require("semver");
const { exec, execSync } = require("child_process");
const spawn = require('cross-spawn');
const os = require('os');
const boxen = require('boxen');
const CURR_DIR = process.cwd();

const packageJson = require("./package.json");
const webpackPackages = require("./package-webpack.json");
const parcelPackages = require("./package-parcel.json");

const CHOICES = fs.readdirSync(`${__dirname}/templates`);

const QUESTIONS = [
  {
    name: "bundler",
    type: "select",
    message: "What bundler you would like to use?",
    choices: CHOICES
  },
  {
    name: "username",
    type: "input",
    message: "Who is the author?"
  },
  {
    name: "install",
    type: "confirm",
    message: "Do you want to install all the packages?"
  }
];

let projectName;
let authorName;

function cancelCommand(msg){
  console.log();
  console.error(chalk.red(msg));
  console.log();
  process.exit();
}

const program = new commander.Command(packageJson.name)
  .version(packageJson.version)
  .description("A generator to create new Imba workspace")
  .arguments("<project-directory>")
  .usage(`${chalk.green("<project-directory>")} [options]`)
  .option("--use-npm", "use npm to install package instead of yarn", 'use')
  .action(function(name, cmd) {
    if (fs.existsSync(CURR_DIR + "/" + name)){
      cancelCommand(`Commands canceled! That name already exist.\nTry change the name of your project.`);
    }
    checkAppName(name);
    enquirer.prompt(QUESTIONS).then(answers => {
      if(answers["bundler"] === undefined){
        cancelCommand(`Commands canceled!`);
      } else if (answers["username"] === undefined){
        cancelCommand(`Commands canceled!`);
      } else if(answers["install"] === undefined){
        cancelCommand(`Commands canceled!`);
      }
      const projectChoice = answers["bundler"];
      const projectAuthor = answers["username"];
      const install = answers["install"];
      const templatePath = `${__dirname}/templates/${projectChoice}`;
      fs.mkdirSync(`${CURR_DIR}/${name}`);
      authorName = projectAuthor;
      projectName = name;
      let useNpm = cmd.useNpm === "use" ? true : false;
      createDirectoryContents(templatePath, name);
      createPackageJson(projectName, authorName, useNpm, install, projectChoice);
    });
  });

process.on('unhandledRejection', (reason, p) => {
  console.log();
  console.error(chalk.red(`Commands canceled! Something went wrong.`));
  console.log();
  console.log(reason);
  process.exit();
});

function printValidationResults(results) {
  if (typeof results !== "undefined") {
    results.forEach(error => {
      console.error(chalk.red(` * ${error}`));
    });
  }
}

function createDirectoryContents(templatePath, newProjectPath) {
  const filesToCreate = fs.readdirSync(templatePath);

  filesToCreate.forEach(file => {
    const origFilePath = `${templatePath}/${file}`;

    // get stats about the current file
    const stats = fs.statSync(origFilePath);

    if (stats.isFile()) {
      const contents = fs.readFileSync(origFilePath, "utf8");

      const writePath = `${CURR_DIR}/${newProjectPath}/${file}`;
      fs.writeFileSync(writePath, contents, "utf8");
    } else if (stats.isDirectory()) {
      fs.mkdirSync(`${CURR_DIR}/${newProjectPath}/${file}`);

      // recursive call
      createDirectoryContents(
        `${templatePath}/${file}`,
        `${newProjectPath}/${file}`
      );
    }
  });
}

function createPackageJson(name, authorName, useNpm, installPk, pkg) {
  const root = path.resolve(name);
  const appName = path.basename(root);

  fs.ensureDirSync(name);
  console.log();
  console.log(`Starting to create a new Imba project in ${chalk.green(root)}.`);
  console.log();

  const packagesToInstall = pkg === "parcel" ? parcelPackages : webpackPackages;

  const packageJson = {
    name: appName,
    version: "0.1.0",
    author: authorName,
    private: true,
    ...packagesToInstall
  };

  fs.writeFileSync(
    path.join(root, "package.json"),
    JSON.stringify(packageJson, null, 2) + os.EOL
  );

  const useYarn = useNpm ? false : shouldUseYarn();
  if (installPk === true){
    run(root, appName, useYarn, pkg);
  }else{
    console.log('Project created!');
    console.log();
  }
}

function checkAppName(appName) {
  const validationResult = validateProjectName(appName);
  if (!validationResult.validForNewPackages) {
    console.error(
      `Could not create a project called ${chalk.red(
        `"${appName}"`
      )} because of npm naming restrictions:`
    );
    printValidationResults(validationResult.errors);
    printValidationResults(validationResult.warnings);
    console.log();
    process.exit(1);
  }

  // TODO: there should be a single place that holds the dependencies
  const dependencies = ["imba", "imba-router"].sort();
  if (dependencies.indexOf(appName) >= 0) {
    console.error(
      chalk.red(
        `We cannot create a project called ${chalk.green(
          appName
        )} because a dependency with the same name exists.\n` +
          `Due to the way npm works, the following names are not allowed:\n\n`
      ) +
        chalk.cyan(dependencies.map(depName => `  ${depName}`).join("\n")) +
        chalk.red("\n\nPlease choose a different project name.")
    );
    process.exit(1);
  }
}

function shouldUseYarn() {
  try {
    execSync("yarnpkg --version", { stdio: "ignore" });
    return true;
  } catch (e) {
    return false;
  }
}

function run(root, appName, useYarn, pkg) {
  console.log("Installing dependencies. This for sure will take a couple of minutes. Prepare yourself!");
  const originalDirectory = process.cwd();
  process.chdir(root);
  if (!useYarn && !checkThatNpmCanReadCwd()) {
    process.exit(1);
  }
  let manager;
  let msg;
  if(useYarn){
    manager = "yarn";
  }else{
    manager = "npm";
  }
  const webpackMsg = `All Packages Installed!\n\nYou can type '${manager} run dev' to start webpack server.\n  The server will be available in localhost:8080`;
  const parcelMsg = `All Packages Installed!\n\nYou can type '${manager} start' to start parcel server.\n  The server will be available in localhost:1234`;
  console.log();
  install(root, useYarn, false).then(() => {
    if(useYarn){ 
      console.log();
      console.log(boxen(webpackMsg, {padding: 1, borderStyle: 'classic'}));
      console.log();
    }else{
      console.log();
      console.log(boxen(parcelMsg, {padding: 1, borderStyle: 'classic'}));
      console.log();
    }
  });
}

function install(root, useYarn) {
  return new Promise((resolve, reject) => {
    let command;
    let args;

    if (useYarn) {
      command = 'yarn';
      args = ['install'];

      args.push('--cwd');
      args.push(root);
    } else {
      command = 'npm';
      args = [
        'install',
      ]
    }

    const child = spawn(command, args, { stdio: 'inherit' });
    child.on('close', code => {
      if (code !== 0) {
        reject({
          command: `${command} ${args.join(' ')}`,
        });
        return;
      }
      resolve();
    });
  });
}

function checkThatNpmCanReadCwd() {
  const cwd = process.cwd();
  let childOutput = null;
  try {
    childOutput = spawn.sync('npm', ['config', 'list']).output.join('');
  } catch (err) {
    return true;
  }
  if (typeof childOutput !== 'string') {
    return true;
  }
  const lines = childOutput.split('\n');

  const prefix = '; cwd = ';
  const line = lines.find(line => line.indexOf(prefix) === 0);
  if (typeof line !== 'string') {
    return true;
  }
  const npmCWD = line.substring(prefix.length);
  if (npmCWD === cwd) {
    return true;
  }
  console.error(
    chalk.red(
      `Could not start an npm process in the right directory.\n\n` +
        `The current directory is: ${chalk.bold(cwd)}\n` +
        `However, a newly started npm process runs in: ${chalk.bold(
          npmCWD
        )}\n\n` +
        `This is probably caused by a misconfigured system terminal shell.`
    )
  );
  if (process.platform === 'win32') {
    console.error(
      chalk.red(`On Windows, this can usually be fixed by running:\n\n`) +
        `  ${chalk.cyan(
          'reg'
        )} delete "HKCU\\Software\\Microsoft\\Command Processor" /v AutoRun /f\n` +
        `  ${chalk.cyan(
          'reg'
        )} delete "HKLM\\Software\\Microsoft\\Command Processor" /v AutoRun /f\n\n` +
        chalk.red(`Try to run the above two lines in the terminal.\n`) +
        chalk.red(
          `To learn more about this problem, read: https://blogs.msdn.microsoft.com/oldnewthing/20071121-00/?p=24433/`
        )
    );
  }
  return false;
}

program.parse(process.argv);