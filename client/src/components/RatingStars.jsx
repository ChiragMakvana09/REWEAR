import React from "react";

export default function RatingStars({ rating = 0, size = "text-xs", showValue = true }) {
  const full = Math.round(rating);
  return (
    <div className={`flex items-center gap-1 ${size}`}>
      <span className="text-mustard tracking-tight">
        {"★".repeat(full)}
        <span className="opacity-25">{"★".repeat(5 - full)}</span>
      </span>
      {showValue && <span className="mono opacity-60 text-[11px]">{rating?.toFixed(1)}</span>}
    </div>
  );
}
