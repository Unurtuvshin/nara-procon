import db from '@/db/database';

export async function GET(req) {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get('id');
    if (!id) return new Response('Missing id', { status: 400 });

    try {
        const row = db.prepare('SELECT * FROM results WHERE id = ?').get(id);
        if (!row) return new Response('Not found', { status: 404 });

        // Return the row as JSON string, including the result as a plain string
        return new Response(JSON.stringify(row), {
            status: 200,
            headers: { 'Content-Type': 'application/json' },
        });
    } catch {
        return new Response('DB error', { status: 500 });
    }
}
