import type { Metadata } from 'next';
import { loadModels } from '@/lib/data';
import Hero from '@/components/Hero';
import ModelsSection from '@/components/ModelsSection';

export const metadata: Metadata = {
  title: 'PickModel — Compare AI Models Side by Side',
  description:
    'Free, up-to-date comparison of AI language models. Compare Claude, GPT-4o, Gemini, Llama and more by context window, price, reasoning, speed, and features.',
  alternates: {
    canonical: 'https://pickmodel.uk',
  },
};

export default function Home() {
  const models = loadModels();
  const providerCount = new Set(models.map((m) => m.provider)).size;

  return (
    <>
      <Hero modelCount={models.length} providerCount={providerCount} />
      <ModelsSection models={models} />
    </>
  );
}
