import type { Metadata } from 'next';
import { loadModels } from '@/lib/data';
import CostCalculator from '@/components/CostCalculator';

const SITE_URL = 'https://pickmodel.uk';

export const metadata: Metadata = {
  title: 'AI API Cost Calculator — Compare Monthly Costs for Claude, GPT, Gemini & More',
  description:
    'Free AI API cost calculator. Enter your usage (messages/day, token count) and instantly see every major AI model ranked by monthly cost. Compare Claude, GPT-4o, Gemini, DeepSeek and 20+ models.',
  alternates: { canonical: `${SITE_URL}/calculator` },
  openGraph: {
    title: 'AI API Cost Calculator',
    description:
      'Instantly rank 20+ AI models by your actual monthly API cost. Adjust messages/day and token counts — updates in real time.',
    url: `${SITE_URL}/calculator`,
    type: 'website',
    images: [{ url: `${SITE_URL}/og.png`, width: 1200, height: 630 }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'AI API Cost Calculator',
    description: 'Rank every major AI model by your real monthly API cost — free and instant.',
  },
};

export default function CalculatorPage() {
  const models = loadModels();

  return (
    <div className="max-w-4xl mx-auto px-4 py-12">
      {/* Header */}
      <div className="mb-10 text-center">
        <div
          className="inline-flex items-center gap-2 mb-4 px-3 py-1.5 rounded-full text-xs font-medium"
          style={{
            background: 'var(--accent-glow)',
            border: '1px solid var(--accent-dim)',
            color: 'var(--accent)',
          }}
        >
          Real-time · {models.length} models · List API prices
        </div>
        <h1 className="text-4xl sm:text-5xl font-bold tracking-tight mb-4">
          <span className="gradient-text">AI Cost</span>{' '}
          <span style={{ color: 'var(--text)' }}>Calculator</span>
        </h1>
        <p className="text-lg max-w-2xl mx-auto" style={{ color: 'var(--text-muted)', lineHeight: 1.7 }}>
          Set your daily message volume and average token counts. Every model is ranked by{' '}
          <span style={{ color: 'var(--text)' }}>estimated monthly API cost</span> — updated
          instantly as you adjust.
        </p>
      </div>

      <CostCalculator models={models} />
    </div>
  );
}
