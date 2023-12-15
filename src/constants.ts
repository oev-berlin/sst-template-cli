import { Question, QuestionCollection } from 'inquirer';
import chalk from 'chalk';

const QUESTION_PROJECT_NAME: Question = {
  type: 'input',
  name: 'name',
  message: 'What is the name of the project?',
  validate: (input) => {
    return (
      /^(?!-)[a-zA-Z0-9-]+[a-zA-Z0-9]$/.test(input) ||
      'Project name must have the structure aA0-bB1-...-cC2'
    );
  },
};

const QUESTION_FRAMEWORK: QuestionCollection = {
  type: 'list',
  name: 'framework',
  message: 'Which Framework do you want to use?',
  choices: [
    { name: chalk.cyan('Next'), value: 'next' },
    { name: chalk.yellow('Astro'), value: 'astro' },
    { name: chalk.green('Vue'), value: 'vue', disabled: 'currently not available' },
    { name: chalk.blue('React'), value: 'react', disabled: 'currently not available' },
  ],
};

const QUESTION_NEXT_TEMPLATE: QuestionCollection = {
  type: 'list',
  name: 'template',
  message: 'Which Template do you want to use?',
  choices: [
    { name: chalk.yellow('OEV'), value: 'oev', disabled: 'currently not available' },
    { name: chalk.cyan('Default'), value: 'default' },
  ],
  when: function (answers) {
    return answers.framework === 'next';
  },
};

export const QUESTION_PROCEED_EXISTING_DIR: QuestionCollection = {
  type: 'list',
  name: 'proceed',
  message: "An empty directory with your project's name already exists. Do you want to proceed?",
  choices: [
    { name: chalk.green('YES'), value: true },
    { name: chalk.red('NO'), value: false },
  ],
};

export const QUESTIONS = [QUESTION_PROJECT_NAME, QUESTION_FRAMEWORK, QUESTION_NEXT_TEMPLATE];
export const SST_PRESET_PATH = './src/presets/base-sst';
export const BASE_PRESET_PATH = './src/presets';

export const BASE_FRONTEND_PATH = './packages/frontend';
export const BASE_BACKEND_PATH = './packages/backend';
export const REPLACE_FILES = ['package.json', 'sst.config.ts'];

export const ERR_MSG_EXISTING_DIR =
  'Error: There exists a non-empty directory or a file with the name of your project.';
export const ERR_MSG_USER_ABORT = 'Project creation aborted.';
