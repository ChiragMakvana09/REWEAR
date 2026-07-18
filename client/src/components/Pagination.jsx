import React from "react";

export default function Pagination({ page, totalPages, onChange }) {
  if (totalPages <= 1) return null;

  const pages = Array.from({ length: totalPages }, (_, i) => i + 1).filter(
    (p) => p === 1 || p === totalPages || Math.abs(p - page) <= 1
  );

  return (
    <div className="flex items-center justify-center gap-2 mt-14 mono text-sm">
      <button
        onClick={() => onChange(Math.max(1, page - 1))}
        disabled={page === 1}
        className="w-9 h-9 border border-line rounded-sm disabled:opacity-30 hover:bg-ink hover:text-cream-paper transition"
      >
        ‹
      </button>
      {pages.map((p, idx) => (
        <React.Fragment key={p}>
          {idx > 0 && p - pages[idx - 1] > 1 && <span className="opacity-40">…</span>}
          <button
            onClick={() => onChange(p)}
            className={`w-9 h-9 rounded-sm border transition ${
              p === page ? "bg-ink text-cream-paper border-ink" : "border-line hover:bg-ink hover:text-cream-paper"
            }`}
          >
            {p}
          </button>
        </React.Fragment>
      ))}
      <button
        onClick={() => onChange(Math.min(totalPages, page + 1))}
        disabled={page === totalPages}
        className="w-9 h-9 border border-line rounded-sm disabled:opacity-30 hover:bg-ink hover:text-cream-paper transition"
      >
        ›
      </button>
    </div>
  );
}
