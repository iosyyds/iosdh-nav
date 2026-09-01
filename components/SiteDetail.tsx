"use client";

import { useEffect, useMemo, useState } from "react";
import { loadSiteData, type SiteData } from "@/lib/dataLoader";
import type { Site } from "@/lib/sites";
import AnimatedLogo from "@/components/AnimatedLogo";

// 获取网站 favicon（百度服务，国内稳定）
function faviconUrl(url: string): string {
  try {
    const u = new URL(url);
    return `https://favicon.baidu.com/${u.hostname}`;
  } catch {
    return "";
  }
}

const GRADIENTS = [
  "from-[#6366f1] to-[#8b5cf6]",
  "from-[#06b6d4] to-[#0ea5e9]",
  "from-[#f59e0b] to-[#f97316]",
  "from-[#ec4899] to-[#a855f7]",
  "from-[#10b981] to-[#14b8a6]",
  "from-[#3b82f6] to-[#6366f1]",
  "from-[#ef4444] to-[#f59e0b]",
  "from-[#8b5cf6] to-[#ec4899]",
];

function gradientOf(id: string): string {
  let h = 0;
  for (let i = 0; i < id.length; i++) h = (h * 31 + id.charCodeAt(i)) >>> 0;
  return GRADIENTS[h % GRADIENTS.length];
}

export default function SiteDetail({ id }: { id: string }) {
  const [data, setData] = useState<SiteData | null>(null);
  const [iconFailed, setIconFailed] = useState(false);

  useEffect(() => {
    loadSiteData().then(setData);
  }, []);

  const { site, category } = useMemo(() => {
    if (!data) return { site: null as Site | null, category: "" };
    for (const [cat, sites] of Object.entries(data.categories)) {
      const found = sites.find((s) => String(s.id) === String(id));
      if (found) return { site: found, category: cat };
    }
    return { site: null as Site | null, category: "" };
  }, [data, id]);

  if (!data) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="h-10 w-10 rounded-xl bg-[#6366f1] animate-pulse mx-auto" />
          <p className="font-sans text-sm text-gray-400 mt-4">加载中…</p>
        </div>
      </div>
    );
  }

  if (!site) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
        <div className="text-center max-w-md">
          <div className="h-16 w-16 rounded-2xl bg-gray-100 flex items-center justify-center mx-auto text-3xl">
            🔍
          </div>
          <h1 className="font-bold tracking-tight text-2xl text-[#0f172a] mt-6">
            未找到该站点
          </h1>
          <p className="font-sans text-sm text-gray-400 mt-2">
            该站点可能已被移除或链接无效
          </p>
          <a
            href="/"
            className="inline-block mt-6 rounded-xl font-semibold transition-all duration-300 bg-[#6366f1] text-white shadow-lg shadow-[#6366f1]/25 hover:scale-[1.02] px-6 py-2.5 text-sm active:scale-95"
          >
            ← 返回导航首页
          </a>
        </div>
      </div>
    );
  }

  // 优先用站点自带图标，否则用 favicon 服务
  const iconUrl = site.icon && site.icon.startsWith("http")
    ? site.icon
    : faviconUrl(site.url);
  const showDefault = iconFailed || !iconUrl;
  const domain = (() => {
    try {
      return new URL(site.url).hostname;
    } catch {
      return site.url;
    }
  })();

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* 顶部导航 */}
      <header className="sticky top-0 z-50 bg-white/95 backdrop-blur border border-gray-200 px-4 md:px-6 lg:px-8">
        <div className="flex items-center justify-between max-w-4xl mx-auto gap-4 h-16">
          <a href="/" className="flex items-center gap-2.5">
            <AnimatedLogo size="md" />
          </a>
          <a
            href="/"
            className="rounded-xl font-semibold transition-all duration-300 bg-white text-[#0f172a] border border-gray-200 px-4 py-2 text-sm hover:border-[#6366f1]/50 hover:text-[#6366f1] active:scale-95"
          >
            ← 返回导航
          </a>
        </div>
      </header>

      {/* 详情内容 */}
      <main className="flex-1 flex items-center justify-center px-4 md:px-6 py-12 md:py-20">
        <div className="w-full max-w-2xl">
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8 md:p-12 text-center">
            {/* 图标 */}
            <div className={`relative h-20 w-20 md:h-24 md:w-24 rounded-2xl overflow-hidden ${showDefault ? `bg-gradient-to-br ${gradientOf(site.id)}` : "bg-white"} flex items-center justify-center mx-auto shrink-0 shadow-lg`}>
              {showDefault ? (
                <span className="font-bold tracking-tight text-3xl md:text-4xl text-white select-none">
                  甜
                </span>
              ) : (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={iconUrl}
                  alt={site.name}
                  width={96}
                  height={96}
                  className="h-full w-full object-cover"
                  onError={() => setIconFailed(true)}
                />
              )}
            </div>

            {/* 名称 */}
            <h1 className="font-bold tracking-tight text-2xl md:text-3xl text-[#0f172a] mt-6">
              {site.name}
            </h1>

            {/* 分类标签 */}
            {category && (
              <div className="mt-3">
                <span className="inline-block font-sans text-xs text-[#6366f1] bg-[#6366f1]/10 border border-[#6366f1]/20 rounded-xl px-3 py-1">
                  {category}
                </span>
              </div>
            )}

            {/* 描述 */}
            {site.desc && (
              <p className="font-sans text-base text-gray-600 mt-4 leading-relaxed max-w-md mx-auto">
                {site.desc}
              </p>
            )}

            {/* 网址 */}
            <div className="mt-6 bg-gray-50 rounded-xl border border-gray-100 px-4 py-3 inline-block max-w-full">
              <span className="font-sans text-sm text-gray-400">网址：</span>
              <span className="font-sans text-sm text-[#0f172a] font-mono break-all">
                {site.url}
              </span>
            </div>

            {/* CTA */}
            <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-3">
              <a
                href={site.url}
                target="_blank"
                rel="noopener noreferrer"
                className="rounded-xl font-semibold transition-all duration-300 bg-[#6366f1] text-white shadow-lg shadow-[#6366f1]/25 hover:scale-[1.02] hover:shadow-xl hover:shadow-[#6366f1]/30 active:scale-95 px-8 py-3 text-base w-full sm:w-auto"
              >
                访问网站 →
              </a>
              <a
                href="/"
                className="rounded-xl font-semibold transition-all duration-300 bg-white text-[#0f172a] border border-gray-200 hover:border-[#6366f1]/40 px-8 py-3 text-base w-full sm:w-auto active:scale-95"
              >
                继续浏览
              </a>
            </div>
          </div>

          {/* 底部信息 */}
          <div className="text-center mt-6 font-sans text-xs text-gray-400">
            域名：{domain} · 由甜甜导航收录整理
          </div>
        </div>
      </main>

      {/* 页脚 */}
      <footer className="bg-white border-t border-gray-100 py-6 px-4">
        <div className="max-w-4xl mx-auto text-center font-sans text-xs text-gray-400">
          © {new Date().getFullYear()} 甜甜导航 · 专业 iOS 资源导航站
        </div>
      </footer>
    </div>
  );
}
