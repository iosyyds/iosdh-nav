"use client";
import { useState } from "react";
import type { Site } from "@/lib/sites";

// 渐变色板：每个站点根据 id 选择不同的渐变
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

// 获取网站 favicon 多源列表（按优先级排序）
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
  const [allFailed, setAllFailed] = useState(false);
  const [imgLoaded, setImgLoaded] = useState(false);

  // 优先用站点自带图标，否则用多源 favicon
  const customIcon = site.icon && site.icon.startsWith("http") ? site.icon : null;
  const sources = customIcon ? [customIcon] : faviconSources(site.url);
  const currentIcon = sources[sourceIndex] || "";
  const showDefault = allFailed || !currentIcon;

  const handleIconError = () => {
    if (sourceIndex < sources.length - 1) {
      setSourceIndex(sourceIndex + 1);
      setImgLoaded(false);
    } else {
      setAllFailed(true);
    }
  };

  return (
    <a
      href={`/site/${encodeURIComponent(site.id)}/`}
      title={`查看「${site.name}」详情`}
      className="group relative bg-white rounded-2xl shadow-sm border border-gray-100 text-center p-3 md:p-5 flex flex-col items-center gap-2 md:gap-3 transition-all duration-200 ease-out hover:-translate-y-1 hover:shadow-xl hover:shadow-[#6366f1]/30 hover:border-[#6366f1]/30 overflow-hidden"
    >
      {/* subtle top accent on hover */}
      <span
        className="absolute inset-x-0 top-0 h-0.5 bg-[#6366f1] opacity-0 group-hover:opacity-100 transition-opacity duration-200"
        aria-hidden="true"
      />

      {/* 图标容器：始终有浅灰背景，透明图标也能看到 */}
      <span className={`relative h-12 w-12 md:h-14 md:w-14 rounded-xl overflow-hidden ${showDefault ? `bg-gradient-to-br ${gradientOf(site.id)}` : "bg-gray-50"} flex items-center justify-center shrink-0 shadow-sm`}>
        {showDefault ? (
          <span className="font-bold tracking-tight text-lg md:text-xl text-white select-none">
            甜
          </span>
        ) : (
          <>
            {/* 图片未加载时显示渐变甜字占位 */}
            {!imgLoaded && (
              <span className={`absolute inset-0 bg-gradient-to-br ${gradientOf(site.id)} flex items-center justify-center`}>
                <span className="font-bold tracking-tight text-lg md:text-xl text-white select-none">甜</span>
              </span>
            )}
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={currentIcon}
              alt=""
              loading="lazy"
              width={48}
              height={48}
              className={`h-full w-full object-contain p-1 transition-opacity duration-200 ${imgLoaded ? "opacity-100" : "opacity-0"}`}
              onError={handleIconError}
              onLoad={() => setImgLoaded(true)}
            />
          </>
        )}
      </span>

      <span className="w-full flex flex-col items-center min-w-0">
        <span className="block w-full font-bold tracking-tight text-sm md:text-base text-[#0f172a] group-hover:text-[#6366f1] transition-colors duration-200 truncate">
          {site.name}
        </span>
        {/* 描述区：始终占位，统一高度，长描述截断为一行 */}
        <span className="block w-full font-sans text-xs text-gray-400 mt-1 leading-relaxed truncate min-h-[1.25rem]">
          {site.desc || "\u00A0"}
        </span>
        {category ? (
          <span className="inline-block font-sans text-[10px] md:text-[11px] text-gray-400 bg-gray-50 border border-gray-100 rounded-lg px-2 py-0.5 mt-1.5 group-hover:border-[#6366f1]/30 group-hover:text-[#6366f1] transition-colors duration-200">
            {category}
          </span>
        ) : (
          <span className="mt-1.5 h-[1.25rem]" aria-hidden="true" />
        )}
      </span>
    </a>
  );
}
