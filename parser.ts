import { ProjectSymbols } from 'ngast';
import { existsSync } from 'fs';
import { bgRed } from 'chalk';
import * as minimist from 'minimist'

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

// const project = new ProjectSymbols(() => {

// });
