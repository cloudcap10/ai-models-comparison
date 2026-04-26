'use client';

import { useState, useMemo } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import type { AIModel } from '@/types/model';
import { getProviderColor } from '@/lib/utils';
import { Slider } from '@/components/ui/slider';

interface Props {
  models: AIModel[];
}

const PRESETS = [
  {
    label: 'Personal',
    sub: '50 msg/day',
    messagesPerDay: 50,
    inputTokens: 250,
    outputTokens: 600,
  },
  {
    label: 'Developer',
    sub: '500 msg/day',
    messagesPerDay: 500,
    inputTokens: 500,
    outputTokens: 1200,
  },
  {
    label: 'Startup',
    sub: '5K msg/day',
    messagesPerDay: 5000,
    inputTokens: 600,
    outputTokens: 1500,
  },
  {
    label: 'Scale',
    sub: '50K msg/day',
    messagesPerDay: 50000,
    inputTokens: 600,
    outputTokens: 1500,
  },
];

// Map a 0-100 slider position to a log-scaled messages/day value
const LOG_MIN = Math.log10(1);
const LOG_MAX = Math.log10(500_000);

function sliderToMsgs(pos: number) {
  return Math.round(Math.pow(10, LOG_MIN + (pos / 100) * (LOG_MAX - LOG_MIN)));
}

function msgsToSlider(msgs: number) {
  return Math.round(((Math.log10(Math.max(1, msgs)) - LOG_MIN) / (LOG_MAX - LOG_MIN)) * 100);
}

function formatCost(n: number) {
  if (n === 0) return '$0.00';
  if (n < 0.01) return '<$0.01';
  if (n < 1) return `$${n.toFixed(3)}`;
  if (n < 10_000) return `$${n.toFixed(2)}`;
  return `$${(n / 1000).toFixed(1)}K`;
}

function formatPerMsg(n: number) {
  if (n < 0.000001) return '<$0.000001';
  if (n < 0.0001) return `$${n.toFixed(6)}`;
  if (n < 0.01) return `$${n.toFixed(4)}`;
  return `$${n.toFixed(4)}`;
}

function rankColor(index: number, total: number) {
  const pct = index / Math.max(1, total - 1);
  if (pct < 0.3) return '#22d3a0';
  if (pct < 0.6) return '#f6ad55';
  return '#f56565';
}

interface SliderRowProps {
  label: string;
  hint: string;
  value: number;
  min: number;
  max: number;
  step: number;
  display: string;
  onChange: (v: number) => void;
}

function SliderRow({ label, hint, value, min, max, step, display, onChange }: SliderRowProps) {
  return (
    <div>
      <div className="flex items-baseline justify-between mb-3">
        <span className="text-sm font-medium" style={{ color: 'var(--text)' }}>
          {label}
        </span>
        <div className="flex items-baseline gap-2">
          <span className="text-base font-bold" style={{ color: 'var(--accent)' }}>
            {display}
          </span>
          <span className="text-xs" style={{ color: 'var(--text-faint)' }}>
            {hint}
          </span>
        </div>
      </div>
      <Slider
        min={min}
        max={max}
        step={step}
        value={[value]}
        onValueChange={(vals) => onChange((vals as number[])[0])}
        aria-label={label}
        className="[&_[data-slot=slider-track]]:bg-[var(--border)] [&_[data-slot=slider-track]]:h-1.5 [&_[data-slot=slider-range]]:bg-[var(--accent)] [&_[data-slot=slider-thumb]]:border-[var(--accent-dim)] [&_[data-slot=slider-thumb]]:bg-[var(--accent)] [&_[data-slot=slider-thumb]]:size-4"
      />
    </div>
  );
}

