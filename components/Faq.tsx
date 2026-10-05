"use client";

import { useState } from "react";

/** Accessible FAQ accordion using the .faq-* classes. First item open by default. */
export default function Faq({ faqs }: { faqs: { q: string; a: string }[] }) {
  const [open, setOpen] = useState(0);

  return (
    <div className="card px-5 sm:px-7">
      {faqs.map((item, i) => {
        const isOpen = open === i;
        return (
          <div key={i} className="faq-item">
            <h3 className="m-0">
              <button
                type="button"
                className="faq-q"
                aria-expanded={isOpen}
                aria-controls={`faq-panel-${i}`}
                id={`faq-btn-${i}`}
                onClick={() => setOpen(isOpen ? -1 : i)}
              >
                <span>{item.q}</span>
                <svg
                  width="18"
                  height="18"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                  aria-hidden="true"
                  style={{
                    flexShrink: 0,
                    transform: isOpen ? "rotate(45deg)" : "none",
                    transition: "transform 0.15s ease",
                  }}
                >
                  <path d="M12 5v14M5 12h14" />
                </svg>
              </button>
            </h3>
            <div
              id={`faq-panel-${i}`}
              role="region"
              aria-labelledby={`faq-btn-${i}`}
              hidden={!isOpen}
            >
              <p className="faq-a">{item.a}</p>
            </div>
          </div>
        );
      })}
    </div>
  );
}
