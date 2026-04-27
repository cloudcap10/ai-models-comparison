'use client';

import { useState } from 'react';
import { ChevronDown } from 'lucide-react';
import { FAQ_ITEMS } from '@/lib/faq';

export default function FaqSection() {
  const [open, setOpen] = useState<number | null>(null);

  return (
    <section className="px-4 pb-20" aria-label="Frequently asked questions">
      <div className="max-w-3xl mx-auto">
        <h2 className="text-2xl font-bold mb-2" style={{ color: 'var(--text)' }}>
          Frequently Asked Questions
        </h2>
        <p className="text-sm mb-8" style={{ color: 'var(--text-muted)' }}>
          Quick answers about AI model selection, pricing, and benchmarks.
        </p>
        <div className="space-y-2">
          {FAQ_ITEMS.map((item, i) => (
            <div
              key={i}
              className="rounded-xl overflow-hidden"
              style={{ background: 'var(--bg-card)', border: '1px solid var(--border-subtle)' }}
            >
              <button
                className="w-full flex items-center justify-between px-5 py-4 text-left gap-4"
                onClick={() => setOpen(open === i ? null : i)}
                aria-expanded={open === i}
              >
                <span className="text-sm font-medium" style={{ color: 'var(--text)' }}>
                  {item.q}
                </span>
                <ChevronDown
                  size={16}
                  style={{
                    color: 'var(--text-faint)',
                    flexShrink: 0,
                    transform: open === i ? 'rotate(180deg)' : 'rotate(0deg)',
                    transition: 'transform 0.2s',
                  }}
                />
              </button>
              {open === i && (
                <div
                  className="px-5 pb-4 text-sm leading-relaxed"
                  style={{ color: 'var(--text-muted)' }}
                >
                  {item.a}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
