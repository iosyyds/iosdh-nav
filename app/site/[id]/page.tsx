// 服务端组件：只负责 generateStaticParams 预生成所有详情页
import SiteDetail from "@/components/SiteDetail";

export async function generateStaticParams() {
  try {
    const fs = await import("fs");
    const path = await import("path");
    const dataPath = path.join(process.cwd(), "public", "data", "sites.json");
    const raw = fs.readFileSync(dataPath, "utf-8");
    const data = JSON.parse(raw) as { categories: Record<string, Array<{ id: string }>> };
    const ids: string[] = [];
    for (const sites of Object.values(data.categories)) {
      for (const s of sites) {
        if (s.id) ids.push(s.id);
      }
    }
    return ids.map((id) => ({ id }));
  } catch {
    return [];
  }
}

export default function SiteDetailPage({ params }: { params: { id: string } }) {
  return <SiteDetail id={params.id} />;
}
