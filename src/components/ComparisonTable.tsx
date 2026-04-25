'use client';

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Check, X, Minus, ChevronDown, ChevronUp } from 'lucide-react';
import type { AIModel } from '@/types/model';
import { formatContextWindow, formatPrice, getProviderColor, formatConsumerPlan } from '@/lib/utils';

interface ComparisonTableProps {
  models: AIModel[];
}

type SortKey = keyof AIModel;

function BoolCell({ value }: { value: boolean }) {
  return value ? (
    <Check size={14} style={{ color: '#34d399' }} />
  ) : (
    <X size={14} style={{ color: 'var(--text-faint)' }} />
  );
}

function DotRating({ value }: { value: number }) {
  return (
    <div className="flex gap-0.5 justify-center">
      {[1, 2, 3, 4, 5].map((i) => (
        <div
          key={i}
          className="w-1.5 h-1.5 rounded-full"
          style={{ background: i <= value ? 'var(--accent)' : 'var(--border)' }}
        />
      ))}
    </div>
  );
}

const COLUMNS = [
  { key: 'name', label: 'Model', sortable: true, sticky: true },
  { key: 'contextWindow', label: 'Context', sortable: true },
  { key: 'maxOutput', label: 'Max Out', sortable: true },
  { key: 'inputPricePer1M', label: 'Input/1M', sortable: true },
  { key: 'outputPricePer1M', label: 'Output/1M', sortable: true },
  { key: 'consumerPlanPricePerMonth', label: 'Monthly Plan', sortable: true },
  { key: 'knowledgeCutoff', label: 'Cutoff', sortable: false },
  { key: 'codeCapability', label: 'Code', sortable: true },
  { key: 'reasoningCapability', label: 'Reasoning', sortable: true },
  { key: 'speedRating', label: 'Speed', sortable: true },
  { key: 'openSource', label: 'Open', sortable: false },
  { key: 'vision', label: 'Vision', sortable: false },
  { key: 'audio', label: 'Audio', sortable: false },
  { key: 'functionCalling', label: 'Tools', sortable: false },
  { key: 'extendedThinking', label: 'Thinking', sortable: false },
  { key: 'promptCaching', label: 'Caching', sortable: false },
  { key: 'fineTuning', label: 'Fine-tune', sortable: false },
];

