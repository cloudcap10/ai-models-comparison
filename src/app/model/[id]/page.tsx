import { notFound } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import {
  ArrowLeft,
  ExternalLink,
  Check,
  X,
  BookOpen,
  DollarSign,
  Cpu,
  Zap,
  Globe,
  Calendar,
} from 'lucide-react';
import { loadModels, getModelById } from '@/lib/data';
import { formatContextWindow, formatPrice, getProviderColor } from '@/lib/utils';
import type { AIModel } from '@/types/model';

export async function generateStaticParams() {
  const models = loadModels();
  return models.map((m) => ({ id: m.id }));
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div
      className="rounded-2xl p-6"
      style={{ background: 'var(--bg-card)', border: '1px solid var(--border-subtle)' }}
    >
      <h3 className="text-sm font-semibold mb-4 uppercase tracking-widest" style={{ color: 'var(--text-faint)' }}>
        {title}
      </h3>
      {children}
    </div>
  );
}

function Metric({ label, value, color }: { label: string; value: string; color?: string }) {
  return (
    <div className="flex items-center justify-between py-2.5" style={{ borderBottom: '1px solid var(--border-subtle)' }}>
      <span className="text-sm" style={{ color: 'var(--text-muted)' }}>{label}</span>
      <span className="text-sm font-semibold" style={{ color: color ?? 'var(--text)' }}>{value}</span>
    </div>
  );
}

function BoolMetric({ label, value }: { label: string; value: boolean }) {
  return (
    <div className="flex items-center justify-between py-2.5" style={{ borderBottom: '1px solid var(--border-subtle)' }}>
      <span className="text-sm" style={{ color: 'var(--text-muted)' }}>{label}</span>
      {value ? (
        <span className="flex items-center gap-1 text-xs font-medium" style={{ color: '#34d399' }}>
          <Check size={12} /> Yes
        </span>
      ) : (
        <span className="flex items-center gap-1 text-xs font-medium" style={{ color: 'var(--text-faint)' }}>
          <X size={12} /> No
        </span>
      )}
    </div>
  );
}

function CapabilityBar({ label, value }: { label: string; value: number }) {
  return (
    <div className="mb-4">
      <div className="flex items-center justify-between mb-1.5">
        <span className="text-sm" style={{ color: 'var(--text-muted)' }}>{label}</span>
        <span className="text-xs font-semibold" style={{ color: 'var(--text)' }}>{value}/5</span>
      </div>
      <div className="h-2 rounded-full overflow-hidden" style={{ background: 'var(--border)' }}>
        <div
          className="h-full rounded-full transition-all"
          style={{
            width: `${(value / 5) * 100}%`,
            background: 'linear-gradient(90deg, var(--accent-dim), var(--accent))',
          }}
        />
      </div>
    </div>
  );
}

const TIER_STYLES: Record<string, { bg: string; text: string }> = {
  frontier: { bg: 'rgba(124,106,255,0.15)', text: '#a78bfa' },
  standard: { bg: 'rgba(99,179,237,0.15)', text: '#63b3ed' },
  lite: { bg: 'rgba(52,211,153,0.15)', text: '#34d399' },
};

