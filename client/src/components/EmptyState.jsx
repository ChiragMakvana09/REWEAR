import React from "react";

export default function EmptyState({ icon = "🗂️", title = "Nothing here yet", subtitle = "", action = null }) {
  return (
    <div className="text-center py-20 px-6">
      <div className="text-5xl mb-4">{icon}</div>
      <h3 className="font-display text-xl mb-2">{title}</h3>
      {subtitle && <p className="opacity-60 text-sm max-w-sm mx-auto mb-6">{subtitle}</p>}
      {action}
    </div>
  );
}
