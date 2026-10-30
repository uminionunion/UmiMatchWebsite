
import { Kysely, SqliteDialect } from 'kysely';
import SQLite from 'sqlite3';
import path from 'path';
import fs from 'fs';

const DATA_DIRECTORY = process.env.DATA_DIRECTORY || path.join(process.cwd(), 'data');
const dbPath = path.join(DATA_DIRECTORY, 'database.sqlite');

if (!fs.existsSync(DATA_DIRECTORY)) {
  fs.mkdirSync(DATA_DIRECTORY, { recursive: true });
}

export const db = new Kysely({
  dialect: new SqliteDialect({
    database: new SQLite(dbPath),
  }),
});
