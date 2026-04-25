'use client';

import { Search, X } from 'lucide-react';

export type SortKey =
  | 'name'
  | 'contextWindow'
  | 'inputPricePer1M'
  | 'codeCapability'
  | 'reasoningCapability'
  | 'speedRating';

export interface Filters {
  search: string;
  provider: string;
  tier: string;
  openSource: boolean | null;
  vision: boolean | null;
  thinking: boolean | null;
  sortKey: SortKey;
  sortDir: 'asc' | 'desc';
}

interface FilterBarProps {
  providers: string[];
  filters: Filters;
  onChange: (f: Filters) => void;
}

const SORT_OPTIONS: { key: SortKey; label: string }[] = [
  { key: 'name', label: 'Name' },
  { key: 'contextWindow', label: 'Context' },
  { key: 'inputPricePer1M', label: 'Price' },
  { key: 'codeCapability', label: 'Code' },
  { key: 'reasoningCapability', label: 'Reasoning' },
  { key: 'speedRating', label: 'Speed' },
];

const TIERS = [
  { key: '', label: 'All tiers' },
  { key: 'frontier', label: 'Frontier' },
  { key: 'standard', label: 'Standard' },
  { key: 'lite', label: 'Lite' },
];

const FEATURES = [
  { key: 'vision' as const, label: 'Vision' },
  { key: 'thinking' as const, label: 'Thinking' },
  { key: 'openSource' as const, label: 'Open Source' },
];

export default function FilterBar({ providers, filters, onChange }: FilterBarProps) {
  const update = (partial: Partial<Filters>) => onChange({ ...filters, ...partial });

  const hasActiveFilters =
    filters.search !== '' ||
    filters.provider !== '' ||
    filters.tier !== '' ||
    filters.openSource !== null ||
    filters.vision !== null ||
    filters.thinking !== null;

  const clearAll = () =>
    onChange({
      search: '',
      provider: '',
      tier: '',
      openSource: null,
      vision: null,
      thinking: null,
      sortKey: filters.sortKey,
      sortDir: filters.sortDir,
    });

  return (
    <div
      className="rounded-2xl p-4 mb-6 space-y-4"
      style={{ background: 'var(--bg-card)', border: '1px solid var(--border)' }}
    >
      {/* Row 1: search + sort */}
      <div className="flex gap-3 flex-wrap items-center">
        <div className="flex-1 min-w-[180px] relative">
          <Search
            size={14}
            className="absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none"
            style={{ color: 'var(--text-faint)' }}
          />
          <input
            type="text"
            placeholder="Search models, providers…"
            value={filters.search}
            onChange={(e) => update({ search: e.target.value })}
            className="w-full pl-9 pr-4 py-2 rounded-lg text-sm outline-none"
            style={{
              background: 'var(--bg-surface)',
              border: '1px solid var(--border)',
              color: 'var(--text)',
            }}
          />
        </div>

        <div className="flex items-center gap-2 flex-shrink-0">
          <span className="text-xs" style={{ color: 'var(--text-faint)' }}>
            Sort by
          </span>
          <select
            value={filters.sortKey}
            onChange={(e) => update({ sortKey: e.target.value as SortKey })}
            className="text-sm rounded-lg px-3 py-2 outline-none cursor-pointer"
            style={{
              background: 'var(--bg-surface)',
              border: '1px solid var(--border)',
              color: 'var(--text)',
            }}
          >
            {SORT_OPTIONS.map((o) => (
              <option key={o.key} value={o.key}>
                {o.label}
              </option>
            ))}
          </select>
          <button
            onClick={() => update({ sortDir: filters.sortDir === 'asc' ? 'desc' : 'asc' })}
            className="w-9 h-9 rounded-lg flex items-center justify-center text-sm font-medium transition-colors"
            style={{
              background: 'var(--bg-surface)',
              border: '1px solid var(--border)',
              color: 'var(--text-muted)',
            }}
            title={filters.sortDir === 'asc' ? 'Ascending' : 'Descending'}
          >
            {filters.sortDir === 'asc' ? '↑' : '↓'}
          </button>
        </div>

        {hasActiveFilters && (
          <button
            onClick={clearAll}
            className="flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-medium transition-colors flex-shrink-0"
            style={{
              background: 'rgba(245,101,101,0.08)',
              border: '1px solid rgba(245,101,101,0.2)',
              color: '#f56565',
            }}
          >
            <X size={12} />
            Clear all
          </button>
        )}
      </div>

      {/* Row 2: provider + tier chips */}
      <div
        className="flex flex-wrap gap-4 pt-4"
        style={{ borderTop: '1px solid var(--border-subtle)' }}
      >
        {/* Provider */}
        <div className="flex items-center gap-2 flex-wrap">
          <span className="text-xs font-medium flex-shrink-0" style={{ color: 'var(--text-faint)' }}>
            Provider
          </span>
          {['', ...providers].map((p) => (
            <button
              key={p || 'all'}
              onClick={() => update({ provider: p })}
              className="px-2.5 py-1 rounded-lg text-xs font-medium transition-all"
              style={{
                background: filters.provider === p ? 'var(--accent)' : 'var(--bg-surface)',
                color: filters.provider === p ? '#fff' : 'var(--text-muted)',
                border: `1px solid ${filters.provider === p ? 'var(--accent)' : 'var(--border)'}`,
              }}
            >
              {p || 'All'}
            </button>
          ))}
        </div>

        {/* Tier */}
        <div className="flex items-center gap-2 flex-wrap">
          <span className="text-xs font-medium flex-shrink-0" style={{ color: 'var(--text-faint)' }}>
            Tier
          </span>
          {TIERS.map((t) => (
            <button
              key={t.key}
              onClick={() => update({ tier: t.key })}
              className="px-2.5 py-1 rounded-lg text-xs font-medium transition-all"
              style={{
                background: filters.tier === t.key ? 'var(--accent)' : 'var(--bg-surface)',
                color: filters.tier === t.key ? '#fff' : 'var(--text-muted)',
                border: `1px solid ${filters.tier === t.key ? 'var(--accent)' : 'var(--border)'}`,
              }}
            >
              {t.label}
            </button>
          ))}
        </div>

        {/* Features */}
        <div className="flex items-center gap-2 flex-wrap">
          <span className="text-xs font-medium flex-shrink-0" style={{ color: 'var(--text-faint)' }}>
            Has
          </span>
          {FEATURES.map((f) => {
            const active = filters[f.key] === true;
            return (
              <button
                key={f.key}
                onClick={() => update({ [f.key]: active ? null : true })}
                className="px-2.5 py-1 rounded-lg text-xs font-medium transition-all"
                style={{
                  background: active ? 'rgba(52,211,153,0.12)' : 'var(--bg-surface)',
                  color: active ? '#34d399' : 'var(--text-muted)',
                  border: `1px solid ${active ? 'rgba(52,211,153,0.3)' : 'var(--border)'}`,
                }}
              >
                {f.label}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
