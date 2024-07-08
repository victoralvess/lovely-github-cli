import chalk from 'chalk';
import { SaveGithubUser } from '../persistence/save-github-user.js';
import { GetGithubUser } from '../services/get-github-user.js';
import { GithubUser } from '../entities/github-user.js';
import { User } from '../entities/user.js';
import { printUsers } from '../utils/stdout.js';

export function fetchUser(
  getGithubUser: GetGithubUser, saveGithubUser: SaveGithubUser) {
  return async (username: string): Promise<void> => {
    const githubUser = await getGithubUser(username);
    const user = await trySaveUser(saveGithubUser, githubUser);
    if (user) printUsers([user]);
  };
}

async function trySaveUser(
  saveGithubUser: SaveGithubUser, githubUser: GithubUser
): Promise<User | null> {
  try {
    return await saveGithubUser(githubUser);
  } catch (e) {
    console.warn(
      chalk.yellow(`warn: user could not be saved (${e.message})`)
    );

    return null;
  }
}
