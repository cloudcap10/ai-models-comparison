import { loadModels } from '@/lib/data';
import Hero from '@/components/Hero';
import ModelsSection from '@/components/ModelsSection';

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
