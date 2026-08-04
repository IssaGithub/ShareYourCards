"use client";

import { useState } from "react";

export function FaqAccordion({
  items,
}: {
  items: { q: string; a: string }[];
}) {
  const [open, setOpen] = useState<number | null>(0);

  return (
    <div className="divide-y divide-line border-y border-line">
      {items.map((item, i) => {
        const isOpen = open === i;
        return (
          <div key={item.q}>
            <button
              type="button"
              className="flex w-full items-center justify-between gap-4 py-5 text-left"
              onClick={() => setOpen(isOpen ? null : i)}
              aria-expanded={isOpen}
            >
              <span className="font-display text-lg font-bold sm:text-xl">{item.q}</span>
              <span className="text-accent text-xl">{isOpen ? "−" : "+"}</span>
            </button>
            {isOpen && (
              <p className="animate-fade-in pb-5 text-sm leading-relaxed text-fg-muted">
                {item.a}
              </p>
            )}
          </div>
        );
      })}
    </div>
  );
}
