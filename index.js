#!/usr/bin/env node
const commander = require('commander');
const enquirer = require('enquirer');
const chalk = require('chalk');
const fs = require('fs');
const CURR_DIR = process.cwd();
const execSync = require('child_process').execSync;
const packageJson = require('./package.json');

const CHOICES = fs.readdirSync(`${__dirname}/templates`);
const QUESTIONS = [
  {
    name: 'bundler',
    type: 'select',
    message: 'What bundler you would like to use?',
    choices: CHOICES
  }
];

const program = new commander.Command(packageJson.name)
.version(packageJson.version)
.description("A generator to create new Imba workspace")
.arguments('<project-directory>')
.usage(`${chalk.green('<project-directory>')} [options]`)
.action(function (name) {
    enquirer.prompt(QUESTIONS)
    .then(answers => {
      const projectChoice = answers['bundler'];
      const projectName = name;
      const templatePath = `${__dirname}/templates/${projectChoice}`;
    
      fs.mkdirSync(`${CURR_DIR}/${projectName}`);

      createDirectoryContents(templatePath, projectName);
      console.log();
      console.info('Your Imba project has been created! Now, go make something fast!');
      console.info('\n');
     });
  });

function createDirectoryContents (templatePath, newProjectPath) {
  const filesToCreate = fs.readdirSync(templatePath);

  filesToCreate.forEach(file => {
    const origFilePath = `${templatePath}/${file}`;
    
    // get stats about the current file
    const stats = fs.statSync(origFilePath);

    if (stats.isFile()) {
      const contents = fs.readFileSync(origFilePath, 'utf8');
      
      const writePath = `${CURR_DIR}/${newProjectPath}/${file}`;
      fs.writeFileSync(writePath, contents, 'utf8');
    } else if (stats.isDirectory()) {
      fs.mkdirSync(`${CURR_DIR}/${newProjectPath}/${file}`);
      
      // recursive call
      createDirectoryContents(`${templatePath}/${file}`, `${newProjectPath}/${file}`);
    }
  });
}

program.parse(process.argv)