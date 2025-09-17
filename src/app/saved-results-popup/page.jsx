"use client";
import { useEffect, useState } from "react";

export default function SavedResultsPopup() {
  const [savedResults, setSavedResults] = useState([]);
  const [selectedId, setSelectedId] = useState(null); // only 1 allowed

  useEffect(() => {
    fetch("/api/results/list")
      .then((res) => res.json())
      .then(setSavedResults)
      .catch(() => alert("以前の分析結果の取得に失敗しました"));
  }, []);

  const handleSelect = () => {
    if (!selectedId) {
      alert("1件選択してください");
      return;
    }

    fetch(`/api/results/get?id=${selectedId}`)
      .then((res) => res.json())
      .then((result) => {
        if (window.opener) {
          window.opener.postMessage({ type: "SELECTED_RESULTS", result }, "*");
          window.close();
        } else {
          alert("親ウィンドウが見つかりません");
        }
      })
      .catch(() => alert("選択した結果の取得に失敗しました"));
  };

  return (
    <main className="p-6 font-sans">
      <h1 className="text-2xl font-bold mb-4">以前の分析結果を選択</h1>
      <ul className="space-y-2 max-h-[60vh] overflow-auto border p-2 rounded">
        {savedResults.length === 0 && <li>保存された結果がありません。</li>}
        {savedResults.map((r) => (
          <li key={r.id} className="flex items-center space-x-2">
            <input
              type="radio"
              name="selectedResult"
              checked={selectedId === r.id}
              onChange={() => setSelectedId(r.id)}
              id={`result-${r.id}`}
            />
            <label htmlFor={`result-${r.id}`} className="cursor-pointer">
              <strong>{r.name}</strong> — {r.start_date} ~ {r.end_date}
            </label>
          </li>
        ))}
      </ul>
      <div className="mt-4">
        <button
          onClick={handleSelect}
          className="bg-blue-600 text-white px-4 py-2 rounded"
        >
          選択
        </button>
      </div>
    </main>
  );
}
