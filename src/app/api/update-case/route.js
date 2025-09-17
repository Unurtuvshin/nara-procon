import db from '@/db/database';

export async function POST(req) {
    try {
        const { id, name, desc, date, type } = await req.json();

        const result = db
            .prepare(`UPDATE cases SET name = ?, content = ?, date = ?, type = ? WHERE id = ?`)
            .run(name, desc, date, type, id);

        return Response.json({ success: true });
    } catch (err) {
        console.error('Update error:', err);
        return Response.json({ success: false, error: err.message });
    }
}
