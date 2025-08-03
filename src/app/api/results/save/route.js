// ✅ src/app/api/results/save/route.js
import db from '@/db/database';
import { NextResponse } from 'next/server';

export async function POST(req) {
    try {
        const { name, startDate, endDate, result } = await req.json();

        if (!name || !startDate || !endDate || !result) {
            return NextResponse.json({ error: 'Missing fields' }, { status: 400 });
        }

        const stmt = db.prepare(`
      INSERT INTO results (name, start_date, end_date, result)
      VALUES (?, ?, ?, ?)
    `);

        const info = stmt.run(name, startDate, endDate, result);

        return NextResponse.json({ id: info.lastInsertRowid }); // ✅ IMPORTANT
    } catch (err) {
        console.error('[RESULTS SAVE ERROR]', err);
        return NextResponse.json({ error: 'Failed to save result' }, { status: 500 });
    }
}
