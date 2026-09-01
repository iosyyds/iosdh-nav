"use client";

// 云端数据加载器：jsonbin.io 免费 JSON 存储
// 优先级：后台本地修改 > jsonbin 云端 > 本地默认 JSON > 离线缓存
import type { Site, NavGroup } from "@/lib/sites";
import { readBin, type JsonbinConfig } from "@/lib/jsonbin";

export interface SiteData {
  navGroups: NavGroup[];
  categories: Record<string, Site[]>;
}

const LOCAL_KEY = "ttnav_admin_data";
const CACHE_KEY = "ttnav_remote_cache";
const CONFIG_KEY = "ttnav_jsonbin_config";

// 从 localStorage 读取 jsonbin 配置（后台登录时保存）
export function loadJsonbinConfig(): JsonbinConfig | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = localStorage.getItem(CONFIG_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (parsed && parsed.binId && parsed.apiKey) return parsed as JsonbinConfig;
    }
  } catch {
    /* ignore */
  }
  return null;
}

export function saveJsonbinConfig(config: JsonbinConfig) {
  if (typeof window === "undefined") return;
  localStorage.setItem(CONFIG_KEY, JSON.stringify(config));
}

export async function loadSiteData(): Promise<SiteData> {
  // 1. 后台本地修改优先（用户刚编辑过，立即看到效果）
  if (typeof window !== "undefined") {
    try {
      const raw = localStorage.getItem(LOCAL_KEY);
      if (raw) {
        const parsed = JSON.parse(raw);
        const hasSites = parsed && parsed.categories && Object.keys(parsed.categories).length > 0 &&
          Object.values(parsed.categories).some((arr: any) => arr && arr.length > 0);
        if (parsed && parsed.navGroups && parsed.navGroups.length > 0 && hasSites) {
          return parsed as SiteData;
        }
      }
    } catch {
      /* ignore */
    }
  }

  // 2. 从 jsonbin 云端读取（如果已配置）
  const config = loadJsonbinConfig();
  if (config && config.binId) {
    try {
      const data = (await readBin(config)) as SiteData;
      // 检查数据有效性：必须有分组和至少一个分类有站点
      const hasSites = data && data.categories && Object.keys(data.categories).length > 0 &&
        Object.values(data.categories).some(arr => arr && arr.length > 0);
      if (data && data.navGroups && data.navGroups.length > 0 && hasSites) {
        // 缓存到 localStorage 作为离线兜底
        if (typeof window !== "undefined") {
          try {
            localStorage.setItem(CACHE_KEY, JSON.stringify(data));
          } catch {
            /* ignore */
          }
        }
        return data;
      }
    } catch {
      /* 云端读取失败，继续用兜底 */
    }
  }

  // 3. fetch 本地默认 JSON（打包在站点里）
  try {
    const basePath = (process.env.NEXT_PUBLIC_BASE_PATH as string) || "";
    const res = await fetch(`${basePath}/data/sites.json?t=${Date.now()}`, {
      cache: "no-store",
    });
    if (res.ok) {
      const data = (await res.json()) as SiteData;
      const hasSites = data && data.categories && Object.keys(data.categories).length > 0 &&
        Object.values(data.categories).some(arr => arr && arr.length > 0);
      if (data && data.navGroups && data.navGroups.length > 0 && hasSites) {
        if (typeof window !== "undefined") {
          try {
            localStorage.setItem(CACHE_KEY, JSON.stringify(data));
          } catch {
            /* ignore */
          }
        }
        return data;
      }
    }
  } catch {
    /* ignore */
  }

  // 4. 离线缓存兜底
  if (typeof window !== "undefined") {
    try {
      const raw = localStorage.getItem(CACHE_KEY);
      if (raw) {
        const parsed = JSON.parse(raw);
        const hasSites = parsed && parsed.categories && Object.keys(parsed.categories).length > 0 &&
          Object.values(parsed.categories).some((arr: any) => arr && arr.length > 0);
        if (parsed && parsed.navGroups && parsed.navGroups.length > 0 && hasSites) {
          return parsed as SiteData;
        }
      }
    } catch {
      /* ignore */
    }
  }

  // 5. 最终兜底：空数据
  return { navGroups: [], categories: {} };
}

// 清除本地修改（恢复云端数据）
export function clearLocalData() {
  if (typeof window === "undefined") return;
  localStorage.removeItem(LOCAL_KEY);
}
