"use client";
import { useState } from "react";
import type { Site } from "@/lib/sites";
import AnimatedLogo from "@/components/AnimatedLogo";

const GRADIENTS = [
  "from-indigo-500 to-purple-500",
  "from-cyan-500 to-blue-500",
  "from-amber-500 to-orange-500",
  "from-pink-500 to-purple-500",
  "from-emerald-500 to-teal-500",
  "from-blue-500 to-indigo-500",
  "from-red-500 to-amber-500",
  "from-purple-500 to-pink-500",
];

function gradientOf(id: string): string {
  let h = 0;
  for (let i = 0; i < id.length; i++) h = (h * 31 + id.charCodeAt(i)) >>> 0;
  return GRADIENTS[h % GRADIENTS.length];
}

function faviconSources(url: string): string[] {
  try {
    const u = new URL(url);
    const host = u.hostname;
    return [
      `https://www.google.com/s2/favicons?domain=${host}&sz=128`,
      `https://icons.duckduckgo.com/ip3/${host}.ico`,
      `https://${host}/favicon.ico`,
    ];
  } catch {
    return [];
  }
}

export default function SiteDetail({
  id,
  site,
  category,
}: {
  id: string;
  site: Site | null;
  category: string;
}) {
  const [sourceIndex, setSourceIndex] = useState(0);
  const [failed, setFailed] = useState(false);
  const [loaded, setLoaded] = useState(false);

  if (!site) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
        <div className="text-center">
          <div className="w-16 h-16 rounded-2xl bg-gray-100 flex items-center justify-center mx-auto text-3xl">🔍</div>
          <h1 className="mt-5 text-xl font-bold">未找到该站点</h1>
          <p className="mt-2 text-sm text-gray-400">该站点可能已被移除或链接无效</p>
          <a href="/" className="mt-6 inline-flex h-10 px-6 rounded-xl bg-indigo-500 text-white text-sm font-semibold items-center hover:bg-indigo-600 active:scale-95 transition-all">
            ← 返回导航首页
          </a>
        </div>
      </div>
    );
  }

  const customIcon = site.icon && site.icon.startsWith("http") ? site.icon : null;
  const sources = customIcon ? [customIcon] : faviconSources(site.url);
  const currentSrc = sources[sourceIndex] || "";
  const showFallback = failed || !currentSrc;

  const handleError = () => {
    if (sourceIndex < sources.length - 1) {
      setSourceIndex(sourceIndex + 1);
      setLoaded(false);
    } else {
      setFailed(true);
    }
  };

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
      <header className="sticky top-0 z-50 bg-white/90 backdrop-blur-lg border-b border-gray-100">
        <div className="max-w-4xl mx-auto px-4 h-14 flex items-center justify-between gap-3">
          <a href="/" className="flex items-center gap-2 min-w-0">
            <AnimatedLogo size="sm" />
            <span className="font-bold text-sm truncate">甜甜导航</span>
          </a>
          <a
            href="/"
            className="h-9 px-3 rounded-lg border border-gray-200 text-xs font-semibold flex items-center hover:border-indigo-300 hover:text-indigo-600 active:scale-95 transition-all"
          >
            ← 返回导航
          </a>
        </div>
      </header>

      {/* 详情内容 */}
      <main className="flex-1 flex items-start md:items-center justify-center px-4 py-8 md:py-16">
        <div className="w-full max-w-lg">
          <div className="bg-white rounded-3xl border border-gray-100 shadow-sm p-6 md:p-8 text-center">
            {/* 图标 */}
            <div className={`relative w-20 h-20 md:w-24 md:h-24 rounded-2xl overflow-hidden flex items-center justify-center mx-auto ${
              showFallback ? `bg-gradient-to-br ${gradientOf(id)}` : "bg-gray-50"
            } shadow-lg`}>
              {showFallback ? (
                <span className="text-white font-bold text-3xl md:text-4xl select-none">甜</span>
              ) : (
                <>
                  {!loaded && (
                    <div className={`absolute inset-0 bg-gradient-to-br ${gradientOf(id)} flex items-center justify-center`}>
                      <span className="text-white font-bold text-3xl md:text-4xl select-none">甜</span>
                    </div>
                  )}
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={currentSrc}
                    alt={site.name}
                    width={96}
                    height={96}
                    className={`w-full h-full object-contain p-2.5 transition-opacity duration-200 ${loaded ? "opacity-100" : "opacity-0"}`}
                    onError={handleError}
                    onLoad={() => setLoaded(true)}
                  />
                </>
              )}
            </div>

            {/* 名称 */}
            <h1 className="mt-5 text-xl md:text-2xl font-bold break-all">
              {site.name}
            </h1>

            {/* 分类标签 */}
            {category && (
              <div className="mt-3">
                <span className="inline-flex items-center text-xs text-indigo-600 bg-indigo-50 border border-indigo-100 rounded-lg px-3 py-1">
                  {category}
                </span>
              </div>
            )}

            {/* 描述 */}
            {site.desc && (
              <p className="mt-4 text-sm md:text-base text-gray-500 leading-relaxed">
                {site.desc}
              </p>
            )}

            {/* 网址 */}
            <div className="mt-5 bg-gray-50 rounded-xl border border-gray-100 px-4 py-3 inline-block max-w-full">
              <span className="text-xs text-gray-400">网址：</span>
              <span className="text-xs text-gray-700 font-mono break-all">{site.url}</span>
            </div>

            {/* CTA 按钮 */}
            <div className="mt-6 flex flex-col sm:flex-row items-center justify-center gap-3">
              <a
                href={site.url}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full sm:w-auto h-11 px-8 rounded-xl bg-indigo-500 text-white text-sm font-semibold flex items-center justify-center hover:bg-indigo-600 hover:shadow-lg hover:shadow-indigo-500/25 active:scale-95 transition-all"
              >
                访问网站 →
              </a>
              <a
                href="/"
                className="w-full sm:w-auto h-11 px-8 rounded-xl border border-gray-200 bg-white text-sm font-semibold flex items-center justify-center hover:border-indigo-300 hover:text-indigo-600 active:scale-95 transition-all"
              >
                继续浏览
              </a>
            </div>
          </div>

          {/* 底部信息 */}
          <div className="text-center mt-5 text-xs text-gray-400">
            域名：{domain} · 由甜甜导航收录整理
          </div>
        </div>
      </main>

      {/* 页脚 */}
      <footer className="bg-white border-t border-gray-100 py-5 px-4">
        <div className="max-w-4xl mx-auto text-center text-xs text-gray-400">
          © {new Date().getFullYear()} 甜甜导航 · 专业 iOS 资源导航站
        </div>
      </footer>
    </div>
  );
}
