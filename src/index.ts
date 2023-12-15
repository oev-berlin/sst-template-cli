import inquirer, { Answers } from 'inquirer';
import {
  BASE_FRONTEND_PATH,
  BASE_PRESET_PATH,
  ERR_MSG_EXISTING_DIR,
  ERR_MSG_USER_ABORT,
  QUESTION_PROCEED_EXISTING_DIR,
  QUESTIONS,
  SST_PRESET_PATH,
} from './constants.js';
import ora from 'ora';
import path from 'path';
import { fileURLToPath } from 'url';
import { copyFilesToDestination, exists, isEmptyDir } from './util/fsutils.js';

const moduleBasePath = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');

export const main = async () => {
  const { name, framework, template }: Answers = await inquirer.prompt(QUESTIONS);
  const spinner = ora(`Setting up your ${framework}-Project: ${name}`);

  try {
    const newProjectBase = await checkDestination(name);
    spinner.start();
    await createBaseSSTProject(name);
    await createFrameworkProject(newProjectBase, framework, template);
  } catch (e) {
    let msg = 'An unknown error occured.';
    switch ((e as Error).message) {
      case 'Existing file or non-empty dir.':
        msg = ERR_MSG_EXISTING_DIR;
        break;
      case 'Canceled by user.':
        msg = ERR_MSG_USER_ABORT;
        break;
    }
    process.env.DEBUG && console.log('\n', e);
    spinner.fail(msg);
    process.exit(1);
  }
  spinner.succeed(`Your new project '${name}' is ready to go!`);
};



// Check if the project base path exists.
// If yes and it's non-empty, abort.
// If yes and it's empty, ask the user if we should proceed.
const checkDestination = async (appName: string) => {
  const newProjectBase = path.join(process.cwd(), appName);
  if (await exists(newProjectBase)) {
    if (await isEmptyDir(newProjectBase)) {
      const answer = await inquirer.prompt(QUESTION_PROCEED_EXISTING_DIR);
      if (!answer.proceed) {
        throw new Error('Canceled by user.');
      }
    } else {
      throw new Error('Existing file or non-empty dir.');
    }
  }

  return newProjectBase;
};

const createBaseSSTProject = async (newProjectBase: string) => {
  const sstPresetSource = path.join(moduleBasePath, SST_PRESET_PATH);

  await copyFilesToDestination(newProjectBase, sstPresetSource);
};

const createFrameworkProject = async (
  newProjectBase: string,
  framework: string,
  template?: string
) => {
  const destination = path.join(newProjectBase, BASE_FRONTEND_PATH);
  const frameworkPresetSource = path.join(
    moduleBasePath,
    BASE_PRESET_PATH,
    framework,
    template || ''
  );

  await copyFilesToDestination(destination, frameworkPresetSource);
};
