// scripts/clear_cases.js
import Database from "better-sqlite3";
import path from "path";

const dbPath = path.resolve(process.cwd(), "src/db/db.sqlite");
const db = new Database(dbPath);

try {
  const info = db.prepare("DELETE FROM cases").run();
  console.log(`✅ Deleted ${info.changes} rows from the 'cases' table.`);
} catch (err) {
  console.error("❌ Failed to delete cases:", err);
} finally {
  db.close();
}
