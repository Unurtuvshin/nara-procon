import path from 'path';
import { open } from 'sqlite';
import sqlite3 from 'sqlite3';

export async function GET(req, { params }) {
    const dbPath = path.resolve(process.cwd(), 'src/db/db.sqlite');
    const db = await open({
        filename: dbPath,
        driver: sqlite3.Database,
    });

    const caseData = await db.get('SELECT * FROM cases WHERE id = ?', [params.id]);

    if (!caseData) {
        return new Response(JSON.stringify({ error: 'Not found' }), { status: 404 });
    }

    return new Response(JSON.stringify(caseData), { status: 200 });
}
