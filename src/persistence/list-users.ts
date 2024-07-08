import pg from 'pg-promise';
import { User } from '../entities/user.js';

// export type ListUsers = () => Promise<User[]>;
// export type FilterByLocation = (location: string) => Promise<User[]>;
// export type FilterByLanguages = (languages: string[]) => Promise<User[]>;
export type FilterUsers = (
  location?: string, languages?: string[]) => Promise<User[]>;

// export function dbListUsers(db: pg.IDatabase<{}>): ListUsers {
//   return async () => {
//     return await db.any(makeListUsersQuery());
//   };
// }

// export function dbFilterUsersByLocation(db: pg.IDatabase<{}>)
//   : FilterByLocation {
//   return async (location: string) => {
//     return await db.any(makeListUsersQuery('location = $1'), [location]);
//   };
// }

// export function dbFilterUsersByLanguages(db: pg.IDatabase<{}>)
//   : FilterByLanguages {
//   return async (languages: string[]) => {
//     const { whereClause, filters } = makeLanguagesFilter(languages);
//     return await db.any(makeListUsersQuery(whereClause), filters);
//   };
// }

export function dbFilterUsers(db: pg.IDatabase<{}>)
  : FilterUsers {
  return async (location?: string, languages?: string[]) => {
    const whereClauses: string[] = [];
    let filters: (string | string[])[] = [];

    let paramIndex = 1;

    if (location !== undefined) {
      paramIndex += 1;

      whereClauses.push('location = $1');
      filters.push(location);
    }

    if (languages !== undefined) {
      const languagesFilter = makeLanguagesFilter(languages, paramIndex);
      whereClauses.push(languagesFilter.whereClause);
      filters = filters.concat(languagesFilter.filters);
    }

    return await db.any(
      makeListUsersQuery(whereClauses.join(' AND ')), filters);
  };
}

function makeListUsersQuery(whereClause = '') {
  return 'SELECT u.*, company IS NOT NULL AS "isPro",'
    + " string_agg(DISTINCT r.language, ', ') as languages" +
    ' FROM users u JOIN repos r ON u.id = r."userId"'
    + ` ${whereClause ? 'WHERE ' + whereClause : ''} GROUP BY u.id`;
}

function makeLanguagesFilter(languages: string[], paramIndex: number = 1)
  : { whereClause: string; filters: (string | string[])[]; } {
  const whereClause = 'u.id IN (SELECT "userId" FROM repos'
    + ` WHERE language = ANY($${paramIndex++})`
    + ` GROUP BY "userId" HAVING ${languages
      .map(() => 'ARRAY_AGG(language) @> $' + paramIndex++).join(' OR ')})`;

  const filters = languages.map(l => l.split(','));

  return {
    whereClause,
    filters: [filters.flat(), ...filters]
  };
}
