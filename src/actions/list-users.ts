import { FilterUsers } from '../persistence/list-users.js';
import type { Options } from '../utils/input.js';
import chalk from 'chalk';
import { User } from '../entities/user.js';

export function listUsers(filterUsers: FilterUsers) {
  return async (options: Options): Promise<User[]> => {
    try {
      return await filterUsers(options.location, options.language);
    } catch (e) {
      console.error(
        chalk.red(`error: query failed unexpectedly (${e.message})`)
      );

      return [];
    }
  };
}
