import { printUsers } from '../utils/stdout.js';
import { FilterUsers } from '../persistence/list-users.js';
import type { Options } from '../utils/input.js';
import chalk from 'chalk';

export function listUsers(filterUsers: FilterUsers) {
  return async (options: Options): Promise<void> => {
    try {
      const users = await filterUsers(options.location, options.language);
      printUsers(users);
    } catch (e) {
      console.error(
        chalk.red(`error: query failed unexpectedly (${e.message})`)
      );
    }
  };
}
