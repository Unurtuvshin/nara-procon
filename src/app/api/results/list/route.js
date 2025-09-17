import db from '@/db/database';

export async function GET() {
    try {
        const rows = db.prepare('SELECT id, name, start_date, end_date FROM results ORDER BY id DESC').all();
        return new Response(JSON.stringify(rows), { status: 200 });
    } catch (err) {
        return new Response(JSON.stringify({ error: 'Failed to fetch results' }), { status: 500 });
    }
}
