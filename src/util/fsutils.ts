import fs from 'fs/promises';
import path from 'path';

// Returns true if filePath is an existing file or directory.
// Returns false if it does not exist.
// Throws if there are other errors, like permission issues.
export async function exists(filePath: string): Promise<boolean> {
  try {
    await fs.access(filePath);
    return true; // File or directory exists
  } catch (e) {
    //
    if ((e as { code: string }).code === 'ENOENT') {
      return false; // File or directory does not exist
    } else {
      throw e; // Other errors, such as permission issues
    }
  }
}

export const copyFilesToDestination = async (destination: string, source: string) => {
  for await (const file of await getAllFiles(source)) {
    const absoluteDestination = path.join(destination, path.relative(source, file));
    await fs.mkdir(path.dirname(absoluteDestination), { recursive: true });
    await fs.copyFile(file, absoluteDestination);
    // const contents = await fs.readFile(relativeDestination, 'utf8');
    // await fs.writeFile(relativeDestination, contents.replace('<app-name>', appName));
  }
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
