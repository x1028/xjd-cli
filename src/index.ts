import { program } from 'commander';
import create from './order/create';

program
  .version(`${require('../package.json').version}`, '-v --version')
  .usage('<command> [options]');

program
  .command('create <app-name>')
  .description('Create mew project from => ts-cli create yourProjectName')
  .action(async (name: string) => {
    await create(name);
  });

program.parse(process.argv);
