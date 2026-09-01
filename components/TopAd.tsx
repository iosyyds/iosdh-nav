"use client";

import { useEffect, useState } from "react";
import { loadAds, type AdConfig } from "@/lib/ad";

export default function TopAd() {
  const [ads, setAds] = useState<AdConfig[]>([]);

  useEffect(() => {
    setAds(loadAds());
  }, []);

  const enabled = ads.filter((a) => a.enabled);
  if (enabled.length === 0) return null;

  return (
    <div className="bg-[#6366f1] text-white px-4 md:px-6 lg:px-8 py-2.5">
      <div className="max-w-6xl mx-auto flex items-center justify-center gap-3 flex-wrap">
        {enabled.map((ad) => (
          <a
            key={ad.id}
            href={ad.url}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 rounded-xl px-3 py-1.5 text-sm font-semibold transition-all duration-200 ease-out hover:scale-[1.02] hover:bg-white/10 bg-white/5 border border-white/10"
          >
            {ad.image ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={ad.image}
                alt=""
                width={16}
                height={16}
                className="h-4 w-4 rounded"
              />
            ) : null}
            <span className="truncate">{ad.text}</span>
            <span aria-hidden="true">→</span>
          </a>
        ))}
      </div>
    </div>
  );
}
