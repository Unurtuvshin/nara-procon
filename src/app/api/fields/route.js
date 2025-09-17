import db from "@/db/database";

export async function GET() {
  console.log("GET /api/fields called"); // debug
  const stmt = db.prepare("SELECT * FROM fields ORDER BY id");
  const fields = stmt.all();
  console.log("Fields fetched:", fields); // debug
  return new Response(JSON.stringify(fields), { status: 200 });
}

export async function POST(req) {
  const { field } = await req.json();
  console.log("POST /api/fields called with:", field); // debug
  if (!field) {
    console.log("Field is missing"); // debug
    return new Response(JSON.stringify({ error: "Field required" }), {
      status: 400,
    });
  }

  const stmt = db.prepare("INSERT INTO fields (field) VALUES (?)");
  const info = stmt.run(field);
  console.log("Inserted field ID:", info.lastInsertRowid); // debug

  const newField = db
    .prepare("SELECT * FROM fields WHERE id = ?")
    .get(info.lastInsertRowid);
  console.log("New field record:", newField); // debug

  return new Response(JSON.stringify(newField), { status: 200 });
}

export async function DELETE(req) {
  const { id, deleteAll } = await req.json();
  if (deleteAll) {
    db.prepare("DELETE FROM words").run(); // remove all words first
    db.prepare("DELETE FROM fields").run();
    return new Response(JSON.stringify({ success: true }), { status: 200 });
  }
  if (!id)
    return new Response(JSON.stringify({ error: "ID required" }), {
      status: 400,
    });
  db.prepare("DELETE FROM fields WHERE id = ?").run(id);
  return new Response(JSON.stringify({ success: true }), { status: 200 });
}
