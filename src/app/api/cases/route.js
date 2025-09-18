import db from "@/db/database";

export async function GET(req) {
  const { searchParams } = new URL(req.url);
  const page = parseInt(searchParams.get("page") || "1", 10);
  const limit = parseInt(searchParams.get("limit") || "30", 10);
  const offset = (page - 1) * limit;

  const rows = db
    .prepare("SELECT * FROM cases ORDER BY id LIMIT ? OFFSET ?")
    .all(limit, offset);
  const total = db.prepare("SELECT COUNT(*) as count FROM cases").get().count;
  const totalPages = Math.ceil(total / limit);

  return Response.json({
    cases: rows,
    page,
    totalPages,
  });
}
