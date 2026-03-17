import { MetadataRoute } from 'next';
import { SITE_URL } from '@/lib/config';

const DOMAIN = SITE_URL;

export default function sitemap(): MetadataRoute.Sitemap {
  // 실제 환경에서는 DB나 API에서 동적으로 가져와야 합니다.
  const categories = ['analysis', 'stocks', 'notes', 'market'];
  const articleSlugs = ['2024-semiconductor-buy-now', 'samsung-vs-tsmc-dividend', 'individual-investor-etf-portfolio', 'how-to-get-adsense-approval-seo-guide'];

  const categoryUrls = categories.map((slug) => ({
    url: `${DOMAIN}/category/${slug}`,
    lastModified: new Date(),
    changeFrequency: 'weekly' as const,
    priority: 0.8,
  }));

  const articleUrls = articleSlugs.map((slug) => ({
    url: `${DOMAIN}/article/${slug}`,
    lastModified: new Date(),
    changeFrequency: 'monthly' as const,
    priority: 0.7,
  }));

  return [
    {
      url: `${DOMAIN}`,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 1.0,
    },
    {
      url: `${DOMAIN}/about`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.5,
    },
    // 구독 기능 일단 비활성화
    // {
    //   url: `${DOMAIN}/newsletter`,
    //   lastModified: new Date(),
    //   changeFrequency: 'monthly',
    //   priority: 0.6,
    // },
    ...categoryUrls,
    ...articleUrls,
  ];
}
