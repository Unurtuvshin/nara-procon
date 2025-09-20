import db from "@/db/database";
import * as XLSX from "xlsx";
import fs from "fs";
import path from "path";
import dayjs from "dayjs";
import { spawn } from "child_process";

export async function POST(req) {
  try {
    const {
      startDate = "2023-01-01",
      endDate = "2023-12-31",
      page = 1,
      limit = 10,
    } = await req.json();
    const offset = (page - 1) * limit;

    // Query DB
    const rows = db
      .prepare(
        `SELECT * FROM cases 
         WHERE date BETWEEN ? AND ? 
         ORDER BY date 
         LIMIT ? OFFSET ?`
      )
      .all(startDate, endDate, limit, offset);

    const total = db
      .prepare(
        `SELECT COUNT(*) as count 
         FROM cases 
         WHERE date BETWEEN ? AND ?`
      )
      .get(startDate, endDate).count;

    const totalPages = Math.ceil(total / limit);

    // Excel export (date → A, name → G)
    const sheetData = [
      {}, // blank first row
      ...rows.map((item) => ({
        A: dayjs(item.date).format("YYYY/MM/DD"), // A column
        G: item.name, // G column
      })),
    ];

    const worksheet = XLSX.utils.json_to_sheet(sheetData, { skipHeader: true });
    const csv = XLSX.utils.sheet_to_csv(worksheet);

    // Save to disk
    const filePath = path.join(process.cwd(), "PIO-neerNet", "R5 1.csv");
    fs.writeFileSync(filePath, csv);

    // Run Python script
    const scriptPath = path.join(process.cwd(), "PIO-neerNet", "an_tp_test.py");

    const python = spawn("python", [scriptPath]);

    let stdout = "";
    let stderr = "";

    python.stdout.on("data", (data) => {
      stdout += data.toString();
    });

    python.stderr.on("data", (data) => {
      stderr += data.toString();
    });

    return new Promise((resolve) => {
      python.on("close", (code) => {
        console.log(`Python script exited with code ${code}`);
        resolve(
          Response.json({
            cases: rows,
            page,
            totalPages,
            stdout,
            stderr,
            exitCode: code,
          })
        );
      });
    });
  } catch (err) {
    console.error("Bunseki API error:", err);
    return Response.json({ error: err.message }, { status: 500 });
  }
}
