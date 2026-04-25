'use client';

import { motion } from 'framer-motion';
import Image from 'next/image';
import Link from 'next/link';
import { Eye, Zap, Code2, ArrowRight } from 'lucide-react';
import type { AIModel } from '@/types/model';
import { formatContextWindow, formatPrice, getProviderColor, formatConsumerPlan, isNewModel } from '@/lib/utils';

interface ModelCardProps {
  model: AIModel;
  index: number;
}

const TIER_STYLES: Record<string, { bg: string; text: string; label: string }> = {
  frontier: { bg: 'rgba(167,139,250,0.12)', text: '#a78bfa', label: 'Frontier' },
  standard: { bg: 'rgba(99,179,237,0.12)', text: '#63b3ed', label: 'Standard' },
  lite: { bg: 'rgba(52,211,153,0.12)', text: '#34d399', label: 'Lite' },
};

function DotBar({ value, color = 'var(--accent)' }: { value: number; color?: string }) {
  return (
    <div className="flex gap-1">
      {[1, 2, 3, 4, 5].map((i) => (
        <div
          key={i}
          className="w-1.5 h-1.5 rounded-full"
          style={{ background: i <= value ? color : 'var(--border)' }}
        />
      ))}
    </div>
  );
}

export default function ModelCard({ model, index }: ModelCardProps) {
  const tierStyle = TIER_STYLES[model.tier] ?? TIER_STYLES.standard;
  const providerColor = getProviderColor(model.provider);
  const consumerPlan = formatConsumerPlan(model.consumerPlanName, model.consumerPlanPricePerMonth);
  const isNew = isNewModel(model.releaseDate);

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: index * 0.03 }}
      className="h-full"
    >
      <Link href={`/model/${model.id}`} className="block h-full">
        <div
          className="card-glow h-full rounded-2xl flex flex-col transition-all duration-200 cursor-pointer overflow-hidden"
          style={{
            background: 'var(--bg-card)',
            border: '1px solid var(--border)',
          }}
        >
          {/* Header */}
          <div className="p-5 pb-4">
            <div className="flex items-start justify-between gap-3 mb-3">
              <div className="flex items-center gap-3 min-w-0">
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
                <div className="min-w-0">
                  <div className="flex items-center gap-1.5 flex-wrap">
                    <h3
                      className="font-bold text-sm leading-tight truncate"
                      style={{ color: 'var(--text)' }}
                    >
                      {model.name}
                    </h3>
                    {isNew && (
                      <span
                        className="flex-shrink-0 text-xs font-bold px-1.5 py-0.5 rounded-md"
                        style={{
                          background: 'rgba(34,211,160,0.15)',
                          color: '#22d3a0',
                          border: '1px solid rgba(34,211,160,0.3)',
                          fontSize: '0.6rem',
                          letterSpacing: '0.06em',
                        }}
                      >
                        NEW
                      </span>
                    )}
                  </div>
                  <p className="text-xs mt-0.5" style={{ color: providerColor }}>
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

            <p
              className="text-xs leading-relaxed line-clamp-2"
              style={{ color: 'var(--text-muted)' }}
            >
              {model.description}
            </p>
          </div>

          {/* Stats — 3 equal boxes */}
          <div
            className="grid grid-cols-3 divide-x mx-5 mb-4 rounded-xl overflow-hidden"
            style={{
              border: '1px solid var(--border)',
              ['--divide-color' as string]: 'var(--border)',
            }}
          >
            <div className="p-3 text-center" style={{ background: 'var(--bg-surface)' }}>
              <div className="text-xs mb-1" style={{ color: 'var(--text-faint)' }}>
                Context
              </div>
              <div className="text-sm font-bold" style={{ color: 'var(--blue)' }}>
                {formatContextWindow(model.contextWindow)}
              </div>
            </div>
            <div className="p-3 text-center" style={{ background: 'var(--bg-surface)' }}>
              <div className="text-xs mb-1" style={{ color: 'var(--text-faint)' }}>
                API /1M
              </div>
              <div className="text-sm font-bold" style={{ color: 'var(--green)' }}>
                {formatPrice(model.inputPricePer1M)}
              </div>
            </div>
            <div className="p-3 text-center" style={{ background: 'var(--bg-surface)' }}>
              <div className="text-xs mb-1" style={{ color: 'var(--text-faint)' }}>
                Monthly
              </div>
              <div
                className="text-sm font-bold"
                style={{
                  color: consumerPlan
                    ? consumerPlan.badge === 'Free'
                      ? '#34d399'
                      : '#a78bfa'
                    : 'var(--text-faint)',
                }}
              >
                {consumerPlan ? consumerPlan.badge : '—'}
              </div>
            </div>
          </div>

          {/* Capabilities */}
          <div className="px-5 mb-4 space-y-2.5">
            {[
              { label: 'Code', value: model.codeCapability, icon: <Code2 size={11} /> },
              { label: 'Reasoning', value: model.reasoningCapability, icon: <Zap size={11} /> },
              { label: 'Speed', value: model.speedRating, icon: <ArrowRight size={11} /> },
            ].map((cap) => (
              <div key={cap.label} className="flex items-center justify-between">
                <div
                  className="flex items-center gap-1.5 text-xs w-20"
                  style={{ color: 'var(--text-faint)' }}
                >
                  {cap.icon}
                  {cap.label}
                </div>
                <DotBar value={cap.value} />
              </div>
            ))}
          </div>

          {/* Feature badges */}
          <div
            className="mt-auto px-5 py-3 flex items-center justify-between"
            style={{ borderTop: '1px solid var(--border-subtle)' }}
          >
            <div className="flex gap-2">
              {model.vision && (
                <span
                  className="flex items-center gap-1 text-xs px-2 py-0.5 rounded-md font-medium"
                  style={{
                    background: 'rgba(99,179,237,0.1)',
                    color: '#63b3ed',
                    border: '1px solid rgba(99,179,237,0.2)',
                  }}
                >
                  <Eye size={10} /> Vision
                </span>
              )}
              {model.extendedThinking && (
                <span
                  className="flex items-center gap-1 text-xs px-2 py-0.5 rounded-md font-medium"
                  style={{
                    background: 'rgba(124,106,255,0.1)',
                    color: '#a78bfa',
                    border: '1px solid rgba(124,106,255,0.2)',
                  }}
                >
                  <Zap size={10} /> Thinking
                </span>
              )}
              {model.openSource && (
                <span
                  className="flex items-center gap-1 text-xs px-2 py-0.5 rounded-md font-medium"
                  style={{
                    background: 'rgba(52,211,153,0.1)',
                    color: '#34d399',
                    border: '1px solid rgba(52,211,153,0.2)',
                  }}
                >
                  Open
                </span>
              )}
            </div>
            <span className="text-xs font-medium" style={{ color: 'var(--accent)' }}>
              Details →
            </span>
          </div>
        </div>
      </Link>
    </motion.div>
  );
}
