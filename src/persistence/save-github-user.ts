import pg from "pg-promise";
import { GithubUser } from "../entities/github-user.ts";
import { User } from "../entities/user.ts";

export type SaveGithubUser = (githubUser: GithubUser) => Promise<User>;

export function dbSaveGithubUser(db: pg.IDatabase<{}>): SaveGithubUser {
  return async (githubUser) => {
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

async function saveRepos(t: pg.ITask<{}>, githubUser: GithubUser, user: User) {
  const placeholders: string[] = [];
  const cols = 3;
  const offset = new Array(cols).fill(0).map((_, i) => i + 1);
  for (let i = 0; i < githubUser.repos.length * cols; i += cols) {
    placeholders.push(`(${offset.map(o => '$' + (o + i)).join(', ')})`);
  }

  const repos = githubUser.repos.length > 0 ?
    await t.many(
      `INSERT INTO repos VALUES ${placeholders.join(', ')}`
      + `RETURNING language`,
      githubUser.repos.flatMap(r => [r.id, r.language, user.id])
    )
    : [];
  return repos;
}

async function saveUser(t: pg.ITask<{}>, githubUser: GithubUser)
  : Promise<User> {
  const user = await t.one(
    'INSERT INTO users VALUES ($1, $2, $3, $4, $5, $6) RETURNING *',
    [
      githubUser.id,
      githubUser.login.toLowerCase(),
      githubUser.name,
      githubUser.email,
      githubUser.location,
      githubUser.company
    ]
  );

  user.isPro = !!user.company;
  user.languages = '';

  return user;
}
