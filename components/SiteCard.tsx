"use client";

import { useState } from "react";
import type { Site } from "@/lib/sites";

function faviconUrl(url: string): string {
  try {
    const u = new URL(url);
    return `https://t0.gstatic.cn/faviconV2?client=SOCIAL&type=FAVICON&fallback_opts=TYPE,SIZE,URL&size=128&url=${encodeURIComponent(
      u.origin
    )}`;
  } catch {
    return "";
  }
}

const PALETTE = ["#6366f1", "#06b6d4", "#f59e0b", "#ec4899", "#10b981"];

function initialOf(name: string): string {
  const c = name.trim().charAt(0);
  return c ? c.toUpperCase() : "?";
}

function colorOf(id: string): string {
  let h = 0;
  for (let i = 0; i < id.length; i++) h = (h * 31 + id.charCodeAt(i)) >>> 0;
  return PALETTE[h % PALETTE.length];
}

export default function SiteCard({
  site,
  category,
}: {
  site: Site;
  category?: string;
}) {
  const [failed, setFailed] = useState(false);
  const icon =
    site.icon && site.icon.startsWith("http") ? site.icon : faviconUrl(site.url);

  return (
    <a
      href={`/site/${encodeURIComponent(site.id)}/`}
      title={`查看「${site.name}」详情`}
      className="group relative bg-white rounded-xl md:rounded-2xl shadow-sm border border-gray-100 text-center p-3 md:p-5 flex flex-col items-center gap-2 md:gap-3 transition-all duration-200 ease-out hover:-translate-y-1 hover:shadow-xl hover:shadow-[#6366f1]/30 hover:border-[#6366f1]/30 overflow-hidden"
    >
      {/* subtle top accent on hover */}
      <span
        className="absolute inset-x-0 top-0 h-0.5 bg-[#6366f1] opacity-0 group-hover:opacity-100 transition-opacity duration-200"
        aria-hidden="true"
      />

      <span className="relative h-12 w-12 md:h-14 md:w-14 rounded-xl overflow-hidden bg-gray-50 border border-gray-100 flex items-center justify-center shrink-0">
        {!failed && icon ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={icon}
            alt=""
            loading="lazy"
            width={48}
            height={48}
            className="h-full w-full object-cover"
            onError={() => setFailed(true)}
          />
        ) : (
          <span
            className="h-full w-full flex items-center justify-center font-bold tracking-tight text-lg text-white"
            style={{ backgroundColor: colorOf(site.id) }}
          >
            {initialOf(site.name)}
          </span>
        )}
      </span>
      <span className="w-full flex flex-col items-center">
        <span className="block w-full font-bold tracking-tight text-sm md:text-base text-[#0f172a] group-hover:text-[#6366f1] transition-colors duration-200 truncate">
          {site.name}
        </span>
        {/* 描述区：始终占位，统一高度，长描述截断为一行 */}
        <span className="block w-full font-sans text-xs text-gray-400 mt-1.5 leading-relaxed truncate min-h-[1.25rem]">
          {site.desc || "\u00A0"}
        </span>
        {category ? (
          <span className="inline-block font-sans text-[11px] text-gray-400 bg-gray-50 border border-gray-100 rounded-lg px-2 py-0.5 mt-2 group-hover:border-[#6366f1]/30 group-hover:text-[#6366f1] transition-colors duration-200">
            {category}
          </span>
        ) : (
          <span className="mt-2 h-[1.25rem]" aria-hidden="true" />
        )}
      </span>
    </a>
  );
}
