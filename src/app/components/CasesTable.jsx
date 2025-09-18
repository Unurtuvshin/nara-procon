"use client";

export default function CasesTable({
  cases,
  selectedIds,
  toggleSelect,
  toggleSelectAll,
}) {
  // Ensure cases is always an array
  const allCases = Array.isArray(cases) ? cases : [];

  return (
    <div className="overflow-x-auto">
      <table className="border border-gray-500 border-collapse w-full text-base">
        <thead className="bg-gray-100">
          <tr>
            <th className="border border-gray-500 p-3 text-center">
              <input
                type="checkbox"
                checked={
                  selectedIds.size === allCases.length && allCases.length > 0
                }
                onChange={toggleSelectAll}
              />
            </th>
            <th className="border border-gray-500 p-3">#</th>
            <th className="border border-gray-500 p-3">件名</th>
            <th className="border border-gray-500 p-3">相談概要</th>
            <th className="border border-gray-500 p-3">年月日</th>
            <th className="border border-gray-500 p-3">購入形態</th>
          </tr>
        </thead>
        <tbody>
          {allCases.map((c, index) => (
            <tr key={c.id} className="hover:bg-gray-50">
              <td className="border border-gray-500 p-3 text-center">
                <input
                  type="checkbox"
                  checked={selectedIds.has(c.id)}
                  onChange={() => toggleSelect(c.id)}
                />
              </td>
              <td className="border border-gray-500 p-3 text-center">
                {index + 1}
              </td>
              <td className="border border-gray-500 p-3">{c.name}</td>
              <td className="border border-gray-500 p-3">{c.description}</td>
              <td className="border border-gray-500 p-3">{c.date}</td>
              <td className="border border-gray-500 p-3">{c.type}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
