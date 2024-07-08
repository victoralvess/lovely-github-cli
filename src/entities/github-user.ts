import { GithubRepo } from './github-repo.ts';

export type GithubUser = {
  id: number;
  login: string;
  name: string;
  email: string | null;
  location: string | null;
  company: string | null;
  repos: GithubRepo[];
};