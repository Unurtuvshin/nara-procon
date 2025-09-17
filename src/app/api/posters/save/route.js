import db from '@/db/database';

export async function POST(req) {
    try {
        const data = await req.json();
        const {
            name,
            text,
            poster_url,
            image_url,
            result_id,
            text_size,
            text_color,
        } = data;

        console.log('[POSTER SAVE]', {
            name,
            text,
            poster_url,
            image_url,
            result_id,
            text_size,
            text_color,
        });

        if (!name || !poster_url) {
            return new Response(
                JSON.stringify({ error: 'Missing required fields: name or poster_url' }),
                { status: 400, headers: { 'Content-Type': 'application/json' } }
            );
        }

        try {
            db.prepare(
                `INSERT INTO posters 
          (name, text, poster_url, image_url, result_id, text_size, text_color) 
          VALUES (?, ?, ?, ?, ?, ?, ?)`
            ).run([
                name,
                text ?? '',
                poster_url,
                image_url,
                result_id ?? null,
                text_size ?? 24,
                text_color ?? '#000000',
            ]);
        } catch (dbError) {
            console.error('[DB INSERT ERROR]', dbError);
            return new Response(
                JSON.stringify({ error: 'Database insert failed' }),
                { status: 500, headers: { 'Content-Type': 'application/json' } }
            );
        }

        return new Response(JSON.stringify({ success: true }), {
            status: 201,
            headers: { 'Content-Type': 'application/json' },
        });
    } catch (err) {
        console.error('[POSTERS SAVE ERROR]', err);
        return new Response(
            JSON.stringify({ error: 'Internal Server Error' }),
            { status: 500, headers: { 'Content-Type': 'application/json' } }
        );
    }
}
