import type { MetadataRoute } from 'next';

export const dynamic = 'force-static';
import { loadModels } from '@/lib/data';

const SITE_URL = 'https://pickmodel.uk';

export default function sitemap(): MetadataRoute.Sitemap {
  const models = loadModels();

  const modelPages = models.map((m) => ({
    url: `${SITE_URL}/model/${m.id}`,
    lastModified: new Date(),
    changeFrequency: 'weekly' as const,
    priority: 0.8,
  }));

  return [
    {
      url: SITE_URL,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 1,
    },
    {
      url: `${SITE_URL}/about`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.4,
    },
    ...modelPages,
  ];
}
