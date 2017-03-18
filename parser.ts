import { ProjectSymbols } from 'ngast';
import { existsSync, readFileSync, readFile } from 'fs';
import { bgRed } from 'chalk';
import * as minimist from 'minimist'
import { createProgramFromTsConfig } from './create-program';

const projectPath = (minimist(process.argv.slice(2)) as any).p;

const error = message => {
  console.error(bgRed.white(message));
};

if (typeof projectPath !== 'string') {
  error('Specify the path to the root "tsconfig" file of your project with the "-p" flag');
  process.exit(1);
}

if (!existsSync(projectPath)) {
  error('Cannot find tsconfig at "' + projectPath + '".');
  process.exit(1);
}

const project = new ProjectSymbols({ create: () => createProgramFromTsConfig(projectPath)  }, {
  getSync: (path: string) => readFileSync(path).toString(),
  get: (path: string) =>
    new Promise((resolve, reject) =>
      readFile(path, (error, content) => error ? reject(error) : resolve(content.toString())))
});

const context = project.getRootContext();
const modules = context.getModules();

console.log(modules);
