'use client';

import { motion } from 'framer-motion';
import { Brain, GitFork, Sparkles, Calculator } from 'lucide-react';

interface HeroProps {
  modelCount: number;
  providerCount: number;
}

export default function Hero({ modelCount, providerCount }: HeroProps) {
  return (
    <section className="relative overflow-hidden pt-24 pb-20 px-4">
      {/* Background orbs */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div
          className="absolute top-[-200px] left-1/2 -translate-x-1/2 w-[800px] h-[600px] rounded-full opacity-20"
          style={{
            background:
              'radial-gradient(ellipse at center, rgba(124,106,255,0.4) 0%, transparent 70%)',
          }}
        />
        <div
          className="absolute bottom-[-100px] left-1/4 w-[400px] h-[400px] rounded-full opacity-10"
          style={{
            background:
              'radial-gradient(ellipse at center, rgba(96,165,250,0.5) 0%, transparent 70%)',
          }}
        />
        <div
          className="absolute top-[20%] right-[10%] w-[300px] h-[300px] rounded-full opacity-10"
          style={{
            background:
              'radial-gradient(ellipse at center, rgba(52,211,153,0.5) 0%, transparent 70%)',
          }}
        />
      </div>

      <div className="relative max-w-4xl mx-auto text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="inline-flex items-center gap-2 mb-6 px-4 py-2 rounded-full border"
          style={{
            borderColor: 'var(--border)',
            background: 'var(--bg-card)',
            color: 'var(--text-muted)',
            fontSize: '0.8rem',
          }}
        >
          <Sparkles size={14} style={{ color: 'var(--accent)' }} />
          <span>Community-maintained · Updated April 2026</span>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="flex items-center justify-center gap-4 mb-6"
        >
          <div
            className="p-3 rounded-2xl"
            style={{ background: 'var(--bg-card)', border: '1px solid var(--border)' }}
          >
            <Brain size={32} style={{ color: 'var(--accent)' }} />
          </div>
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.15 }}
          className="text-5xl sm:text-6xl font-bold tracking-tight mb-5"
          style={{ lineHeight: 1.1 }}
        >
          <span className="gradient-text">Pick</span>
          <span style={{ color: 'var(--text)' }}>Model</span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="text-lg mb-10 max-w-2xl mx-auto"
          style={{ color: 'var(--text-muted)', lineHeight: 1.7 }}
        >
          Compare <span style={{ color: 'var(--text)' }}>{modelCount} AI models</span> from{' '}
          <span style={{ color: 'var(--text)' }}>{providerCount} providers</span> — context
          windows, pricing, reasoning, speed and features, all in one place. Free and
          regularly updated.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.25 }}
          className="flex items-center justify-center gap-4 flex-wrap"
        >
          <a
            href="#models"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-xl font-semibold text-sm transition-all"
            style={{
              background: 'var(--accent)',
              color: '#fff',
            }}
            onMouseEnter={(e) => {
              (e.currentTarget as HTMLAnchorElement).style.opacity = '0.9';
            }}
            onMouseLeave={(e) => {
              (e.currentTarget as HTMLAnchorElement).style.opacity = '1';
            }}
          >
            Explore Models
          </a>
          <a
            href="/calculator"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-xl font-semibold text-sm transition-all"
            style={{
              background: 'var(--bg-card)',
              border: '1px solid var(--border)',
              color: 'var(--text-muted)',
            }}
            onMouseEnter={(e) => {
              (e.currentTarget as HTMLAnchorElement).style.color = 'var(--text)';
            }}
            onMouseLeave={(e) => {
              (e.currentTarget as HTMLAnchorElement).style.color = 'var(--text-muted)';
            }}
          >
            <Calculator size={16} />
            Cost Calculator
          </a>
          <a
            href="https://github.com/cloudcap10/pickmodel"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-xl font-semibold text-sm transition-all"
            style={{
              background: 'var(--bg-card)',
              border: '1px solid var(--border)',
              color: 'var(--text-muted)',
            }}
            onMouseEnter={(e) => {
              (e.currentTarget as HTMLAnchorElement).style.color = 'var(--text)';
            }}
            onMouseLeave={(e) => {
              (e.currentTarget as HTMLAnchorElement).style.color = 'var(--text-muted)';
            }}
          >
            <GitFork size={16} />
            GitHub
          </a>
        </motion.div>

        {/* Stats bar */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.35 }}
          className="mt-14 grid grid-cols-3 gap-4 max-w-lg mx-auto"
        >
          {[
            { label: 'Models tracked', value: modelCount },
            { label: 'Providers', value: providerCount },
            { label: 'Data points', value: '20+' },
          ].map((stat) => (
            <div
              key={stat.label}
              className="rounded-xl p-4 text-center"
              style={{
                background: 'var(--bg-card)',
                border: '1px solid var(--border-subtle)',
              }}
            >
              <div className="text-2xl font-bold" style={{ color: 'var(--text)' }}>
                {stat.value}
              </div>
              <div className="text-xs mt-1" style={{ color: 'var(--text-muted)' }}>
                {stat.label}
              </div>
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
