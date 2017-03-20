import { bgRed } from 'chalk';
import * as minimist from 'minimist'

import { Module } from '../parser/formatters';
import { createWorldLayout } from './layout';
import { renderWorld } from './renderer';

let res = '';

const outputPath = (minimist(process.argv.slice(2)) as any).o;

process.stdin.on('data', chunk => {
  res = chunk.toString();
});

process.stdin.on('end', _ => {
  let data: Module[] = null;
  try {
    data = JSON.parse(res);
  } catch (e) {
    console.error(bgRed.white('Error while parsing the project structure', e));
  }
  renderWorld(createWorldLayout(data), outputPath);
});
