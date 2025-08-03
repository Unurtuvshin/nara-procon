import db from '@/db/database';

export async function GET() {
    try {
        const all = db.prepare('SELECT * FROM cases ORDER BY id DESC').all();
        return Response.json(all);
    } catch (err) {
        console.error('DB fetch error:', err);
        return Response.json({ error: 'Failed to load data' }, { status: 500 });
    }
}
