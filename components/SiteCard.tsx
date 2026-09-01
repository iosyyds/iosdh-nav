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

export default function SiteCard({ site }: { site: Site }) {
  const [failed, setFailed] = useState(false);
  const icon =
    site.icon && site.icon.startsWith("http") ? site.icon : faviconUrl(site.url);

  return (
    <a
      href={site.url}
      target="_blank"
      rel="noopener noreferrer"
      title={site.url}
      className="group bg-white rounded-2xl shadow-sm border border-gray-100 text-center p-6 md:p-8 flex flex-col items-center gap-3 transition-all duration-200 ease-out hover:-translate-y-1 hover:shadow-xl hover:shadow-[#6366f1]/30 hover:border-[#6366f1]/30"
    >
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
      <span className="w-full">
        <span className="block font-bold tracking-tight text-base md:text-lg text-[#0f172a] group-hover:text-[#6366f1] transition-colors duration-200">
          {site.name}
        </span>
        {site.desc ? (
          <span className="block font-sans text-xs md:text-sm text-gray-400 mt-1.5 leading-relaxed line-clamp-2">
            {site.desc}
          </span>
        ) : null}
      </span>
    </a>
  );
}
