import db from '@/db/database';

export default function CasesPage() {
  const cases = db.prepare('SELECT * FROM cases ORDER BY id ASC').all();

  return (
    <main style={{ padding: '1rem' }}>
      <h1>Cases List</h1>
      <table border="1" cellPadding="8">
        <thead>
          <tr>
            <th>ID</th><th>名前</th><th>要件詳細</th><th>年月日</th><th>要件</th>
          </tr>
        </thead>
        <tbody>
          {cases.map((c) => (
            <tr key={c.id}>
              <td>{c.id}</td>
              <td>{c.name}</td>
              <td>{c.content}</td>
              <td>{c.date}</td>
              <td>{c.type}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </main>
  );
}
