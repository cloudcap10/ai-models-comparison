import Link from 'next/link';
import Image from 'next/image';
import type { AIModel } from '@/types/model';
import { formatPrice, getProviderColor } from '@/lib/utils';

interface RelatedModelsProps {
  current: AIModel;
  all: AIModel[];
}

export default function RelatedModels({ current, all }: RelatedModelsProps) {
  const related = all
    .filter((m) => m.id !== current.id)
    .map((m) => ({
      model: m,
      score:
        (m.provider === current.provider ? 3 : 0) +
        (m.tier === current.tier ? 2 : 0) +
        (Math.abs(m.inputPricePer1M - current.inputPricePer1M) < 2 ? 1 : 0),
    }))
    .sort((a, b) => b.score - a.score)
    .slice(0, 4)
    .map((r) => r.model);

  if (related.length === 0) return null;

  return (
    <nav aria-label="Related models" className="mt-8">
      <h2 className="text-lg font-semibold mb-4" style={{ color: 'var(--text)' }}>
        Compare similar models
      </h2>
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {related.map((m) => (
          <Link
            key={m.id}
            href={`/model/${m.id}`}
            className="rounded-xl p-4 flex flex-col gap-2 transition-all"
            style={{ background: 'var(--bg-card)', border: '1px solid var(--border-subtle)' }}
          >
            <div className="flex items-center gap-2">
              <Image src={m.icon} alt={m.provider} width={18} height={18} unoptimized />
              <span className="text-xs font-medium truncate" style={{ color: 'var(--text)' }}>
                {m.name}
              </span>
            </div>
            <div className="text-xs" style={{ color: getProviderColor(m.provider) }}>
              {m.provider}
            </div>
            <div className="text-xs" style={{ color: 'var(--text-muted)' }}>
              {formatPrice(m.inputPricePer1M)} / 1M in
            </div>
          </Link>
        ))}
      </div>
    </nav>
  );
}
