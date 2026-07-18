import React from "react";

export function SkeletonCard() {
  return (
    <div className="animate-pulse">
      <div className="w-full aspect-[5/6.5] bg-line/40 rounded-sm mb-3" />
      <div className="h-2.5 w-1/3 bg-line/40 rounded mb-2" />
      <div className="h-3.5 w-2/3 bg-line/40 rounded mb-3" />
      <div className="h-4 w-1/2 bg-line/40 rounded" />
    </div>
  );
}

export function SkeletonGrid({ count = 8 }) {
  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
      {Array.from({ length: count }).map((_, i) => <SkeletonCard key={i} />)}
    </div>
  );
}
