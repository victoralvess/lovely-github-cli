import pg from 'pg-promise';
import { GithubUser } from '../entities/github-user.js';
import { User } from '../entities/user.js';
import { pgp } from '../utils/db.js';

export type SaveGithubUser = (githubUser: GithubUser) => Promise<User>;

export function dbSaveGithubUser(db: pg.IDatabase<{}>): SaveGithubUser {
  return async (githubUser: GithubUser): Promise<User> => {
    return await db.tx(async (t) => {
      const user = await saveUser(t, githubUser);
      const repos = await saveRepos(t, githubUser, user);

      user.languages = Array.from(
        new Set(repos.map(r => r.language).filter(Boolean))
      ).join(', ');

      return user;
    });
  };
}

async function saveRepos(t: pg.ITask<{}>, githubUser: GithubUser, user: User)
  : Promise<{ language: string }[]> {
  if (githubUser.repos.length <= 0) {
    return [];
  }

  const { ColumnSet, insert } = pgp.helpers;
  const cs = new ColumnSet(['id', 'language', 'userId'], { table: 'repos' });

  const repos = await t.many(
    insert(githubUser.repos.map(r => ({ ...r, userId: user.id })), cs)
    + `ON CONFLICT (id) DO UPDATE SET language = excluded.language
    RETURNING language`,
  );

  return repos;
}

async function saveUser(t: pg.ITask<{}>, githubUser: GithubUser)
  : Promise<User> {
  const user = await t.one(
    `INSERT INTO users
      VALUES ($(id), $(login), $(name), $(email), $(location), $(company))
      ON CONFLICT (id) DO UPDATE SET
        login = excluded.login,
        name = excluded.name,
        email = excluded.email,
        location = excluded.location,
        company = excluded.company
      RETURNING *`,
    {
      ...githubUser,
      login: githubUser.login.toLowerCase()
    }
  );

  user.isPro = !!user.company;
  user.languages = '';

  return user;
}
