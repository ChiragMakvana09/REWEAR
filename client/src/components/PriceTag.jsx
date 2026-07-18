import React from "react";

export default function PriceTag({ price, originalPrice }) {
  return (
    <div className="flex items-baseline gap-2">
      <span className="font-display font-semibold text-lg">₹{price}</span>
      {originalPrice > price && (
        <span className="mono text-xs line-through opacity-50">₹{originalPrice}</span>
      )}
    </div>
  );
}