export default async function ModelPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const model = getModelById(id);
  if (!model) notFound();

  const providerColor = getProviderColor(model.provider);
  const tierStyle = TIER_STYLES[model.tier] ?? TIER_STYLES.standard;

  return (
    <div className="max-w-5xl mx-auto px-4 py-10">
      {/* Back */}
      <Link
        href="/"
        className="inline-flex items-center gap-2 text-sm mb-8 transition-colors"
        style={{ color: 'var(--text-muted)' }}
      >
        <ArrowLeft size={15} />
        All models
      </Link>

      {/* Header */}
      <div
        className="rounded-2xl p-6 mb-6"
        style={{ background: 'var(--bg-card)', border: '1px solid var(--border-subtle)' }}
      >
        <div className="flex items-start gap-4 flex-wrap">
          <div
            className="w-16 h-16 rounded-2xl flex items-center justify-center flex-shrink-0"
            style={{ background: 'var(--bg-surface)', border: '1px solid var(--border)' }}
          >
            <Image src={model.icon} alt={model.provider} width={36} height={36} unoptimized />
          </div>
          <div className="flex-1">
            <div className="flex items-center gap-3 flex-wrap mb-1">
              <h1 className="text-2xl font-bold" style={{ color: 'var(--text)' }}>
                {model.name}
              </h1>
              <span
                className="pill"
                style={{ background: tierStyle.bg, color: tierStyle.text }}
              >
                {model.tier}
              </span>
              {model.openSource && (
                <span
                  className="pill"
                  style={{ background: 'rgba(52,211,153,0.12)', color: '#34d399' }}
                >
                  Open Source
                </span>
              )}
            </div>
            <p className="text-sm mb-3" style={{ color: providerColor }}>
              {model.provider}
            </p>
            <p className="text-sm leading-relaxed" style={{ color: 'var(--text-muted)' }}>
              {model.description}
            </p>
          </div>
          <a
            href={model.link}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-all flex-shrink-0"
            style={{
              background: 'var(--bg-surface)',
              border: '1px solid var(--border)',
              color: 'var(--text-muted)',
            }}
          >
            <ExternalLink size={14} />
            Official page
          </a>
        </div>

        {/* Tags */}
        <div className="flex flex-wrap gap-2 mt-4">
          {model.tags.map((tag) => (
            <span key={tag} className="feature-tag">{tag}</span>
          ))}
        </div>
      </div>

      {/* Quick stats strip */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6">
        {[
          { icon: <Cpu size={16} />, label: 'Context', value: formatContextWindow(model.contextWindow), color: 'var(--blue)' },
          { icon: <DollarSign size={16} />, label: 'Input / 1M', value: formatPrice(model.inputPricePer1M), color: 'var(--green)' },
          { icon: <DollarSign size={16} />, label: 'Output / 1M', value: formatPrice(model.outputPricePer1M), color: 'var(--yellow)' },
          { icon: <Calendar size={16} />, label: 'Knowledge cutoff', value: model.knowledgeCutoff, color: 'var(--text)' },
        ].map((stat) => (
          <div
            key={stat.label}
            className="rounded-xl p-4"
            style={{ background: 'var(--bg-card)', border: '1px solid var(--border-subtle)' }}
          >
            <div className="flex items-center gap-2 mb-1" style={{ color: 'var(--text-faint)' }}>
              {stat.icon}
              <span className="text-xs">{stat.label}</span>
            </div>
            <div className="text-lg font-bold" style={{ color: stat.color }}>
              {stat.value}
            </div>
          </div>
        ))}
      </div>

      {/* Main grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Capabilities */}
        <Section title="Capabilities">
          <CapabilityBar label="Code" value={model.codeCapability} />
          <CapabilityBar label="Reasoning" value={model.reasoningCapability} />
          <CapabilityBar label="Multilingual" value={model.multilingualCapability} />
          <CapabilityBar label="Safety" value={model.safetyRating} />
          <CapabilityBar label="Speed" value={model.speedRating} />
        </Section>

        {/* Modalities */}
        <Section title="Modalities & Features">
          <BoolMetric label="Vision (image input)" value={model.vision} />
          <BoolMetric label="Audio" value={model.audio} />
          <BoolMetric label="Video" value={model.video} />
          <BoolMetric label="Function / tool calling" value={model.functionCalling} />
          <BoolMetric label="JSON mode" value={model.jsonMode} />
          <BoolMetric label="Extended thinking" value={model.extendedThinking} />
        </Section>

        {/* Context & output */}
        <Section title="Context & Output">
          <Metric label="Context window" value={formatContextWindow(model.contextWindow)} />
          <Metric label="Max output tokens" value={formatContextWindow(model.maxOutput)} />
          <Metric label="Knowledge cutoff" value={model.knowledgeCutoff} />
          <Metric label="Release date" value={model.releaseDate} />
        </Section>

        {/* API features */}
        <Section title="API & Access">
          <BoolMetric label="Open source" value={model.openSource} />
          <BoolMetric label="Streaming" value={model.streaming} />
          <BoolMetric label="Batch API" value={model.batchAPI} />
          <BoolMetric label="Prompt caching" value={model.promptCaching} />
          <BoolMetric label="Fine-tuning" value={model.fineTuning} />
        </Section>

        {/* Pricing */}
        <Section title="Pricing (per 1M tokens)">
          <Metric label="Input" value={formatPrice(model.inputPricePer1M)} color="var(--green)" />
          <Metric label="Output" value={formatPrice(model.outputPricePer1M)} color="var(--yellow)" />
          <div
            className="mt-3 p-3 rounded-lg text-xs"
            style={{ background: 'var(--bg-surface)', color: 'var(--text-faint)' }}
          >
            Prices shown are list prices and may vary by provider plan. Always check the official
            documentation for the latest pricing.
          </div>
        </Section>
      </div>
    </div>
  );
}
