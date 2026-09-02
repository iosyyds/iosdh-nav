// 服务端组件：构建时直接读取数据并注入，不依赖客户端加载
import type { Metadata } from "next";
import { readFileSync } from "fs";
import { join } from "path";
import SiteDetail from "@/components/SiteDetail";
import type { Site } from "@/lib/sites";

interface SiteData {
  navGroups: any[];
  categories: Record<string, Site[]>;
}

function loadData(): SiteData {
  const possiblePaths = [
    join(process.cwd(), "public", "data", "sites.json"),
    join(process.cwd(), "lib", "sitesData.json"),
  ];
  
  for (const dataPath of possiblePaths) {
    try {
      const raw = readFileSync(dataPath, "utf-8");
      const parsed = JSON.parse(raw);
      if (parsed.categories && Object.keys(parsed.categories).length > 0) {
        return parsed as SiteData;
      }
    } catch (e) {
      // 继续尝试下一个路径
    }
  }
  
  return { navGroups: [], categories: {} };
}

const data = loadData();

export async function generateStaticParams() {
  const ids: string[] = [];
  for (const sites of Object.values(data.categories)) {
    for (const s of sites) {
      if (s.id) ids.push(String(s.id));
    }
  }
  return ids.map((id) => ({ id }));
}

function findSite(id: string): { site: Site | null; category: string } {
  for (const [cat, sites] of Object.entries(data.categories)) {
    const found = sites.find((s) => String(s.id) === String(id));
    if (found) return { site: found, category: cat };
  }
  return { site: null, category: "" };
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}): Promise<Metadata> {
  const { id } = await params;
  const { site, category } = findSite(id);

  if (!site) {
    return {
      title: "未找到该站点",
      description: "该站点可能已被移除或链接无效",
      robots: { index: false, follow: false },
    };
  }

  const title = `${site.name} - ${category}`;
  const description = site.desc
    ? `${site.desc}。${site.name} 属于${category}分类，甜甜导航精选收录。`
    : `${site.name} - ${category}分类优质网站，甜甜导航精选收录。`;

  return {
    title,
    description,
    keywords: `${site.name}, ${category}, 甜甜导航, iOS资源导航`,
    alternates: {
      canonical: `https://eqkk.top/site/${encodeURIComponent(site.id)}/`,
    },
    openGraph: {
      type: "article",
      locale: "zh_CN",
      url: `https://eqkk.top/site/${encodeURIComponent(site.id)}/`,
      title,
      description,
      siteName: "甜甜导航",
    },
    twitter: {
      card: "summary",
      title,
      description,
    },
    robots: {
      index: true,
      follow: true,
    },
  };
}

export default async function SiteDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const { site, category } = findSite(id);
  return <SiteDetail id={id} site={site} category={category} />;
}
