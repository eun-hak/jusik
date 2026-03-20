import type { MetadataRoute } from "next";
import { SITE_URL } from "@/lib/config";
import { getArticles } from "@/lib/db/articles";

/** DB(.mock-db.json 등) 변경이 곧바로 반영되도록 (배포 없이 파일만 갱신하는 환경 대비) */
export const dynamic = "force-dynamic";

function baseUrl(): string {
  return SITE_URL.replace(/\/+$/, "");
}

export default function sitemap(): MetadataRoute.Sitemap {
  const base = baseUrl();
  const published = getArticles({ status: "published" });

  const staticRoutes: MetadataRoute.Sitemap = [
    {
      url: base,
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 1,
    },
    {
      url: `${base}/articles`,
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 0.9,
    },
    {
      url: `${base}/search`,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.6,
    },
    {
      url: `${base}/about`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.5,
    },
    {
      url: `${base}/privacy`,
      lastModified: new Date(),
      changeFrequency: "yearly",
      priority: 0.3,
    },
    {
      url: `${base}/terms`,
      lastModified: new Date(),
      changeFrequency: "yearly",
      priority: 0.3,
    },
    {
      url: `${base}/newsletter`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.4,
    },
  ];

  const articleRoutes: MetadataRoute.Sitemap = published.map((article) => ({
    url: `${base}/article/${article.slug}`,
    lastModified: new Date(article.updatedAt),
    changeFrequency: "weekly" as const,
    priority: 0.8,
  }));

  return [...staticRoutes, ...articleRoutes];
}
