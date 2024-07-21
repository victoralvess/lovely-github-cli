import pg from 'pg-promise';

export const pgp = pg();
export const db = pgp(process.env.DATABASE_URL!);

export function closeConnection(): void {
  pgp.end();
}

process.on('SIGINT', closeConnection);
process.on('SIGTERM', closeConnection);