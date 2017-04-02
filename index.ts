import * as minimist from 'minimist'
import { bgRed } from 'chalk';
import { writeFileSync, existsSync } from 'fs';

import { parse } from './parser';
import { emit } from './emitter';

const error = message => {
  console.error(bgRed.white(message));
};


const projectPath = (minimist(process.argv.slice(2)) as any).p;

// console.error(bgRed.white('Error while parsing the project structure', e));

if (typeof projectPath !== 'string') {
  error('Specify the path to the root "tsconfig" file of your project with the "-p" flag');
  process.exit(1);
}

if (!existsSync(projectPath)) {
  error('Cannot find tsconfig at "' + projectPath + '".');
  process.exit(1);
}

writeFileSync(__dirname + '/index.html', emit(parse(projectPath)));

