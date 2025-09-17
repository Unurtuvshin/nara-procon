"use client";
import { useState, useEffect } from "react";

export default function FieldsPage() {
  const [fields, setFields] = useState([]);
  const [selectedField, setSelectedField] = useState(null);
  const [words, setWords] = useState([]);
  const [fieldName, setFieldName] = useState("");
  const [wordInput, setWordInput] = useState({ word_no: "", field_word: "" });

  // Load fields
  const loadFields = async () => {
    const res = await fetch("/api/fields");
    const data = await res.json();
    console.log("Fields fetched:", data); // debug
    setFields(data);
  };

  // Load words for selected field
  const loadWords = async (fieldId) => {
    if (!fieldId) return;
    const res = await fetch(`/api/words?field_id=${fieldId}`);
    const data = await res.json();
    setWords(data);
  };

  useEffect(() => {
    loadFields();
  }, []);

  const handleAddField = async () => {
    if (!fieldName) return alert("Field name required");

    const res = await fetch("/api/fields", {
      // <-- fixed endpoint
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ field: fieldName }),
    });

    if (!res.ok) return alert("Failed to add field");

    setFieldName("");
    loadFields();
  };

  const handleDeleteField = async (id) => {
    if (!confirm("Delete this field?")) return;

    const res = await fetch("/api/fields", {
      // <-- fixed endpoint
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id }),
    });

    if (!res.ok) return alert("Failed to delete field");

    if (selectedField?.id === id) setSelectedField(null);
    loadFields();
  };

  const handleAddWord = async () => {
    if (!selectedField) return alert("Select a field first");
    if (!wordInput.word_no || !wordInput.field_word)
      return alert("Fill word data");

    const res = await fetch("/api/words", {
      // <-- fixed endpoint
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...wordInput, field_id: selectedField.id }),
    });

    if (!res.ok) return alert("Failed to add word");

    setWordInput({ word_no: "", field_word: "" });
    loadWords(selectedField.id);
  };

  const handleDeleteWord = async (id) => {
    if (!confirm("Delete this word?")) return;

    const res = await fetch("/api/words", {
      // <-- fixed endpoint
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id }),
    });

    if (!res.ok) return alert("Failed to delete word");

    loadWords(selectedField.id);
  };

  const handleInitializeFields = async () => {
    if (!confirm("This will reset all fields and words. Continue?")) return;

    // 1. Delete all words
    let res = await fetch("/api/words", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ deleteAll: true }),
    });
    if (!res.ok) return alert("Failed to delete words");

    // 2. Delete all fields
    res = await fetch("/api/fields", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ deleteAll: true }),
    });
    if (!res.ok) return alert("Failed to delete fields");

    // 3. Initialize fields & words
    for (let i = 1; i <= 5; i++) {
      // Create field
      const fieldRes = await fetch("/api/fields", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ field: `f${i}` }),
      });
      if (!fieldRes.ok) return alert("Failed to create field");
      const newField = await fieldRes.json();

      // Create 3 words for this field
      for (let w = 1; w <= 3; w++) {
        const wordRes = await fetch("/api/words", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            field_id: newField.id,
            word_no: w,
            field_word: `f${i}w${w}`,
          }),
        });
        if (!wordRes.ok) return alert("Failed to create word");
      }
    }

    // Reload fields
    loadFields();
    setSelectedField(null);
  };

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-4">Fields & Words Management</h2>
      <div className="flex space-x-8">
        {/* Fields Table */}
        <div className="w-1/2">
          <h3 className="font-bold mb-2">Fields</h3>
          <input
            type="text"
            placeholder="New Field Name"
            value={fieldName}
            onChange={(e) => setFieldName(e.target.value)}
            className="border px-2 py-1 mb-2 w-full"
          />
          <button
            onClick={handleAddField}
            className="bg-blue-600 text-white px-3 py-1 mb-4 rounded"
          >
            Add Field
          </button>
          <table className="w-full border border-gray-300">
            <thead>
              <tr>
                <th className="border px-2">#</th>
                <th className="border px-2">Field Name</th>
                <th className="border px-2">Actions</th>
              </tr>
            </thead>
            <tbody>
              {fields.map((f, idx) => (
                <tr
                  key={f.id}
                  className={selectedField?.id === f.id ? "bg-gray-100" : ""}
                  onClick={() => {
                    setSelectedField(f);
                    loadWords(f.id);
                  }}
                >
                  <td className="border px-2 text-center">{idx + 1}</td>
                  <td className="border px-2">{f.field}</td>
                  <td className="border px-2 text-center">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDeleteField(f.id);
                      }}
                      className="text-red-600"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Words Table */}
        <div className="w-1/2">
          <h3 className="font-bold mb-2">Words of Selected Field</h3>
          {selectedField && (
            <>
              <div className="flex space-x-2 mb-2">
                <input
                  type="number"
                  placeholder="Word No"
                  value={wordInput.word_no}
                  onChange={(e) =>
                    setWordInput({ ...wordInput, word_no: e.target.value })
                  }
                  className="border px-2 py-1 w-20"
                />
                <input
                  type="text"
                  placeholder="Word"
                  value={wordInput.field_word}
                  onChange={(e) =>
                    setWordInput({ ...wordInput, field_word: e.target.value })
                  }
                  className="border px-2 py-1 flex-1"
                />
                <button
                  onClick={handleAddWord}
                  className="bg-green-600 text-white px-3 py-1 rounded"
                >
                  Add Word
                </button>
              </div>
              <table className="w-full border border-gray-300">
                <thead>
                  <tr>
                    <th className="border px-2">#</th>
                    <th className="border px-2">Word No</th>
                    <th className="border px-2">Word</th>
                    <th className="border px-2">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {words.map((w, idx) => (
                    <tr key={w.id}>
                      <td className="border px-2 text-center">{idx + 1}</td>
                      <td className="border px-2 text-center">{w.word_no}</td>
                      <td className="border px-2">{w.field_word}</td>
                      <td className="border px-2 text-center">
                        <button
                          onClick={() => handleDeleteWord(w.id)}
                          className="text-red-600"
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </>
          )}
        </div>
      </div>
      <button
        onClick={handleInitializeFields}
        className="bg-purple-600 text-white px-3 py-1 mb-4 rounded"
      >
        Initialize Fields & Words
      </button>
    </div>
  );
}
