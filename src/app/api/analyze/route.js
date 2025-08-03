// src/app/api/analyze/route.js

export async function POST(req) {
    try {
        const body = await req.json();
        const { startDate, endDate, cases } = body;

        if (!startDate || !endDate || !Array.isArray(cases)) {
            return new Response(
                JSON.stringify({ success: false, error: 'Missing required fields' }),
                { status: 400 }
            );
        }

        // ✅ Example: Simple analysis result
        const total = cases.length;
        const groupedByType = {};

        for (const item of cases) {
            if (!groupedByType[item.type]) {
                groupedByType[item.type] = 0;
            }
            groupedByType[item.type]++;
        }

        return new Response(
            JSON.stringify({
                success: true,
                total,
                groupedByType,
                message: 'Analysis complete',
            }),
            { status: 200 }
        );
    } catch (err) {
        console.error('API Error:', err);
        return new Response(
            JSON.stringify({ success: false, error: 'Server error' }),
            { status: 500 }
        );
    }
}
