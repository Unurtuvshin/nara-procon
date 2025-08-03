import db from '@/db/database';

export default function PostersPage() {
  const posters = db.prepare('SELECT * FROM posters ORDER BY id DESC').all();

  return (
    <main style={{ padding: '1rem' }}>
      <h1>🖼️ Posters Table</h1>
      <table border="1" cellPadding="8">
        <thead>
          <tr>
            <th>ID</th><th>名前</th><th>本文</th><th>ポスターURL</th><th>画像URL</th>
            <th>Result ID</th><th>文字サイズ</th><th>文字色</th>
          </tr>
        </thead>
        <tbody>
          {posters.map((p) => (
            <tr key={p.id}>
              <td>{p.id}</td>
              <td>{p.name}</td>
              <td>{p.text}</td>
              <td>{p.poster_url}</td>
              <td>{p.image_url}</td>
              <td>{p.result_id}</td>
              <td>{p.text_size}</td>
              <td>{p.text_color}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </main>
  );
}
