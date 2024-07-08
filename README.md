# Lovely GitHub CLI

Wrapper CLI for the GitHub Rest API.

# Requirements

- Node.js >= 18 (written in 20.12.1)
- Postgres >= 11.5 (I used 11.5, but should work with most versions)

# How to run

1. Install dependencies (`npm install`)
2. Build the application (`npm run build`)
3. Make the application available as a command (`npm link`) [OPTIONAL]
4. Run migrations (`npm run prisma:migrate`)
4. Run `lovely-github-cli` or `node ./dist/index.js`

## Environment variables

- `DATABASE_URL` [REQUIRED]
- `GITHUB_TOKEN` [OPTIONAL] - A GitHub token that can make request to the API

__Note:__ You can use the `-k` flag to set a GitHub token

# Features

1. Fetch information about a given GitHub user (`-u <username>`)
2. List all users already on the database (`-a`)
3. List all users from a given location (`-l <location>`)
4. List all users that have used a programming language (`-L <language>`)
5. A combination of 3. and 4.
