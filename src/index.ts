#!/usr/bin/env node
import chalk from 'chalk';
import { program } from 'commander';
import { pgp } from './utils/db.js';

async function main(): Promise<void> {
  await program
    .name('lovely-github-cli')
    .option('-u, --user <username>', 'fetch a GitHub user')
    .option('-a, --list-all', 'display all users on the database')
    .option('-l, --location <location>', 'apply location filter')
    .option('-L, --language <language>', 'apply language filter')
    .addHelpText(
      'afterAll',
      [`\nWhen using ${chalk.bold('-L')} or ${chalk.bold('--language')},`,
        'you can provide multiple languages by repeating\nthe flag.',
        'If multiple languages are provided, the boolean OR operator is used.',
        '\nUse comma separated values to use the boolean AND operator.']
        .join(' ')
    )
    .showHelpAfterError()
    .showSuggestionAfterError()
    .parseAsync();
}

main().finally(() => {
  pgp.end();
});