import db from "@/db/database";

export async function GET(req) {
  const { searchParams } = new URL(req.url);
  const id = searchParams.get("id");
  if (!id) {
    return new Response(JSON.stringify({ error: "ID required" }), {
      status: 400,
    });
  }

  try {
    // Get main result
    const result = db.prepare("SELECT * FROM results WHERE id = ?").get(id);
    if (!result) {
      return new Response(JSON.stringify({ error: "Result not found" }), {
        status: 404,
      });
    }

    // Get associated analysis data from result_table
    const analysisRows = db
      .prepare("SELECT * FROM result_table WHERE result_id = ?")
      .all(id);

    const analysis = analysisRows.map((r) => {
      let words = [];
      try {
        words = r.words ? JSON.parse(r.words) : [];
      } catch {
        words = [];
      }
      // Make sure words always has 3 items
      while (words.length < 3) words.push("");
      if (words.length > 3) words = words.slice(0, 3);

      return {
        field_id: r.field_id,
        field_name: r.field_name,
        total_occurrences: r.total_occurrences,
        percentage: r.percentage,
        words,
      };
    });

    return new Response(JSON.stringify({ ...result, result: analysis }), {
      status: 200,
    });
  } catch (err) {
    console.error(err);
    return new Response(JSON.stringify({ error: "Server error" }), {
      status: 500,
    });
  }
}
