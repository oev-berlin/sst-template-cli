import { Question, QuestionCollection } from 'inquirer';
import chalk from 'chalk';

const QUESTION_PROJECT_NAME: Question = {
  type: 'input',
  name: 'name',
  message: 'What is the name of the project?',
};

const QUESTION_FRAMEWORK: QuestionCollection = {
  type: 'list',
  name: 'framework',
  message: 'Which Framework do you want to use?',
  choices: [
    { name: chalk.cyan('Next'), value: 'next' },
    { name: chalk.yellow('Astro'), value: 'astro' },
    { name: chalk.green('Vue'), value: 'vue' },
    { name: chalk.blue('React'), value: 'react' },
  ],
};

const QUESTION_NEXT_TEMPLATE: QuestionCollection = {
  type: 'list',
  name: 'template',
  message: 'Which Template do you want to use?',
  choices: [
    { name: chalk.yellow('OEV'), value: 'oev' },
    { name: chalk.cyan('Default'), value: 'default' },
  ],
  when: function (answers) {
    return answers.framework === 'next';
  },
};

export const QUESTIONS = [QUESTION_PROJECT_NAME, QUESTION_FRAMEWORK, QUESTION_NEXT_TEMPLATE];
export const SST_PRESET = 'src/presets/base-sst';
export const BASE_PRESET = 'src/presets';

export const BASE_FRONTEND = 'packages/frontend';
export const BASE_BACKEND = 'packages/backend';
export const REPLACE_FILES = ['package.json', 'sst.config.ts'];
