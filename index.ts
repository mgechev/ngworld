import * as minimist from 'minimist';
import { bgRed } from 'chalk';
import { writeFileSync, existsSync } from 'fs';
import { join } from 'path';

import { parse } from './parser';
import { emit } from './emitter';
import { ncp } from 'ncp';

const error = message => {
  console.error(bgRed.white(message));
};

const projectPath = (minimist(process.argv.slice(2)) as any).p;
const outputPath = (minimist(process.argv.slice(2)) as any).o;

if (typeof projectPath !== 'string') {
  error('Specify the path to the root "tsconfig" file of your project with the "-p" flag');
  process.exit(1);
}

if (typeof outputPath !== 'string') {
  error('Specify the output path "-o" flag');
  process.exit(1);
}

if (!existsSync(projectPath)) {
  error('Cannot find tsconfig at "' + projectPath + '".');
  process.exit(1);
}

const cp = (src: string, dest: string, cb: Function) => {
  ncp(src, dest, error => {
    if (error) {
      console.error("Sorry but I wasn't able to create the world because of this error: ", error);
      process.exit(1);
    } else {
      cb();
    }
  });
};

const world = emit(parse(projectPath));

cp(join(__dirname, 'src'), join(outputPath, 'src'), () => {
  cp(join(__dirname, 'images'), join(outputPath, 'images'), () => {
    cp(join(__dirname, 'favicon.png'), join(outputPath, 'favicon.png'), () => {
      console.log('🌍', 'Enjoy your ngworld');
      writeFileSync(join(outputPath, 'index.html'), world);
    });
  });
});
