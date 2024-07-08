import chalk from "chalk";
import { Command } from "commander";

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