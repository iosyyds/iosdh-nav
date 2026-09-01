"use client";

// 后台数据持久化：站点增删改后保存到 localStorage，主页读取时优先使用
import { categories as defaultCategories } from "@/lib/sites";
import type { Site } from "@/lib/sites";

export interface AdminState {
  categories: Record<string, Site[]>;
  lastSavedAt: number | null;
}

export const STORAGE_KEY = "ttnav_admin_data";

export function loadAdminData(): Record<string, Site[]> {
  if (typeof window === "undefined") return defaultCategories;
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (parsed && typeof parsed === "object") {
        // merge: use saved overrides on top of defaults for safety
        const merged: Record<string, Site[]> = {};
        for (const cat of Object.keys(defaultCategories)) {
          merged[cat] = parsed[cat] && Array.isArray(parsed[cat]) ? parsed[cat] : defaultCategories[cat];
        }
        // include any new categories
        for (const cat of Object.keys(parsed)) {
          if (!merged[cat] && Array.isArray(parsed[cat])) merged[cat] = parsed[cat];
        }
        return merged;
      }
    }
  } catch {
    /* ignore */
  }
  return defaultCategories;
}

export function saveAdminData(data: Record<string, Site[]>) {
  if (typeof window === "undefined") return;
  localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
}

export function clearAdminData() {
  if (typeof window === "undefined") return;
  localStorage.removeItem(STORAGE_KEY);
}
