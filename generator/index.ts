import { Module } from '../parser/formatters';
import { bgRed } from 'chalk';
import { generate } from './generate';

let res = '';

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
  generate(data)
});
