import type { Metadata } from 'next';
import { loadModels } from '@/lib/data';
import Hero from '@/components/Hero';
import ModelsSection from '@/components/ModelsSection';

const SITE_URL = 'https://pickmodel.uk';

export const metadata: Metadata = {
  title: 'PickModel — Compare AI Models Side by Side',
  description:
    'Free, up-to-date comparison of the top 20 AI models. Compare Claude, GPT-4o, Gemini, Llama, DeepSeek and more by context window, API price, benchmarks, and features. Updated weekly.',
  alternates: { canonical: SITE_URL },
  openGraph: {
    title: 'PickModel — Compare AI Models Side by Side',
    description:
      'Compare the top 20 AI models by context window, API pricing, benchmark scores, and capabilities. Free and updated weekly.',
    url: SITE_URL,
    type: 'website',
    images: [{ url: `${SITE_URL}/og.png`, width: 1200, height: 630 }],
  },
};

export default function Home() {
  const models = loadModels();
  const providerCount = new Set(models.map((m) => m.provider)).size;

  const websiteSchema = {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: 'PickModel',
    url: SITE_URL,
    description:
      'Free comparison of the top 20 AI language models by context window, pricing, benchmarks, and capabilities.',
    potentialAction: {
      '@type': 'SearchAction',
      target: { '@type': 'EntryPoint', urlTemplate: `${SITE_URL}/?q={search_term_string}` },
      'query-input': 'required name=search_term_string',
    },
  };

  const itemListSchema = {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    name: 'Top AI Language Models Comparison',
    description: 'The top 20 AI models ranked and compared by pricing, context window, and benchmarks.',
    numberOfItems: models.length,
    itemListElement: models.map((m, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      name: m.name,
      url: `${SITE_URL}/model/${m.id}`,
      description: m.description,
    })),
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(itemListSchema) }}
      />
      <Hero modelCount={models.length} providerCount={providerCount} />
      <ModelsSection models={models} />
    </>
  );
}
