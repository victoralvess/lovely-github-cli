import { printUsers } from '../utils/stdout.js';
import { FilterUsers } from '../persistence/list-users.js';
import type { Options } from '../utils/input.js';

export function listUsers(filterUsers: FilterUsers) {
  return async (options: Options): Promise<void> => {
    const users = await filterUsers(options.location, options.language);
    printUsers(users);
  };
}
