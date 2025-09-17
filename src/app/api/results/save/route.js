import db from "@/db/database";

export async function POST(req) {
  try {
    const { name, start_date, end_date, analysis } = await req.json();

    if (!name || !start_date || !end_date || !analysis) {
      return new Response(
        JSON.stringify({ error: "必要なデータが不足しています" }),
        { status: 400 }
      );
    }

    // Insert into results
    const info = db
      .prepare(
        "INSERT INTO results (name, start_date, end_date) VALUES (?, ?, ?)"
      )
      .run(name, start_date, end_date);

    const resultId = info.lastInsertRowid;

    // Insert each field's analysis into result_table
    const stmt = db.prepare(`
      INSERT INTO result_table (result_id, field_id, number, percentage)
      VALUES (?, ?, ?, ?)
    `);

    for (const field of analysis) {
      stmt.run(
        resultId,
        field.field_id,
        field.total_occurrences,
        parseFloat(field.percentage)
      );
    }

    return new Response(JSON.stringify({ success: true, resultId }), {
      status: 200,
    });
  } catch (err) {
    console.error(err);
    return new Response(JSON.stringify({ error: err.message }), {
      status: 500,
    });
  }
}
