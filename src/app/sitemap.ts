import type { MetadataRoute } from 'next';
import { loadModels } from '@/lib/data';

export const dynamic = 'force-static';

const SITE_URL = 'https://pickmodel.uk';

function releaseDateToDate(yyyyMM: string): Date {
  const [year, month] = yyyyMM.split('-').map(Number);
  if (!year || !month) return new Date();
  return new Date(year, month - 1, 1);
}

export default function sitemap(): MetadataRoute.Sitemap {
  const models = loadModels();
  const now = new Date();

  const modelPages = models.map((m) => ({
    url: `${SITE_URL}/model/${m.id}`,
    lastModified: releaseDateToDate(m.releaseDate),
    changeFrequency: 'weekly' as const,
    priority: m.tier === 'frontier' ? 0.9 : 0.8,
  }));

  return [
    {
      url: SITE_URL,
      lastModified: now,
      changeFrequency: 'daily' as const,
      priority: 1,
    },
    {
      url: `${SITE_URL}/calculator`,
      lastModified: now,
      changeFrequency: 'weekly' as const,
      priority: 0.9,
    },
    {
      url: `${SITE_URL}/about`,
      lastModified: now,
      changeFrequency: 'monthly' as const,
      priority: 0.4,
    },
    ...modelPages,
  ];
}
