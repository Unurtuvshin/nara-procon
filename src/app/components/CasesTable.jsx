"use client";

export default function CasesTable({
  cases,
  currentPage,
  pageSize,
  selectedIds,
  toggleSelect,
  toggleSelectAll,
}) {
  const pagedCases = cases; // no slicing

  return (
    <div className="overflow-x-auto">
      <table className="w-full border border-gray-300 text-sm border-collapse">
        <thead className="bg-gray-100">
          <tr>
            <th className="border p-2 text-center">
              <input
                type="checkbox"
                checked={
                  selectedIds.size === pagedCases.length &&
                  pagedCases.length > 0
                }
                onChange={(e) => toggleSelectAll(e.target.checked)}
              />
            </th>
            <th className="border p-2">#</th>
            <th className="border p-2">件名</th>
            <th className="border p-2">相談概要</th>
            <th className="border p-2">年月日</th>
            <th className="border p-2">購入形態</th>
          </tr>
        </thead>
        <tbody>
          {pagedCases.map((c, idx) => (
            <tr key={c.id} className="hover:bg-gray-50">
              <td className="border p-2 text-center">
                <input
                  type="checkbox"
                  checked={selectedIds.has(c.id)}
                  onChange={() => toggleSelect(c.id)}
                />
              </td>
              <td className="border border-gray-500 p-3 text-center">
                {(currentPage - 1) * pageSize + idx + 1}{" "}
              </td>

              <td className="border p-2">{c.name}</td>
              <td className="border p-2">{c.description}</td>
              <td className="border p-2">{c.date}</td>
              <td className="border p-2">{c.type}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
