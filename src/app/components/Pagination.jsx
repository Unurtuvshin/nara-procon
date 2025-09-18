import { useState } from "react";

export default function Pagination({ page, totalPages, onPageChange }) {
  const [jump, setJump] = useState("");

  const createPageNumbers = () => {
    const pages = [];
    const delta = 1; // pages around current
    const range = [];

    for (let i = 1; i <= totalPages; i++) {
      if (
        i === 1 ||
        i === totalPages ||
        (i >= page - delta && i <= page + delta)
      ) {
        range.push(i);
      }
    }

    let last = 0;
    for (let i of range) {
      if (last && i - last > 1) {
        pages.push("...");
      }
      pages.push(i);
      last = i;
    }

    return pages;
  };

  const handleJump = () => {
    const p = parseInt(jump);
    if (!isNaN(p) && p >= 1 && p <= totalPages) {
      onPageChange(p);
      setJump("");
    }
  };

  return (
    <div className="flex items-center gap-2 mt-4">
      <button
        disabled={page === 1}
        onClick={() => onPageChange(1)}
        className="px-2 py-1 border rounded disabled:opacity-50"
      >
        First
      </button>
      <button
        disabled={page === 1}
        onClick={() => onPageChange(page - 1)}
        className="px-2 py-1 border rounded disabled:opacity-50"
      >
        Prev
      </button>

      {createPageNumbers().map((p, idx) =>
        p === "..." ? (
          <span key={idx} className="px-2 py-1">
            ...
          </span>
        ) : (
          <button
            key={idx}
            className={`px-2 py-1 border rounded ${
              p === page ? "bg-blue-500 text-white" : ""
            }`}
            onClick={() => onPageChange(p)}
          >
            {p}
          </button>
        )
      )}

      <button
        disabled={page === totalPages}
        onClick={() => onPageChange(page + 1)}
        className="px-2 py-1 border rounded disabled:opacity-50"
      >
        Next
      </button>
      <button
        disabled={page === totalPages}
        onClick={() => onPageChange(totalPages)}
        className="px-2 py-1 border rounded disabled:opacity-50"
      >
        Last
      </button>

      <div className="flex items-center gap-1 ml-4">
        <input
          type="number"
          min={1}
          max={totalPages}
          value={jump}
          onChange={(e) => setJump(e.target.value)}
          className="border px-2 py-1 w-16 rounded"
          placeholder="Page #"
        />
        <button
          onClick={handleJump}
          className="px-2 py-1 border rounded bg-green-500 text-white"
        >
          Go
        </button>
      </div>
    </div>
  );
}
