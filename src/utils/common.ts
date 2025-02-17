import { readFileSync, writeFileSync } from 'fs';
import { resolve } from 'path';
import * as clear from 'clear-console';

export interface PackageJson {
  name: string;
  version: string;
  description: string;
  scripts: {
    [key: string]: string;
  };
}

export interface Json {
  [key: string]: any;
}
export function readJsonFile<T>(fileName: string): T {
  return JSON.parse(readFileSync(fileName, { encoding: 'utf-8', flag: 'r' }));
}

export function writeJsonFile<T>(fileName: string, content: T): void {
  writeFileSync(fileName, JSON.stringify(content, null, 2));
}

export function getProjectPath(projectName: string): string {
  return resolve(process.cwd(), projectName);
}

export function printMsg(msg: string): void {
  console.log(msg);
}

export function clearConsole(): void {
  clear();
}
