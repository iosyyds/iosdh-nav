// 广告位配置（顶部广告位，可通过 /admin 后台修改并持久化到 localStorage）
export interface AdConfig {
  id: string;
  name: string;
  image?: string; // 图片 URL
  text: string; // 广告文案
  url: string; // 跳转链接
  enabled: boolean;
}

export const DEFAULT_ADS: AdConfig[] = [
  {
    id: "top-banner",
    name: "顶部广告位",
    text: "📢 广告位招租 · 本站日均 400+ 站点曝光，欢迎合作",
    url: "https://github.com/iosyyds/iosdh-nav",
    enabled: true,
  },
];

// 从 localStorage 读取广告配置（后台可编辑），无则用默认
export function loadAds(): AdConfig[] {
  if (typeof window === "undefined") return DEFAULT_ADS;
  try {
    const raw = localStorage.getItem("ttnav_ads");
    if (raw) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed) && parsed.length >= 0) return parsed;
    }
  } catch {
    /* ignore */
  }
  return DEFAULT_ADS;
}

export function saveAds(ads: AdConfig[]) {
  if (typeof window === "undefined") return;
  localStorage.setItem("ttnav_ads", JSON.stringify(ads));
}
