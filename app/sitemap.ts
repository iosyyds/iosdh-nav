import type { MetadataRoute } from "next";
import { readFileSync } from "fs";
import { join } from "path";

export const dynamic = "force-static";

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = "https://eqkk.top";
  const dataPath = join(process.cwd(), "public", "data", "sites.json");
  const raw = readFileSync(dataPath, "utf-8");
  const data = JSON.parse(raw);

  const urls: MetadataRoute.Sitemap = [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 1,
    },
    {
      url: `${baseUrl}/admin`,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.3,
    },
  ];

  // 为每个站点详情页生成 sitemap 条目
  for (const sites of Object.values(data.categories) as any[]) {
    for (const site of sites) {
      if (site.id) {
        urls.push({
          url: `${baseUrl}/site/${encodeURIComponent(site.id)}/`,
          lastModified: new Date(),
          changeFrequency: "weekly",
          priority: 0.6,
        });
      }
    }
  }

  return urls;
}
