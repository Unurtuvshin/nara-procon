import db from '@/db/database';

export async function GET() {
    try {
        const posters = db.prepare('SELECT * FROM posters ORDER BY id DESC').all();
        return Response.json(posters);
    } catch (err) {
        console.error('[POSTERS LIST ERROR]', err);
        return new Response('Internal Server Error', { status: 500 });
    }
}
