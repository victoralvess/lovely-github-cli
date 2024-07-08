import pg from 'pg-promise';

export const pgp = pg();
export const db = pgp(process.env.DATABASE_URL!);