export default function CostCalculator({ models }: Props) {
  const [preset, setPreset] = useState('Developer');
  const [sliderPos, setSliderPos] = useState(msgsToSlider(500));
  const [inputTokens, setInputTokens] = useState(500);
  const [outputTokens, setOutputTokens] = useState(1200);

  const messagesPerDay = sliderToMsgs(sliderPos);
  const messagesPerMonth = messagesPerDay * 30;

  function applyPreset(p: (typeof PRESETS)[number]) {
    setPreset(p.label);
    setSliderPos(msgsToSlider(p.messagesPerDay));
    setInputTokens(p.inputTokens);
    setOutputTokens(p.outputTokens);
  }

  const results = useMemo(() => {
    return models
      .map((m) => {
        const monthlyIn = (messagesPerMonth * inputTokens) / 1_000_000;
        const monthlyOut = (messagesPerMonth * outputTokens) / 1_000_000;
        const cost = monthlyIn * m.inputPricePer1M + monthlyOut * m.outputPricePer1M;
        return { model: m, cost, perMsg: cost / messagesPerMonth };
      })
      .sort((a, b) => a.cost - b.cost);
  }, [models, messagesPerMonth, inputTokens, outputTokens]);

  const cheapest = results[0];
  const mostExpensive = results[results.length - 1];
  const maxCost = mostExpensive?.cost ?? 1;
  const savings = mostExpensive && cheapest
    ? Math.round(((mostExpensive.cost - cheapest.cost) / mostExpensive.cost) * 100)
    : 0;

  return (
    <div className="space-y-8">
      {/* Preset chips */}
      <div>
        <p className="text-xs font-medium mb-3" style={{ color: 'var(--text-faint)' }}>
          Quick presets
        </p>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
          {PRESETS.map((p) => (
            <button
              key={p.label}
              onClick={() => applyPreset(p)}
              className="rounded-xl p-3 text-left transition-all"
              style={{
                background: preset === p.label ? 'var(--accent-glow)' : 'var(--bg-surface)',
                border: `1px solid ${preset === p.label ? 'var(--accent-dim)' : 'var(--border)'}`,
              }}
            >
              <div
                className="text-sm font-semibold"
                style={{ color: preset === p.label ? 'var(--accent)' : 'var(--text)' }}
              >
                {p.label}
              </div>
              <div className="text-xs mt-0.5" style={{ color: 'var(--text-faint)' }}>
                {p.sub}
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Sliders */}
      <div
        className="rounded-2xl p-6 space-y-6"
        style={{ background: 'var(--bg-card)', border: '1px solid var(--border)' }}
      >
        <SliderRow
          label="Messages per day"
          hint="adjust to your usage"
          value={sliderPos}
          min={0}
          max={100}
          step={1}
          display={messagesPerDay.toLocaleString()}
          onChange={(v) => { setSliderPos(v); setPreset(''); }}
        />
        <SliderRow
          label="Avg input tokens / message"
          hint="~500 = typical question with context"
          value={inputTokens}
          min={50}
          max={8000}
          step={50}
          display={inputTokens.toLocaleString()}
          onChange={(v) => { setInputTokens(v); setPreset(''); }}
        />
        <SliderRow
          label="Avg output tokens / message"
          hint="~1000 = medium-length response"
          value={outputTokens}
          min={50}
          max={8000}
          step={50}
          display={outputTokens.toLocaleString()}
          onChange={(v) => { setOutputTokens(v); setPreset(''); }}
        />
      </div>

      {/* Summary stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {[
          {
            label: 'Messages / month',
            value: messagesPerMonth.toLocaleString(),
            color: 'var(--text)',
          },
          {
            label: 'Input tokens / month',
            value:
              (messagesPerMonth * inputTokens) >= 1_000_000
                ? `${((messagesPerMonth * inputTokens) / 1_000_000).toFixed(1)}M`
                : `${((messagesPerMonth * inputTokens) / 1_000).toFixed(0)}K`,
            color: 'var(--blue)',
          },
          {
            label: 'Output tokens / month',
            value:
              (messagesPerMonth * outputTokens) >= 1_000_000
                ? `${((messagesPerMonth * outputTokens) / 1_000_000).toFixed(1)}M`
                : `${((messagesPerMonth * outputTokens) / 1_000).toFixed(0)}K`,
            color: 'var(--yellow)',
          },
          {
            label: `Cheapest saves up to`,
            value: `${savings}%`,
            color: '#22d3a0',
          },
        ].map((s) => (
          <div
            key={s.label}
            className="rounded-xl p-4 text-center"
            style={{ background: 'var(--bg-card)', border: '1px solid var(--border-subtle)' }}
          >
            <div className="text-xs mb-1.5" style={{ color: 'var(--text-faint)' }}>
              {s.label}
            </div>
            <div className="text-xl font-bold" style={{ color: s.color }}>
              {s.value}
            </div>
          </div>
        ))}
      </div>

      {/* Results list */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-sm font-semibold" style={{ color: 'var(--text)' }}>
            All {results.length} models ranked by monthly cost
          </h3>
          <span className="text-xs" style={{ color: 'var(--text-faint)' }}>
            Click any model for full specs →
          </span>
        </div>

        <div className="space-y-1.5">
          {results.map(({ model, cost, perMsg }, i) => {
            const barPct = Math.max(1.5, (cost / maxCost) * 100);
            const color = rankColor(i, results.length);
            return (
              <Link key={model.id} href={`/model/${model.id}`} className="block group">
                <div
                  className="rounded-xl px-4 py-3 flex items-center gap-4 transition-all duration-150"
                  style={{
                    background: 'var(--bg-card)',
                    border: '1px solid var(--border-subtle)',
                  }}
                  onMouseEnter={(e) => {
                    (e.currentTarget as HTMLDivElement).style.borderColor = color + '55';
                  }}
                  onMouseLeave={(e) => {
                    (e.currentTarget as HTMLDivElement).style.borderColor = 'var(--border-subtle)';
                  }}
                >
                  {/* Rank */}
                  <div
                    className="w-6 text-center text-xs font-bold flex-shrink-0"
                    style={{ color: i < 3 ? color : 'var(--text-faint)' }}
                  >
                    {i + 1}
                  </div>

                  {/* Icon + name */}
                  <div className="flex items-center gap-2.5 w-44 flex-shrink-0">
                    <div
                      className="w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0"
                      style={{ background: 'var(--bg-surface)', border: '1px solid var(--border)' }}
                    >
                      <Image src={model.icon} alt={model.provider} width={16} height={16} unoptimized />
                    </div>
                    <div className="min-w-0">
                      <div
                        className="text-sm font-semibold truncate group-hover:underline"
                        style={{ color: 'var(--text)' }}
                      >
                        {model.name}
                      </div>
                      <div className="text-xs truncate" style={{ color: getProviderColor(model.provider) }}>
                        {model.provider}
                      </div>
                    </div>
                  </div>

                  {/* Bar */}
                  <div
                    className="flex-1 rounded-full overflow-hidden"
                    style={{ background: 'var(--border)', height: '6px' }}
                  >
                    <div
                      className="h-full rounded-full transition-all duration-500"
                      style={{ width: `${barPct}%`, background: color }}
                    />
                  </div>

                  {/* Cost */}
                  <div className="text-right flex-shrink-0 w-32">
                    <div className="text-sm font-bold" style={{ color }}>
                      {formatCost(cost)}
                      <span className="text-xs font-normal" style={{ color: 'var(--text-faint)' }}>
                        /mo
                      </span>
                    </div>
                    <div className="text-xs" style={{ color: 'var(--text-faint)' }}>
                      {formatPerMsg(perMsg)}/msg
                    </div>
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      </div>

      {/* Disclaimer */}
      <p className="text-xs text-center" style={{ color: 'var(--text-faint)' }}>
        Estimates use list API prices. Actual costs vary with prompt caching, batch discounts, and
        provider plans. Always verify with official documentation.
      </p>
    </div>
  );
}
