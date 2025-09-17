import db from "@/db/database";

export async function POST(req) {
  try {
    const { startDate, endDate } = await req.json();

    if (!startDate || !endDate) {
      return new Response(JSON.stringify({ error: "Dates required" }), {
        status: 400,
      });
    }

    // Get all cases within the date range
    const cases = db
      .prepare("SELECT * FROM cases WHERE date BETWEEN ? AND ?")
      .all(startDate, endDate);

    if (cases.length === 0) {
      return new Response(
        JSON.stringify({ error: "No cases found in the given date range" }),
        { status: 200 }
      );
    }

    // Get all fields
    const fields = db.prepare("SELECT * FROM fields ORDER BY id").all();

    // Get all words
    const words = db
      .prepare("SELECT * FROM words ORDER BY field_id, word_no")
      .all();

    // Count occurrences
    const result = fields.map((field) => {
      const fieldWords = words.filter((w) => w.field_id === field.id);

      // Count total occurrences for the field by checking the 'type' column
      let totalOccurrences = 0;
      fieldWords.forEach((word) => {
        cases.forEach((c) => {
          const regex = new RegExp(word.field_word, "g"); // global match
          const matches = c.type.match(regex);
          if (matches) totalOccurrences += matches.length;
        });
      });

      return {
        field_id: field.id,
        field_name: field.field,
        total_occurrences: totalOccurrences,
        words: fieldWords.map((w) => w.field_word),
      };
    });

    // Compute percentages
    const totalAllFields = result.reduce(
      (sum, f) => sum + f.total_occurrences,
      0
    );
    result.forEach((f) => {
      f.percentage =
        totalAllFields > 0
          ? ((f.total_occurrences / totalAllFields) * 100).toFixed(2)
          : "0.00";
    });

    return new Response(JSON.stringify(result), { status: 200 });
  } catch (err) {
    console.error(err);
    return new Response(JSON.stringify({ error: err.message }), {
      status: 500,
    });
  }
}
