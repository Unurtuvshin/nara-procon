// scripts/migrate_cases.js
import Database from "better-sqlite3";
import path from "path";
import fs from "fs";

const dbPath = path.resolve(process.cwd(), "src/db/db.sqlite");

if (!fs.existsSync(dbPath)) {
  console.error("❌ Database file not found:", dbPath);
  process.exit(1);
}

const db = new Database(dbPath);

try {
  // Check if cases table exists
  const tableCheck = db
    .prepare(
      "SELECT name FROM sqlite_master WHERE type='table' AND name='cases';"
    )
    .get();

  if (!tableCheck) {
    console.log("⚠️ No cases table found. Nothing to migrate.");
    process.exit(0);
  }

  // Check if "description" column already exists
  const pragma = db.prepare("PRAGMA table_info(cases);").all();
  const hasDescription = pragma.some((col) => col.name === "description");

  if (hasDescription) {
    console.log(
      "✅ cases table already has 'description'. No migration needed."
    );
    process.exit(0);
  }

  console.log("🔄 Migrating cases table...");

  db.exec("BEGIN TRANSACTION;");

  // Rename old table
  db.exec("ALTER TABLE cases RENAME TO cases_old;");

  // Create new table with correct schema
  db.exec(`
    CREATE TABLE cases (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      description TEXT NOT NULL,
      date DATE NOT NULL,
      type TEXT NOT NULL
    );
  `);

  // Copy data (map content → description if exists)
  db.exec(`
    INSERT INTO cases (id, name, description, date, type)
    SELECT id, name, content, date, type FROM cases_old;
  `);

  // Drop old table
  db.exec("DROP TABLE cases_old;");

  db.exec("COMMIT;");

  console.log("✅ Migration complete: 'cases' table now uses 'description'.");
} catch (err) {
  db.exec("ROLLBACK;");
  console.error("❌ Migration failed:", err);
} finally {
  db.close();
}
