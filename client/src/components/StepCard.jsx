import React from "react";

export default function StepCard({ step, index }) {
  return (
    <div>
      <div className="mono text-xs uppercase tracking-wide text-rose mb-3">
        {String(index + 1).padStart(2, "0")}
      </div>
      <div className="text-3xl mb-3">{step.icon}</div>
      <h3 className="text-xl mb-2 font-display">{step.title}</h3>
      <p className="text-sm opacity-75 max-w-xs">{step.description}</p>
    </div>
  );
}
