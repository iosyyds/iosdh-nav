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
  const dataPath = join(process.cwd(), "public", "data", "sites.json");
  const raw = readFileSync(dataPath, "utf-8");
  return JSON.parse(raw);
}

export async function generateStaticParams() {
  const data = loadData();
  const ids: string[] = [];
  for (const sites of Object.values(data.categories)) {
    for (const s of sites) {
      if (s.id) ids.push(s.id);
    }
  }
  return ids.map((id) => ({ id }));
}

export async function generateMetadata({
  params,
}: {
  params: { id: string };
}): Promise<Metadata> {
  const data = loadData();
  let site: Site | null = null;
  let category = "";
  for (const [cat, sites] of Object.entries(data.categories)) {
    const found = sites.find((s) => String(s.id) === String(params.id));
    if (found) {
      site = found;
      category = cat;
      break;
    }
  }

  if (!site) {
    return {
      title: "未找到该站点",
      description: "该站点可能已被移除或链接无效",
      robots: { index: false, follow: false },
    };
  }

  const title = `${site.name} - ${category} | 甜甜导航`;
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

export default function SiteDetailPage({ params }: { params: { id: string } }) {
  const data = loadData();
  let site: Site | null = null;
  let category = "";
  for (const [cat, sites] of Object.entries(data.categories)) {
    const found = sites.find((s) => String(s.id) === String(params.id));
    if (found) {
      site = found;
      category = cat;
      break;
    }
  }
  return <SiteDetail id={params.id} site={site} category={category} />;
}
