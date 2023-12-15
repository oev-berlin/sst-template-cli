import inquirer, { Answers } from 'inquirer';
import {
  BASE_FRONTEND_PATH,
  BASE_PRESET_PATH,
  ERR_MSG_EXISTING_DIR,
  ERR_MSG_USER_ABORT,
  QUESTIONS,
  SST_PRESET_PATH,
} from './constants.js';
import ora from 'ora';
import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';
import { copyFilesToDestination, exists } from './util/fsUtils.js';

const moduleBasePath = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');

export const main = async () => {
  const { name, framework, template }: Answers = await inquirer.prompt(QUESTIONS);
  const spinner = ora(`Setting up your ${framework}-Project: ${name}`).start();
  const newProjectBase = path.join(process.cwd(), name);

  if (await exists(newProjectBase)) {
    spinner.fail(ERR_MSG_EXISTING_DIR);
    process.exit(1);
  }

  try {
    await createBaseSSTProject(newProjectBase);
    await createFrameworkProject(newProjectBase, framework, template);
  } catch (e) {
    let msg = 'An unknown error occured.';
    switch ((e as Error).message) {
      case 'Canceled by user.':
        // This is currently never thrown, but it might in the future.
        msg = ERR_MSG_USER_ABORT;
        break;
    }
    process.env.DEBUG && console.log('\n', e);
    spinner.info('Cleaning up temporary files.');
    // This could potentially thwrow again, but we just assume it does not.
    if (await exists(newProjectBase)) await fs.rm(newProjectBase, { recursive: true });

    spinner.fail(msg);
    process.exit(1);
  }
  spinner.succeed(`Your new project '${name}' is ready to go!`);
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
