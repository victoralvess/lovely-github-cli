import { Octokit } from '@octokit/rest';
import { GithubUser } from '../entities/github-user.js';

export type GetGithubUser = (username: string) => Promise<GithubUser>;

export function octokitGetUser(octokit: Octokit): GetGithubUser {
  return async (username) => {
    const [userResponse, reposResponse] = await Promise.all([
      octokit.users.getByUsername({ username }),
      octokit.repos.listForUser({ username })
    ]);

    return {
      ...userResponse.data,
      name: userResponse.data.name ?? userResponse.data.login,
      repos: reposResponse.data.map(r => {
        return {
          id: r.id,
          language: r.language ?? null,
          userId: userResponse.data.id
        };
      })
    };
  };
}