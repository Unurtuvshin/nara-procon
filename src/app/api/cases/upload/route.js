import { NextResponse } from "next/server";
import sqlite3 from "sqlite3";
import { open } from "sqlite";
import path from "path";

// DB connection helper
async function openDb() {
  const dbPath = path.resolve(process.cwd(), "src/db/db.sqlite");
  return open({
    filename: dbPath,
    driver: sqlite3.Database,
  });
}

// Convert Excel serial date (e.g., 45872) → YYYY-MM-DD
function excelDateToJSDate(serial) {
  const excelEpoch = new Date(1899, 11, 30); // Excel's epoch
  const jsDate = new Date(excelEpoch.getTime() + serial * 86400000);
  return jsDate.toISOString().split("T")[0]; // YYYY-MM-DD
}

// Convert Japanese-style dates like 2024年3月29日 → YYYY-MM-DD
function normalizeDate(dateStr) {
  if (!dateStr) return null;

  // If number, treat as Excel serial
  if (typeof dateStr === "number") {
    return excelDateToJSDate(dateStr);
  }

  // If already YYYY-MM-DD
  if (/^\d{4}-\d{2}-\d{2}$/.test(dateStr)) {
    return dateStr;
  }

  // Match 2024年3月29日
  const match = String(dateStr).match(/^(\d{4})年(\d{1,2})月(\d{1,2})日$/);
  if (match) {
    const [_, y, m, d] = match;
    return `${y}-${m.padStart(2, "0")}-${d.padStart(2, "0")}`;
  }

  console.warn("⚠️ Unrecognized date format:", dateStr);
  return null;
}

export async function POST(request) {
  try {
    const { cases } = await request.json();

    if (!cases || !Array.isArray(cases)) {
      return NextResponse.json(
        { error: "Invalid or missing data" },
        { status: 400 }
      );
    }

    const db = await openDb();
    let insertedCount = 0;

    for (const row of cases) {
      // Be flexible with header names (bracketed or plain)
      let name = row["［件名］"] || row["件名"] || row.name || "";
      let description =
        row["［相談概要］"] || row["相談概要"] || row.description || "";
      let date = row["［受付年月日］"] || row["受付年月日"] || row.date || "";
      let type =
        row["［販売購入形態］"] || row["販売購入形態"] || row.type || "";

      // Normalize date
      date = normalizeDate(date);

      if (!name || !description || !date || !type) {
        console.warn("⚠️ Skipping invalid row:", row);
        continue;
      }

      await db.run(
        "INSERT INTO cases (name, description, date, type) VALUES (?, ?, ?, ?)",
        [name, description, date, type]
      );
      insertedCount++;
    }

    await db.close();

    return NextResponse.json({
      message: "Upload success",
      inserted: insertedCount,
      received: cases.length,
    });
  } catch (error) {
    console.error("Upload API error:", error);
    return NextResponse.json(
      { error: "Failed to upload data" },
      { status: 500 }
    );
  }
}
