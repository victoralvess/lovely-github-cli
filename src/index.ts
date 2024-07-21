#!/usr/bin/env node
import chalk from 'chalk';
import { Command, program } from 'commander';
import { closeConnection, db } from './utils/db.js';
import {
  Options,
  collectLanguages,
  parseUsername,
  validateOptions
} from './utils/input.js';
import { fetchAndSaveUser } from './actions/fetch-user.js';
import { listUsers } from './actions/list-users.js';
import { octokitGetUser } from './services/get-github-user.js';
import { Octokit } from '@octokit/rest';
import { dbSaveGithubUser } from './persistence/save-github-user.js';
import { dbFilterUsers } from './persistence/list-users.js';
import { printUsers } from './utils/stdout.js';

async function main(): Promise<void> {
  const noop = () => { }; // to hide logs

  await program
    .name('lovely-github-cli')
    .option('-u, --user <username>', 'fetch a GitHub user', parseUsername)
    .option('-a, --list-all', 'display all users on the database')
    .option('-l, --location <location>', 'apply location filter')
    .option(
      '-L, --language <language>', 'apply language filter', collectLanguages)
    .option('-k, --key <key>', 'GitHub API key')
    .action(async function (options: Options, command: Command) {
      validateOptions(options, command);

      if (options.user) {
        const users = await fetchAndSaveUser(
          octokitGetUser(new Octokit({
            auth: options.key,
            log: { info: noop, warn: noop, debug: noop, error: noop }
          })),
          dbSaveGithubUser(db)
        )(options.user);

        if (users.length) {
          printUsers(users);
        }
      } else {
        const users = await listUsers(dbFilterUsers(db))(options);
        printUsers(users);
      }

    })
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

main().finally(closeConnection);