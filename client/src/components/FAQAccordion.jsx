import React, { useState } from "react";

const FAQS = [
  { q: "Is the clothing actually secondhand?", a: "Yes — every piece is preloved, hand-checked for quality, and cleaned before it's listed." },
  { q: "How accurate are the condition labels?", a: "\"Like New\", \"Gently Used\" and \"Well Loved\" are assigned honestly after inspection, with photos showing any visible wear." },
  { q: "What payment methods are accepted?", a: "We accept UPI, cards and net banking through Razorpay's secure checkout." },
  { q: "Can I return an item?", a: "Yes, unworn items in original condition can be returned within 7 days of delivery." },
  { q: "How long does shipping take?", a: "Most orders are packed within 48 hours and delivered in 3-6 business days depending on location." },
  { q: "Do you sell menswear?", a: "We're currently women's-fashion focused, with menswear categories planned soon." },
];

export default function FAQAccordion() {
  const [open, setOpen] = useState(0);

  return (
    <div className="max-w-2xl mx-auto divide-y divide-line">
      {FAQS.map((f, i) => (
        <div key={i} className="py-5">
          <button
            onClick={() => setOpen(open === i ? -1 : i)}
            className="w-full flex items-center justify-between text-left font-display text-lg"
          >
            {f.q}
            <span className="mono text-sm opacity-50">{open === i ? "−" : "+"}</span>
          </button>
          {open === i && <p className="text-sm opacity-70 mt-3 max-w-xl">{f.a}</p>}
        </div>
      ))}
    </div>
  );
}
