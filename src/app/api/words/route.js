import db from "@/db/database";

export async function GET(req) {
  const { searchParams } = new URL(req.url);
  const field_id = searchParams.get("field_id");
  if (!field_id) return new Response(JSON.stringify([]), { status: 200 });

  const stmt = db.prepare(
    "SELECT * FROM words WHERE field_id = ? ORDER BY word_no"
  );
  const words = stmt.all(field_id);
  return new Response(JSON.stringify(words), { status: 200 });
}

export async function POST(req) {
  const { field_id, word_no, field_word } = await req.json();
  if (!field_id || !word_no || !field_word)
    return new Response(JSON.stringify({ error: "All data required" }), {
      status: 400,
    });

  const stmt = db.prepare(
    "INSERT INTO words (field_id, word_no, field_word) VALUES (?, ?, ?)"
  );
  const info = stmt.run(field_id, word_no, field_word);

  const newWord = db
    .prepare("SELECT * FROM words WHERE id = ?")
    .get(info.lastInsertRowid);
  return new Response(JSON.stringify(newWord), { status: 200 });
}

export async function DELETE(req) {
  const { id, deleteAll } = await req.json();
  if (deleteAll) {
    db.prepare("DELETE FROM words").run();
    return new Response(JSON.stringify({ success: true }), { status: 200 });
  }
  if (!id)
    return new Response(JSON.stringify({ error: "ID required" }), {
      status: 400,
    });
  db.prepare("DELETE FROM words WHERE id = ?").run(id);
  return new Response(JSON.stringify({ success: true }), { status: 200 });
}
