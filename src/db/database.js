import Database from "better-sqlite3";
import path from "path";

const db = new Database(path.resolve(process.cwd(), "src/db/db.sqlite"));

// ---------------- CASES ----------------
db.prepare(
  `
  CREATE TABLE IF NOT EXISTS cases (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    description TEXT NOT NULL,
    date DATE NOT NULL,
    type TEXT NOT NULL
  )
`
).run();

// ---------------- RESULTS ----------------
db.prepare(
  `
  CREATE TABLE IF NOT EXISTS results (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    start_date DATE NOT NULL,
    end_date DATE NOT NULL
  )
`
).run();

// ---------------- POSTERS ----------------
db.prepare(
  `
  CREATE TABLE IF NOT EXISTS posters (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    text TEXT NOT NULL,
    poster_url TEXT NOT NULL,
    image_url TEXT NOT NULL,
    result_id INTEGER NOT NULL,
    text_size INTEGER NOT NULL,
    text_color TEXT NOT NULL,
    FOREIGN KEY(result_id) REFERENCES results(id)
  )
`
).run();

// ---------------- FIELDS ----------------
db.prepare(
  `
  CREATE TABLE IF NOT EXISTS fields (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    field TEXT NOT NULL
  )
`
).run();

// ---------------- WORDS ----------------
db.prepare(
  `
  CREATE TABLE IF NOT EXISTS words (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    field_id INTEGER NOT NULL,
    word_no INTEGER NOT NULL,
    field_word TEXT NOT NULL,
    FOREIGN KEY(field_id) REFERENCES fields(id),
    UNIQUE(field_id, word_no)
  )
`
).run();

// ---------------- RESULT_TABLE ----------------
db.prepare(
  `
  CREATE TABLE IF NOT EXISTS result_table (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    result_id INTEGER NOT NULL,
    field_id INTEGER NOT NULL,
    number INTEGER NOT NULL,
    percentage REAL NOT NULL,
    FOREIGN KEY(result_id) REFERENCES results(id),
    FOREIGN KEY(field_id) REFERENCES fields(id),
    UNIQUE(result_id, field_id)
  )
`
).run();

// ---------------- CO_OCCURANCE ----------------
db.prepare(
  `
  CREATE TABLE IF NOT EXISTS co_occurance (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    result_id INTEGER NOT NULL,
    word_1 TEXT NOT NULL,
    word_2 TEXT NOT NULL,
    number INTEGER NOT NULL,
    FOREIGN KEY(result_id) REFERENCES results(id)
  )
`
).run();

export default db;
