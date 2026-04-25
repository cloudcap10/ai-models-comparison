'use client';

import { useState } from 'react';
import { Search, SlidersHorizontal, X } from 'lucide-react';

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

export default function FilterBar({ providers, filters, onChange }: FilterBarProps) {
  const [showFilters, setShowFilters] = useState(false);

  const update = (partial: Partial<Filters>) => onChange({ ...filters, ...partial });

  const activeFilterCount = [
    filters.provider !== '',
    filters.tier !== '',
    filters.openSource !== null,
    filters.vision !== null,
    filters.thinking !== null,
  ].filter(Boolean).length;

  const clearAll = () =>
    onChange({
      search: '',
      provider: '',
      tier: '',
      openSource: null,
      vision: null,
      thinking: null,
      sortKey: 'name',
      sortDir: 'asc',
    });

  return (
    <div
      className="rounded-2xl p-4 mb-6"
      style={{ background: 'var(--bg-card)', border: '1px solid var(--border-subtle)' }}
    >
      {/* Search + controls row */}
      <div className="flex gap-3 flex-wrap">
        {/* Search */}
        <div className="flex-1 min-w-[200px] relative">
          <Search
            size={15}
            className="absolute left-3 top-1/2 -translate-y-1/2"
            style={{ color: 'var(--text-faint)' }}
          />
          <input
            type="text"
            placeholder="Search models…"
            value={filters.search}
            onChange={(e) => update({ search: e.target.value })}
            className="w-full pl-9 pr-4 py-2 rounded-lg text-sm outline-none transition-colors"
            style={{
              background: 'var(--bg-surface)',
              border: '1px solid var(--border-subtle)',
              color: 'var(--text)',
            }}
          />
        </div>

        {/* Sort */}
        <div className="flex items-center gap-2">
          <span className="text-xs" style={{ color: 'var(--text-faint)' }}>
            Sort
          </span>
          <select
            value={filters.sortKey}
            onChange={(e) => update({ sortKey: e.target.value as SortKey })}
            className="text-sm rounded-lg px-3 py-2 outline-none cursor-pointer"
            style={{
              background: 'var(--bg-surface)',
              border: '1px solid var(--border-subtle)',
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
            className="px-3 py-2 rounded-lg text-sm transition-colors"
            style={{
              background: 'var(--bg-surface)',
              border: '1px solid var(--border-subtle)',
              color: 'var(--text-muted)',
            }}
          >
            {filters.sortDir === 'asc' ? '↑' : '↓'}
          </button>
        </div>

        {/* Filter toggle */}
        <button
          onClick={() => setShowFilters((s) => !s)}
          className="flex items-center gap-2 px-3 py-2 rounded-lg text-sm transition-colors"
          style={{
            background: showFilters ? 'var(--accent-glow)' : 'var(--bg-surface)',
            border: `1px solid ${showFilters ? 'var(--accent-dim)' : 'var(--border-subtle)'}`,
            color: showFilters ? 'var(--accent)' : 'var(--text-muted)',
          }}
        >
          <SlidersHorizontal size={14} />
          Filters
          {activeFilterCount > 0 && (
            <span
              className="w-5 h-5 rounded-full flex items-center justify-center text-xs font-bold"
              style={{ background: 'var(--accent)', color: '#fff' }}
            >
              {activeFilterCount}
            </span>
          )}
        </button>

        {activeFilterCount > 0 && (
          <button
            onClick={clearAll}
            className="flex items-center gap-1 px-3 py-2 rounded-lg text-xs transition-colors"
            style={{
              background: 'rgba(245,101,101,0.1)',
              border: '1px solid rgba(245,101,101,0.2)',
              color: '#f56565',
            }}
          >
            <X size={12} />
            Clear
          </button>
        )}
      </div>

      {/* Expanded filters */}
      {showFilters && (
        <div className="mt-4 pt-4 flex flex-wrap gap-4" style={{ borderTop: '1px solid var(--border-subtle)' }}>
          {/* Provider */}
          <div>
            <label className="block text-xs mb-2" style={{ color: 'var(--text-faint)' }}>
              Provider
            </label>
            <div className="flex flex-wrap gap-2">
              {['', ...providers].map((p) => (
                <button
                  key={p || 'all'}
                  onClick={() => update({ provider: p })}
                  className="px-3 py-1 rounded-lg text-xs font-medium transition-all"
                  style={{
                    background: filters.provider === p ? 'var(--accent)' : 'var(--bg-surface)',
                    color: filters.provider === p ? '#fff' : 'var(--text-muted)',
                    border: `1px solid ${filters.provider === p ? 'var(--accent)' : 'var(--border-subtle)'}`,
                  }}
                >
                  {p || 'All'}
                </button>
              ))}
            </div>
          </div>

          {/* Tier */}
          <div>
            <label className="block text-xs mb-2" style={{ color: 'var(--text-faint)' }}>
              Tier
            </label>
            <div className="flex flex-wrap gap-2">
              {[
                { key: '', label: 'All' },
                { key: 'frontier', label: 'Frontier' },
                { key: 'standard', label: 'Standard' },
                { key: 'lite', label: 'Lite' },
              ].map((t) => (
                <button
                  key={t.key}
                  onClick={() => update({ tier: t.key })}
                  className="px-3 py-1 rounded-lg text-xs font-medium transition-all"
                  style={{
                    background: filters.tier === t.key ? 'var(--accent)' : 'var(--bg-surface)',
                    color: filters.tier === t.key ? '#fff' : 'var(--text-muted)',
                    border: `1px solid ${filters.tier === t.key ? 'var(--accent)' : 'var(--border-subtle)'}`,
                  }}
                >
                  {t.label}
                </button>
              ))}
            </div>
          </div>

          {/* Boolean toggles */}
          <div>
            <label className="block text-xs mb-2" style={{ color: 'var(--text-faint)' }}>
              Features
            </label>
            <div className="flex flex-wrap gap-2">
              {[
                {
                  key: 'openSource' as const,
                  label: 'Open Source',
                  value: filters.openSource,
                },
                { key: 'vision' as const, label: 'Vision', value: filters.vision },
                { key: 'thinking' as const, label: 'Thinking', value: filters.thinking },
              ].map((f) => (
                <button
                  key={f.key}
                  onClick={() => update({ [f.key]: f.value === true ? null : true })}
                  className="px-3 py-1 rounded-lg text-xs font-medium transition-all"
                  style={{
                    background: f.value === true ? 'rgba(52,211,153,0.15)' : 'var(--bg-surface)',
                    color: f.value === true ? '#34d399' : 'var(--text-muted)',
                    border: `1px solid ${f.value === true ? 'rgba(52,211,153,0.3)' : 'var(--border-subtle)'}`,
                  }}
                >
                  {f.label}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
