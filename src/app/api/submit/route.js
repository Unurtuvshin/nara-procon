import db from '@/db/database';

export async function POST(req) {
  try {
    const body = await req.json();
    const { name, desc, date, type } = body;

    const stmt = db.prepare(`
      INSERT INTO cases (name, content, date, type)
      VALUES (?, ?, ?, ?)
    `);

    stmt.run(name, desc, date, type);

    return new Response(JSON.stringify({ success: true }), {
      status: 200,
    });
  } catch (err) {
    console.error('DB error:', err);
    return new Response(JSON.stringify({ success: false, error: err.message }), {
      status: 500,
    });
  }
}