export default function ComparisonTable({ models }: ComparisonTableProps) {
  const [sortKey, setSortKey] = useState<SortKey>('name');
  const [sortDir, setSortDir] = useState<'asc' | 'desc'>('asc');

  const handleSort = (key: string) => {
    if (sortKey === key) {
      setSortDir((d) => (d === 'asc' ? 'desc' : 'asc'));
    } else {
      setSortKey(key as SortKey);
      setSortDir('asc');
    }
  };

  const sorted = [...models].sort((a, b) => {
    const av = a[sortKey];
    const bv = b[sortKey];
    if (av === undefined || bv === undefined) return 0;
    const cmp =
      typeof av === 'number' && typeof bv === 'number'
        ? av - bv
        : String(av).localeCompare(String(bv));
    return sortDir === 'asc' ? cmp : -cmp;
  });

  return (
    <div className="rounded-2xl overflow-hidden" style={{ border: '1px solid var(--border-subtle)' }}>
      <div className="overflow-x-auto">
        <table className="comparison-table w-full text-sm">
          <thead>
            <tr style={{ background: 'var(--bg-surface)' }}>
              {COLUMNS.map((col) => (
                <th
                  key={col.key}
                  className={`px-3 py-3 text-left whitespace-nowrap ${col.sticky ? 'sticky left-0 z-10' : ''}`}
                  style={{
                    color: sortKey === col.key ? 'var(--accent)' : 'var(--text-faint)',
                    fontSize: '0.72rem',
                    fontWeight: 600,
                    letterSpacing: '0.06em',
                    textTransform: 'uppercase',
                    background: col.sticky ? 'var(--bg-surface)' : undefined,
                    cursor: col.sortable ? 'pointer' : 'default',
                    userSelect: 'none',
                  }}
                  onClick={() => col.sortable && handleSort(col.key)}
                >
                  <span className="flex items-center gap-1">
                    {col.label}
                    {col.sortable && sortKey === col.key && (
                      sortDir === 'asc' ? <ChevronUp size={12} /> : <ChevronDown size={12} />
                    )}
                  </span>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {sorted.map((model) => (
              <tr key={model.id} style={{ background: 'var(--bg-card)' }}>
                {/* Model name — sticky */}
                <td
                  className="sticky left-0 px-3 py-3 z-10"
                  style={{ background: 'var(--bg-card)' }}
                >
                  <Link href={`/model/${model.id}`} className="flex items-center gap-2 group">
                    <div
                      className="w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0"
                      style={{
                        background: 'var(--bg-surface)',
                        border: '1px solid var(--border-subtle)',
                      }}
                    >
                      <Image
                        src={model.icon}
                        alt={model.provider}
                        width={14}
                        height={14}
                        unoptimized
                      />
                    </div>
                    <div>
                      <div
                        className="font-medium leading-tight group-hover:underline"
                        style={{ color: 'var(--text)', fontSize: '0.8rem' }}
                      >
                        {model.name}
                      </div>
                      <div
                        className="text-xs"
                        style={{ color: getProviderColor(model.provider), opacity: 0.8 }}
                      >
                        {model.provider}
                      </div>
                    </div>
                  </Link>
                </td>

                <td className="px-3 py-3 text-center whitespace-nowrap" style={{ color: 'var(--text)' }}>
                  {formatContextWindow(model.contextWindow)}
                </td>
                <td className="px-3 py-3 text-center whitespace-nowrap" style={{ color: 'var(--text-muted)' }}>
                  {formatContextWindow(model.maxOutput)}
                </td>
                <td className="px-3 py-3 text-center whitespace-nowrap" style={{ color: 'var(--green)' }}>
                  {formatPrice(model.inputPricePer1M)}
                </td>
                <td className="px-3 py-3 text-center whitespace-nowrap" style={{ color: 'var(--yellow)' }}>
                  {formatPrice(model.outputPricePer1M)}
                </td>
                <td className="px-3 py-3 text-center whitespace-nowrap">
                  {(() => {
                    const plan = formatConsumerPlan(model.consumerPlanName, model.consumerPlanPricePerMonth);
                    if (!plan) return <Minus size={12} style={{ color: 'var(--text-faint)', margin: '0 auto' }} />;
                    return (
                      <div>
                        <div
                          className="text-xs font-semibold"
                          style={{ color: plan.badge === 'Free' ? '#34d399' : '#a78bfa' }}
                        >
                          {plan.badge}
                        </div>
                        <div className="text-xs" style={{ color: 'var(--text-faint)' }}>
                          {plan.label}
                        </div>
                      </div>
                    );
                  })()}
                </td>
                <td className="px-3 py-3 text-center whitespace-nowrap" style={{ color: 'var(--text-muted)' }}>
                  {model.knowledgeCutoff}
                </td>
                <td className="px-3 py-3 text-center">
                  <DotRating value={model.codeCapability} />
                </td>
                <td className="px-3 py-3 text-center">
                  <DotRating value={model.reasoningCapability} />
                </td>
                <td className="px-3 py-3 text-center">
                  <DotRating value={model.speedRating} />
                </td>
                <td className="px-3 py-3 text-center">
                  <BoolCell value={model.openSource} />
                </td>
                <td className="px-3 py-3 text-center">
                  <BoolCell value={model.vision} />
                </td>
                <td className="px-3 py-3 text-center">
                  <BoolCell value={model.audio} />
                </td>
                <td className="px-3 py-3 text-center">
                  <BoolCell value={model.functionCalling} />
                </td>
                <td className="px-3 py-3 text-center">
                  <BoolCell value={model.extendedThinking} />
                </td>
                <td className="px-3 py-3 text-center">
                  <BoolCell value={model.promptCaching} />
                </td>
                <td className="px-3 py-3 text-center">
                  <BoolCell value={model.fineTuning} />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
