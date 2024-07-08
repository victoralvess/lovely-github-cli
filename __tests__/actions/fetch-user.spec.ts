import { GetGithubUser } from '../../src/services/get-github-user.js';
import { SaveGithubUser } from '../../src/persistence/save-github-user.js';
import { fetchUser as fetchUserFactory } from '../../src/actions/fetch-user.js';

describe('fetchUser', () => {
  let fakeGetGithubUser: GetGithubUser;
  let fakeSaveGithubUser: SaveGithubUser;

  beforeEach(() => {
    fakeGetGithubUser = async (username) => {
      return {
        id: 123,
        login: username,
        name: 'My name',
        email: 'myemail@mail.com',
        location: 'Somewhere, Earth',
        company: null,
        repos: [
          {
            id: 456,
            language: 'C',
            userId: 123
          }
        ],
      };
    };

    fakeSaveGithubUser = async (githubUser) => {
      return {
        id: githubUser.id,
        login: githubUser.login.toLowerCase(),
        name: githubUser.name,
        email: githubUser.email,
        location: githubUser.location,
        isPro: !!githubUser.company,
        languages: githubUser.repos.map(r => r.language).join(', '),
      };
    };
  });

  it(
    'should fetch a user from GitHub and save them to the database',
    async () => {
      const fetchUser = fetchUserFactory(fakeGetGithubUser, fakeSaveGithubUser);
      const username = 'myUsername';

      await expect(fetchUser(username)).resolves.toEqual([
        {
          id: 123,
          login: 'myusername',
          name: 'My name',
          email: 'myemail@mail.com',
          location: 'Somewhere, Earth',
          isPro: false,
          languages: 'C',
        }
      ]);
    }
  );

  it('should return an empty list if the api call fails', async () => {
    const fetchUser = fetchUserFactory(
      () => Promise.reject(new Error('Fake API Error')),
      fakeSaveGithubUser
    );
    const username = 'testUsername';

    await expect(fetchUser(username)).resolves.toEqual([]);
  });

  it(
    'should return an empty list if the user data cannot be saved',
    async () => {
      const fetchUser = fetchUserFactory(
        fakeGetGithubUser,
        () => Promise.reject(new Error('Fake DB Error'))
      );
      const username = 'testUsername';

      await expect(fetchUser(username)).resolves.toEqual([]);
    }
  );
});