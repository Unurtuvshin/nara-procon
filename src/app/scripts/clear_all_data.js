// scripts/clear_all_data.js
import Database from "better-sqlite3";
import path from "path";

const dbPath = path.resolve(process.cwd(), "src/db/db.sqlite");
const db = new Database(dbPath);

try {
  // Turn off foreign key checks
  db.prepare("PRAGMA foreign_keys = OFF").run();

  // 1. Child tables first
  let info = db.prepare("DELETE FROM co_occurance").run();
  console.log(`✅ Deleted ${info.changes} rows from 'co_occurance'`);

  info = db.prepare("DELETE FROM posters").run();
  console.log(`✅ Deleted ${info.changes} rows from 'posters'`);

  // 2. Parent tables
  info = db.prepare("DELETE FROM results").run();
  console.log(`✅ Deleted ${info.changes} rows from 'results'`);

  info = db.prepare("DELETE FROM cases").run();
  console.log(`✅ Deleted ${info.changes} rows from 'cases'`);

  // 3. Drop tables (they will be recreated later by database.js if needed)
  db.prepare("DROP TABLE IF EXISTS result_table").run();
  console.log("🗑️ Dropped 'result_table'");

  db.prepare("DROP TABLE IF EXISTS fields").run();
  console.log("🗑️ Dropped 'fields'");

  db.prepare("DROP TABLE IF EXISTS words").run();
  console.log("🗑️ Dropped 'words'");

  // 4. Reset auto-increment counters
  db.prepare(
    "DELETE FROM sqlite_sequence WHERE name IN ('cases','results','posters','co_occurance','result_table','fields','words')"
  ).run();
  console.log("🔄 Reset auto-increment counters");

  console.log("✅ Database cleared successfully");
} catch (err) {
  console.error("❌ Failed to clear tables:", err);
} finally {
  db.prepare("PRAGMA foreign_keys = ON").run();
  db.close();
}
