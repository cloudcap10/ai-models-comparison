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

  const appSchema = {
    '@context': 'https://schema.org',
    '@type': 'WebApplication',
    name: 'AI API Cost Calculator',
    url: `${SITE_URL}/calculator`,
    description:
      'Free interactive calculator that ranks every major AI model by your estimated monthly API cost based on message volume and token counts.',
    applicationCategory: 'BusinessApplication',
    operatingSystem: 'Web',
    isAccessibleForFree: true,
    offers: { '@type': 'Offer', price: '0', priceCurrency: 'USD' },
    featureList: [
      'Compare 20+ AI models by monthly API cost',
      'Adjust messages per day, input tokens, and output tokens',
      'Real-time cost ranking with visual bar chart',
      'Presets for Personal, Developer, Startup, and Scale usage',
    ],
  };

  const faqSchema = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: [
      {
        '@type': 'Question',
        name: 'Which AI model has the cheapest API?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'For most workloads, GPT-4o mini, Gemini 2.5 Flash, Llama 3.3 70B, and DeepSeek V3 are among the cheapest options at $0.10–$0.30 per 1M input tokens. Use the calculator to rank all models by your exact usage.',
        },
      },
      {
        '@type': 'Question',
        name: 'How is the monthly API cost calculated?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'Monthly cost = (messages/day × 30) × [(avg input tokens / 1M × input price) + (avg output tokens / 1M × output price)]. All prices are list prices from provider APIs.',
        },
      },
      {
        '@type': 'Question',
        name: 'Is Claude or GPT-4o cheaper for API usage?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'At list prices, GPT-4o ($2.50/M input, $10/M output) is generally cheaper than Claude Sonnet 4.6 ($3/M input, $15/M output) for most workloads. Use the calculator with your token counts for an exact comparison.',
        },
      },
      {
        '@type': 'Question',
        name: 'What is the cheapest way to use Claude via API?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'Claude Haiku 4.5 is the cheapest Claude model at $1/M input and $5/M output tokens. Prompt caching can further reduce costs by up to 90% for repeated context.',
        },
      },
    ],
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(appSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />

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
    </>
  );
}
