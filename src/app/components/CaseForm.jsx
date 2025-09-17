// src/app/components/CaseForm.jsx
"use client";
import { useState, useEffect } from "react";

export default function CaseForm({ onClose, onSuccess, defaultData = {} }) {
  const [formData, setFormData] = useState({
    id: null,
    name: "",
    desc: "",
    date: "",
    type: "",
  });

  useEffect(() => {
    setFormData({
      id: defaultData?.id ?? null,
      name: defaultData?.name ?? "",
      desc: defaultData?.desc ?? "", // ✅ fixed (was content)
      date: defaultData?.date ?? "",
      type: defaultData?.type ?? "",
    });
  }, [defaultData]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const apiUrl = formData.id ? "/api/update-case" : "/api/submit";

    try {
      const res = await fetch(apiUrl, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
      const result = await res.json();

      if (result.success) {
        alert(formData.id ? "更新されました！" : "送信されました！");
        onSuccess(); // ✅ reload table
        onClose(); // ✅ close form
      } else {
        alert("失敗: " + result.error);
      }
    } catch (error) {
      console.error("Fetch error:", error);
      alert("エラーが発生しました。");
    }
  };

  return (
    <div className="bg-white p-6 rounded shadow w-full max-w-md">
      <h2 className="text-xl mb-4 font-bold">
        {formData.id ? "編集フォーム" : "お問い合わせフォーム"}
      </h2>
      <form onSubmit={handleSubmit}>
        <label>名前</label>
        <input
          name="name"
          value={formData.name}
          onChange={handleChange}
          required
          className="w-full border p-2 mb-3"
        />

        <label>要件詳細</label>
        <textarea
          name="desc"
          value={formData.desc}
          onChange={handleChange}
          required
          className="w-full border p-2 mb-3"
        />

        <label>年月日</label>
        <input
          type="date"
          name="date"
          value={formData.date}
          onChange={handleChange}
          required
          className="w-full border p-2 mb-3"
        />

        <label>要件</label>
        <input
          name="type"
          value={formData.type}
          onChange={handleChange}
          required
          className="w-full border p-2 mb-3"
        />

        <div className="flex justify-end space-x-2">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-1 bg-gray-300"
          >
            キャンセル
          </button>
          <button type="submit" className="px-4 py-1 bg-blue-500 text-white">
            送信
          </button>
        </div>
      </form>
    </div>
  );
}
