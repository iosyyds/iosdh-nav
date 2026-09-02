"use client";
import { useState } from "react";
import type { Site } from "@/lib/sites";

// 渐变色板
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

// favicon 多源，优先 Google（稳定，返回 PNG）
function faviconSources(url: string): string[] {
  try {
    const u = new URL(url);
    const host = u.hostname;
    return [
      `https://www.google.com/s2/favicons?domain=${host}&sz=64`,
      `https://icons.duckduckgo.com/ip3/${host}.ico`,
      `https://${host}/favicon.ico`,
    ];
  } catch {
    return [];
  }
}

export default function SiteCard({
  site,
  category,
}: {
  site: Site;
  category?: string;
}) {
  const [sourceIndex, setSourceIndex] = useState(0);
  const [failed, setFailed] = useState(false);
  const [loaded, setLoaded] = useState(false);

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

  return (
    <a
      href={`/site/${encodeURIComponent(site.id)}/`}
      className="group relative bg-white rounded-2xl border border-gray-100 p-3.5 flex flex-col items-center text-center transition-all duration-200 hover:shadow-lg hover:shadow-indigo-500/10 hover:border-indigo-200 hover:-translate-y-0.5 active:scale-[0.98]"
    >
      {/* 图标 */}
      <div className={`relative w-12 h-12 rounded-xl overflow-hidden flex items-center justify-center shrink-0 ${
        showFallback ? `bg-gradient-to-br ${gradientOf(site.id)}` : "bg-gray-50"
      }`}>
        {showFallback ? (
          <span className="text-white font-bold text-lg select-none">甜</span>
        ) : (
          <>
            {/* 加载中显示甜字占位 */}
            {!loaded && (
              <div className={`absolute inset-0 bg-gradient-to-br ${gradientOf(site.id)} flex items-center justify-center`}>
                <span className="text-white font-bold text-lg select-none">甜</span>
              </div>
            )}
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={currentSrc}
              alt={site.name}
              width={48}
              height={48}
              loading="lazy"
              className={`w-full h-full object-contain p-1.5 transition-opacity duration-200 ${loaded ? "opacity-100" : "opacity-0"}`}
              onError={handleError}
              onLoad={() => setLoaded(true)}
            />
          </>
        )}
      </div>

      {/* 名称 */}
      <h3 className="mt-2.5 w-full font-semibold text-sm text-gray-900 truncate group-hover:text-indigo-600 transition-colors">
        {site.name}
      </h3>

      {/* 描述 */}
      <p className="mt-1 w-full text-xs text-gray-400 truncate min-h-[1rem]">
        {site.desc || "\u00A0"}
      </p>

      {/* 分类标签 */}
      {category && (
        <span className="mt-2 inline-flex items-center text-[10px] text-gray-400 bg-gray-50 border border-gray-100 rounded-lg px-2 py-0.5 group-hover:border-indigo-200 group-hover:text-indigo-500 transition-colors">
          {category}
        </span>
      )}
    </a>
  );
}
