import {
  getProjectPath,
  PackageJson,
  Json,
  printMsg,
  readJsonFile,
  writeJsonFile,
  clearConsole,
} from '../utils/common';
import { existsSync } from 'fs';
import inquirer from 'inquirer';
import { Chalk } from 'chalk';
import * as shell from 'shelljs';
import * as installFeatureMethod from './installFeature';

const chalk = new Chalk({ level: 0 });

export function isFileExist(filename: string): void {
  const file = getProjectPath(filename);
  if (existsSync(file)) {
    printMsg(chalk.red(`${file} already exists`));
    process.exit(1);
  }
}

export async function selectFeature() {
  clearConsole();

  printMsg(chalk.blue(`TS CLI v${require('../../package.json').version}`));
  printMsg('Start initializing the project:');
  printMsg('');

  const { feature } = await inquirer.prompt([
    {
      name: 'feature',
      type: 'checkbox',
      message: 'Check the features needed for the project',
      choices: [
        {
          name: 'ESLint',
          value: 'ESLint',
        },
        {
          name: 'Prettier',
          value: 'Prettier',
        },
      ],
    },
  ]);

  return feature;
}

export function initProjectDir(projectName: string): void {
  shell.mkdir(projectName);
  shell.cd(projectName);
  shell.exec(`npm init -y`);
}

export function changePackageInfo(projectName: string): void {
  const packageJson: PackageJson = readJsonFile('./package.json');
  packageJson.name = projectName;
  writeJsonFile<PackageJson>('./package.json', packageJson);
}

export function installTSAndInit() {
  shell.exec(`npm i typescript -D && npx tsc --init`);

  const tsconfigJson = {
    compileOnSave: true,
    compilerOptions: {
      target: 'ES2018',
      module: 'commonjs',
      moduleResolution: 'node',
      experimentalDecorators: true,
      emitDecoratorMetadata: true,
      inlineSourceMap: true,
      noImplicitThis: true,
      noUnusedLocals: true,
      stripInternal: true,
      pretty: true,
      declaration: true,
      outDir: 'lib',
      baseUrl: './',
      paths: {
        '*': ['src/*'],
      },
    },
    exclude: ['lib', 'node_modules'],
  };

  writeJsonFile<Json>('./tsconfig.json', tsconfigJson);
  shell.exec('mkdir src && touch src/index.ts');
}

export function installTypeNode() {
  shell.exec(`npm i @types/node -D`);
}

export function installDevEnviroment() {
  shell.exec(`npm i ts-node-dev -D`);

  const packageJson: PackageJson = readJsonFile('./package.json');
  packageJson.scripts['dev:comment'] = '开发';
  packageJson.scripts['dev'] =
    'ts-node-dev --respawn --transpile-only src/index.ts';
  writeJsonFile<PackageJson>('./package.json', packageJson);
}

export function installFeature(feature: string[]): void {
  feature.forEach((item) => {
    const func = installFeatureMethod[`install${item}`];

    func();
  });

  installFeatureMethod.installBuild(feature);
}

export function end(projectName: string) {
  printMsg(`Successfully created project ${projectName}`);
  printMsg(`Get started with the following commands:`);
  printMsg('');
  printMsg(`${chalk.grey('$')} ${chalk.cyan(`cd ${projectName}`)}`);
  printMsg(`${chalk.grey('$')} ${chalk.cyan('npm run dev')}`);
  printMsg('');
}
