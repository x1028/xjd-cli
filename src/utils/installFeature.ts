import * as shell from 'shelljs';
import { writeFileSync } from 'fs';
import { PackageJson, printMsg, readJsonFile, writeJsonFile } from './common';
import { Chalk } from 'chalk';

const chalk = new Chalk({ level: 0 });

export function installESLint(): void {
  shell.exec(
    `npm i eslint @typescript-eslint/parser @typescript-eslint/eslint-plugin -D`,
  );

  const eslintrc = `module.exports = {
    "env": {
      "es2021": true,
      "node": true
    },
    "extends": [
      "eslint:recommended",
      "plugin:@typescript-eslint/recommended"
    ],
    "parser": "@typescript-eslint/parser",
    "parserOptions": {
      "ecmaVersion": 12,
      "sourceType": "module"
    },
    "plugins": [
      "@typescript-eslint"
    ],
    "rules": {
    }
  };`;

  try {
    writeFileSync('./.eslintrc.js', eslintrc);
  } catch (error) {
    printMsg(
      `${chalk.red('Error: Failed to write .eslintrc.js file content')} `,
    );
  }

  const packageJson = readJsonFile<PackageJson>('./package.json');
  packageJson.scripts['eslint:comment'] =
    '使用 ESlint 检查并自动修复 src 目录下所有扩展名为 .ts 的文件';
  packageJson.scripts['eslint'] = 'eslint --fix src --ext .ts --max-warnings=0';
  writeJsonFile('./package.json', packageJson);
}

export function installPrettier(projectName: string): void {
  shell.exec('npm i prettier -D');

  const prettierrc = `module.exports = {
        // 一行最多 80 字符
        printWidth: 80,
        // 使用 2 个空格缩进
        tabWidth: 2,
        // 不使用 tab 缩进，而使用空格
        useTabs: false,
        // 行尾需要有分号
        semi: true,
        // 使用单引号代替双引号
        singleQuote: true,
        // 对象的 key 仅在必要时用引号
        quoteProps: 'as-needed',
        // jsx 不使用单引号，而使用双引号
        jsxSingleQuote: false,
        // 末尾使用逗号
        trailingComma: 'all',
        // 大括号内的首尾需要空格 { foo: bar }
        bracketSpacing: true,
        // jsx 标签的反尖括号需要换行
        jsxBracketSameLine: false,
        // 箭头函数，只有一个参数的时候，也需要括号
        arrowParens: 'always',
        // 每个文件格式化的范围是文件的全部内容
        rangeStart: 0,
        // 不需要写文件开头的 @prettier
        requirePragma: false,
        // 不需要自动在文件开头插入 @prettier
        insertPragma: false,
        // 使用默认的折行标准
        proseWrap: 'preserve',
        // 根据显示样式决定 html 要不要折行
        htmlWhitespaceSensitivity: 'css',
        // 换行符使用 lf
        endOfLine: 'lf'
      };
        `;

  try {
    writeFileSync('./.prettierrc.js', prettierrc);
  } catch (e) {
    printMsg(
      `${chalk.red('Error: Failed to write .prettier.js file content')} `,
    );
  }

  const packageJson = readJsonFile<PackageJson>('./package.json');
  packageJson.scripts['prettier:comment'] =
    '自动格式化 src 目录下的所有 .ts 文件';
  packageJson.scripts['prettier'] = 'prettier --write src/**/*.ts';
  writeJsonFile<PackageJson>('./package.json', packageJson);
}

export function installBuild(feature: Array<string>): void {
  const packageJson = readJsonFile<PackageJson>('./package.json');
  packageJson.scripts['build:comment'] = '构建';
  const order = [];
  if (feature.includes('ESLint')) {
    order.push('npm run eslint');
  }
  if (feature.includes('Prettier')) {
    order.push('npm run prettier');
  }
  order.push('rm -rf lib && tsc --build');

  packageJson.scripts['build'] = order.join('&&');
  writeJsonFile<PackageJson>('./package.json', packageJson);
}
