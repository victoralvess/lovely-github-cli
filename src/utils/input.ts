import chalk from "chalk";
import { Command, InvalidArgumentError } from "commander";

export type Options = {
  user?: string
  listAll?: boolean;
  language?: string[];
  location?: string;
  key?: string;
};

export function validateOptions(options: Options, command: Command): void {
  const optionsLength = Object.keys(options).filter(k => k !== 'key').length;

  if (optionsLength === 0) {
    command.error('error: please inform at least one filter');
  }

  if ('user' in options && optionsLength > 1) {
    command.error(
      `error: you can't use ${chalk.bold('-u')}`
      + ` or ${chalk.bold('--user')} with other filters`
    );
  }

  if (options.listAll && optionsLength > 1) {
    command.error(
      `error: you can't use ${chalk.bold('-a')}`
      + ` or ${chalk.bold('--list-all')} with other filters`
    );
  }
}

export function parseUsername(username: string) {
  username = username.trim();

  if (username.length === 0) {
    throw new InvalidArgumentError("username can't be empty");
  }

  if (!/^[\w-]+$/i.test(username)
    || /--/.test(username)
    || /^-/.test(username)
    || /-$/.test(username)) {
    throw new InvalidArgumentError('username may only contain alphanumeric ' +
      'characters or single hyphens, and cannot begin or end with a hyphen.');
  }

  return username.toLowerCase();
}

export function collectLanguages(lang: string, previous?: string[]) {
  return (previous ?? []).concat([lang]);
}