import db from '@/db/database';

export default function ResultsPage() {
  const results = db.prepare('SELECT * FROM results ORDER BY id DESC').all();

  return (
    <main style={{ padding: '1rem' }}>
      <h1>📊 Results Table</h1>
      <table border="1" cellPadding="8">
        <thead>
          <tr>
            <th>ID</th><th>名前</th><th>結果</th><th>開始日</th><th>終了日</th>
          </tr>
        </thead>
        <tbody>
          {results.map((r) => (
            <tr key={r.id}>
              <td>{r.id}</td>
              <td>{r.name}</td>
              <td>{r.result}</td>
              <td>{r.start_date}</td>
              <td>{r.end_date}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </main>
  );
}
