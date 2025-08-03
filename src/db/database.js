import Database from 'better-sqlite3';
import path from 'path';

const db = new Database(path.resolve(process.cwd(), 'src/db/db.sqlite'));

// Create cases table
db.prepare(`
  CREATE TABLE IF NOT EXISTS cases (
    id INTEGER PRIMARY KEY,
    name TEXT NOT NULL,
    content TEXT NOT NULL,
    date DATE NOT NULL,
    type TEXT NOT NULL
  )
`).run();

// Create results table
db.prepare(`
  CREATE TABLE IF NOT EXISTS results (
    id INTEGER PRIMARY KEY,
    name TEXT NOT NULL,
    result TEXT NOT NULL,
    start_date DATE NOT NULL,
    end_date DATE NOT NULL
  )
`).run();

// Create posters table
db.prepare(`
  CREATE TABLE IF NOT EXISTS posters (
    id INTEGER PRIMARY KEY,
    name TEXT NOT NULL,
    text TEXT NOT NULL,
    poster_url TEXT NOT NULL,
    image_url TEXT NOT NULL,
    result_id INTEGER REFERENCES results(id),
    text_size INTEGER NOT NULL,
    text_color TEXT NOT NULL
  )
`).run();

export default db;
