import db from "@/db/database";

export async function POST(req) {
  try {
    const { id, name, description, date, type } = await req.json();

    const result = db
      .prepare(
        `UPDATE cases SET name = ?, description = ?, date = ?, type = ? WHERE id = ?`
      )
      .run(name, description, date, type, id);

    return Response.json({ success: true });
  } catch (err) {
    console.error("Update error:", err);
    return Response.json({ success: false, error: err.message });
  }
}
