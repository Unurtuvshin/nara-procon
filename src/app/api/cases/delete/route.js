import { NextResponse } from "next/server";
import sqlite3 from "sqlite3";
import { open } from "sqlite";
import path from "path";

async function openDb() {
  const dbPath = path.resolve(process.cwd(), "src/db/db.sqlite");
  return open({
    filename: dbPath,
    driver: sqlite3.Database,
  });
}

export async function POST(request) {
  try {
    const { ids } = await request.json();
    console.log("Received IDs for deletion:", ids);
    if (!Array.isArray(ids) || ids.length === 0) {
      return NextResponse.json({ error: "No IDs provided" }, { status: 400 });
    }

    const db = await openDb();

    // Use placeholders for safety
    const placeholders = ids.map(() => "?").join(",");

    const result = await db.run(
      `DELETE FROM cases WHERE id IN (${placeholders})`,
      ids
    );

    await db.close();

    return NextResponse.json({ deleted: result.changes });
  } catch (error) {
    console.error("Delete API error:", error);
    return NextResponse.json({ error: "Failed to delete" }, { status: 500 });
  }
}
