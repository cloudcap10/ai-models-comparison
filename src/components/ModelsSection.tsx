'use client';

import { useState, useMemo } from 'react';
import { LayoutGrid, Table2 } from 'lucide-react';
import type { AIModel } from '@/types/model';
import ModelCard from './ModelCard';
import ComparisonTable from './ComparisonTable';
import FilterBar, { type Filters, type SortKey } from './FilterBar';

interface ModelsSectionProps {
  models: AIModel[];
}

const DEFAULT_FILTERS: Filters = {
  search: '',
  provider: '',
  tier: '',
  openSource: null,
  vision: null,
  thinking: null,
  sortKey: 'name',
  sortDir: 'asc',
};

export default function ModelsSection({ models }: ModelsSectionProps) {
  const [view, setView] = useState<'grid' | 'table'>('grid');
  const [filters, setFilters] = useState<Filters>(DEFAULT_FILTERS);

  const providers = useMemo(
    () => [...new Set(models.map((m) => m.provider))].sort(),
    [models],
  );

  const filtered = useMemo(() => {
    let result = models.filter((m) => {
      if (
        filters.search &&
        !m.name.toLowerCase().includes(filters.search.toLowerCase()) &&
        !m.provider.toLowerCase().includes(filters.search.toLowerCase()) &&
        !m.tags.some((t) => t.toLowerCase().includes(filters.search.toLowerCase()))
      )
        return false;
      if (filters.provider && m.provider !== filters.provider) return false;
      if (filters.tier && m.tier !== filters.tier) return false;
      if (filters.openSource !== null && m.openSource !== filters.openSource) return false;
      if (filters.vision !== null && m.vision !== filters.vision) return false;
      if (filters.thinking !== null && m.extendedThinking !== filters.thinking) return false;
      return true;
    });

    result = result.sort((a, b) => {
      const key = filters.sortKey as keyof AIModel;
      const av = a[key];
      const bv = b[key];
      if (av === undefined || bv === undefined) return 0;
      const cmp =
        typeof av === 'number' && typeof bv === 'number'
          ? av - bv
          : String(av).localeCompare(String(bv));
      return filters.sortDir === 'asc' ? cmp : -cmp;
    });

    return result;
  }, [models, filters]);

  return (
    <section id="models" className="px-4 pb-20">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-2xl font-bold" style={{ color: 'var(--text)' }}>
              Models
            </h2>
            <p className="text-sm mt-1" style={{ color: 'var(--text-muted)' }}>
              {filtered.length} of {models.length} models
            </p>
          </div>
          {/* View toggle */}
          <div
            className="flex rounded-xl p-1 gap-1"
            style={{ background: 'var(--bg-card)', border: '1px solid var(--border-subtle)' }}
          >
            {[
              { key: 'grid' as const, icon: <LayoutGrid size={15} /> },
              { key: 'table' as const, icon: <Table2 size={15} /> },
            ].map((v) => (
              <button
                key={v.key}
                onClick={() => setView(v.key)}
                className="p-2 rounded-lg transition-all"
                style={{
                  background: view === v.key ? 'var(--accent)' : 'transparent',
                  color: view === v.key ? '#fff' : 'var(--text-muted)',
                }}
              >
                {v.icon}
              </button>
            ))}
          </div>
        </div>

        <FilterBar providers={providers} filters={filters} onChange={setFilters} />

        {view === 'grid' ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4" id="table">
            {filtered.map((model, i) => (
              <ModelCard key={model.id} model={model} index={i} />
            ))}
            {filtered.length === 0 && (
              <div
                className="col-span-full py-20 text-center rounded-2xl"
                style={{
                  background: 'var(--bg-card)',
                  border: '1px solid var(--border-subtle)',
                  color: 'var(--text-muted)',
                }}
              >
                No models match your filters.
              </div>
            )}
          </div>
        ) : (
          <div id="table">
            <ComparisonTable models={filtered} />
          </div>
        )}
      </div>
    </section>
  );
}
