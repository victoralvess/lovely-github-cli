export type User = {
  id: number;
  login: string;
  name: string;
  email: string | null;
  location: string | null;
  isPro: boolean;
  languages: string;
};
