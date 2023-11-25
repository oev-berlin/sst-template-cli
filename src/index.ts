import inquirer, { Answers } from 'inquirer';
import { BASE_FRONTEND, BASE_PRESET, QUESTIONS, SST_PRESET } from './constants.js';
import ora from 'ora';
import fs from 'fs/promises';
import path from 'path';

export const main = async () => {
  const { name, framework, template }: Answers = await inquirer.prompt(QUESTIONS);

  const spinner = ora(`Setup your ${framework} Project: ${name}`).start();
  const destination = await createBaseSSTProject(name);

  await createFrameworkProject(destination, framework, template);
  spinner.succeed();
};

const getAllFiles = async (dir: string): Promise<string[]> => {
  if (dir.endsWith('node_modules')) return [];
  const results = [];
  for await (const file of await fs.opendir(dir)) {
    const filePath = path.join(dir, file.name);
    if (file.isDirectory()) {
      results.push(...(await getAllFiles(filePath)));
    } else {
      results.push(filePath);
    }
  }
  return results;
};

const copyFilesToDestination = async (destination: string, preset: string) => {
  for await (const file of await getAllFiles(preset)) {
    const relativeDestination = path.join(destination, path.relative(preset, file));
    await fs.mkdir(path.dirname(relativeDestination), { recursive: true });
    await fs.copyFile(file, relativeDestination);
    // const contents = await fs.readFile(relativeDestination, 'utf8');
    // await fs.writeFile(relativeDestination, contents.replace('<app-name>', appName));
  }
};

const createBaseSSTProject = async (appName: string) => {
  const destination = path.join(process.cwd(), appName);
  const preset = path.resolve(SST_PRESET);

  await copyFilesToDestination(destination, preset);

  return destination;
};

const createFrameworkProject = async (baseDir: string, framework: string, template?: string) => {
  const destination = path.join(baseDir, BASE_FRONTEND);
  const preset = path.resolve(`${BASE_PRESET}/${framework}/${template}`);

  await copyFilesToDestination(destination, preset);
};
