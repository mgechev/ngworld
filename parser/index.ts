import { ProjectSymbols } from 'ngast';
import { readFileSync, readFile } from 'fs';

import { createProgramFromTsConfig } from './create-program';
import { formatContext } from './formatters';

export const parse = (projectPath: string) => {
  const project = new ProjectSymbols(createProgramFromTsConfig(projectPath), {
    getSync: (path: string) => readFileSync(path).toString(),
    get: (path: string) =>
      new Promise((resolve, reject) =>
        readFile(path, (error, content) => error ? reject(error) : resolve(content.toString())))
  }, (error: string, path: string) => console.error(error, path));

  return formatContext(project);
};

