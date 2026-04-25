'use client';

import { motion } from 'framer-motion';
import Image from 'next/image';
import Link from 'next/link';
import { ExternalLink, Zap, Eye, Cpu, DollarSign } from 'lucide-react';
import type { AIModel } from '@/types/model';
import { formatContextWindow, formatPrice, getProviderColor, formatConsumerPlan } from '@/lib/utils';

interface ModelCardProps {
  model: AIModel;
  index: number;
}

const TIER_STYLES: Record<string, { bg: string; text: string; label: string }> = {
  frontier: { bg: 'rgba(124,106,255,0.15)', text: '#a78bfa', label: 'Frontier' },
  standard: { bg: 'rgba(99,179,237,0.15)', text: '#63b3ed', label: 'Standard' },
  lite: { bg: 'rgba(52,211,153,0.15)', text: '#34d399', label: 'Lite' },
};

function StarRating({ value }: { value: number }) {
  return (
    <div className="flex gap-0.5">
      {[1, 2, 3, 4, 5].map((i) => (
        <div
          key={i}
          className="w-2 h-2 rounded-full"
          style={{
            background: i <= value ? 'var(--accent)' : 'var(--border)',
          }}
        />
      ))}
    </div>
  );
}

function FeaturePill({
  active,
  label,
  icon,
}: {
  active: boolean;
  label: string;
  icon: React.ReactNode;
}) {
  return (
    <div
      className="flex items-center gap-1 px-2 py-1 rounded-md text-xs font-medium"
      style={{
        background: active ? 'rgba(52,211,153,0.1)' : 'var(--bg-surface)',
        color: active ? '#34d399' : 'var(--text-faint)',
        border: `1px solid ${active ? 'rgba(52,211,153,0.2)' : 'var(--border-subtle)'}`,
      }}
    >
      {icon}
      {label}
    </div>
  );
}

export default function ModelCard({ model, index }: ModelCardProps) {
  const tierStyle = TIER_STYLES[model.tier] ?? TIER_STYLES.standard;
  const providerColor = getProviderColor(model.provider);
  const consumerPlan = formatConsumerPlan(model.consumerPlanName, model.consumerPlanPricePerMonth);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, delay: index * 0.04 }}
    >
      <Link href={`/model/${model.id}`} className="block h-full">
        <div
          className="card-glow h-full rounded-2xl p-5 transition-all duration-200 cursor-pointer"
          style={{
            background: 'var(--bg-card)',
            border: '1px solid var(--border-subtle)',
          }}
        >
          {/* Header */}
          <div className="flex items-start justify-between mb-4">
            <div className="flex items-center gap-3">
              <div
                className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0"
                style={{ background: 'var(--bg-surface)', border: '1px solid var(--border)' }}
              >
                <Image
                  src={model.icon}
                  alt={model.provider}
                  width={22}
                  height={22}
                  style={{ filter: 'brightness(1.2)' }}
                  unoptimized
                />
              </div>
              <div>
                <h3 className="font-semibold text-sm leading-tight" style={{ color: 'var(--text)' }}>
                  {model.name}
                </h3>
                <p className="text-xs mt-0.5" style={{ color: providerColor, opacity: 0.9 }}>
                  {model.provider}
                </p>
              </div>
            </div>
            <span
              className="pill flex-shrink-0"
              style={{ background: tierStyle.bg, color: tierStyle.text }}
            >
              {tierStyle.label}
            </span>
          </div>

          {/* Description */}
          <p
            className="text-xs leading-relaxed mb-4 line-clamp-2"
            style={{ color: 'var(--text-muted)' }}
          >
            {model.description}
          </p>

          {/* Key metrics */}
          <div className="grid grid-cols-2 gap-2 mb-4">
            <div
              className="rounded-lg p-2.5"
              style={{ background: 'var(--bg-surface)', border: '1px solid var(--border-subtle)' }}
            >
              <div className="flex items-center gap-1.5 mb-1">
                <Cpu size={11} style={{ color: 'var(--text-faint)' }} />
                <span className="text-xs" style={{ color: 'var(--text-faint)' }}>
                  Context
                </span>
              </div>
              <div className="text-sm font-semibold" style={{ color: 'var(--text)' }}>
                {formatContextWindow(model.contextWindow)}
              </div>
            </div>
            <div
              className="rounded-lg p-2.5"
              style={{ background: 'var(--bg-surface)', border: '1px solid var(--border-subtle)' }}
            >
              <div className="flex items-center gap-1.5 mb-1">
                <DollarSign size={11} style={{ color: 'var(--text-faint)' }} />
                <span className="text-xs" style={{ color: 'var(--text-faint)' }}>
                  {consumerPlan ? 'Monthly plan' : 'Input / 1M'}
                </span>
              </div>
              <div
                className="text-sm font-semibold"
                style={{ color: consumerPlan ? (consumerPlan.badge === 'Free' ? '#34d399' : '#a78bfa') : 'var(--text)' }}
              >
                {consumerPlan ? consumerPlan.badge : formatPrice(model.inputPricePer1M)}
              </div>
            </div>
          </div>

          {/* Capabilities */}
          <div className="space-y-2 mb-4">
            <div className="flex items-center justify-between">
              <span className="text-xs" style={{ color: 'var(--text-faint)' }}>
                Reasoning
              </span>
              <StarRating value={model.reasoningCapability} />
            </div>
            <div className="flex items-center justify-between">
              <span className="text-xs" style={{ color: 'var(--text-faint)' }}>
                Code
              </span>
              <StarRating value={model.codeCapability} />
            </div>
            <div className="flex items-center justify-between">
              <span className="text-xs" style={{ color: 'var(--text-faint)' }}>
                Speed
              </span>
              <StarRating value={model.speedRating} />
            </div>
          </div>

          {/* Feature pills */}
          <div className="flex flex-wrap gap-1.5">
            <FeaturePill active={model.openSource} label="Open Source" icon={<span>⟡</span>} />
            <FeaturePill active={model.vision} label="Vision" icon={<Eye size={10} />} />
            <FeaturePill
              active={model.extendedThinking}
              label="Thinking"
              icon={<Zap size={10} />}
            />
          </div>

          {/* Tags */}
          {model.tags.length > 0 && (
            <div className="flex flex-wrap gap-1 mt-3">
              {model.tags.slice(0, 3).map((tag) => (
                <span
                  key={tag}
                  className="text-xs px-2 py-0.5 rounded-full"
                  style={{
                    background: 'var(--bg-surface)',
                    color: 'var(--text-faint)',
                    border: '1px solid var(--border-subtle)',
                  }}
                >
                  {tag}
                </span>
              ))}
            </div>
          )}

          {/* View link indicator */}
          <div
            className="flex items-center gap-1 mt-4 text-xs font-medium"
            style={{ color: 'var(--accent)' }}
          >
            View details
            <ExternalLink size={11} />
          </div>
        </div>
      </Link>
    </motion.div>
  );
}
