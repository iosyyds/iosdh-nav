"use client";

// 后台配置：管理密码 + jsonbin 云端存储配置
// 修改管理密码：改 ADMIN_PASSWORD 即可
export const ADMIN_CONFIG = {
  // 管理后台登录密码（请修改为你自己的密码）
  password: "ttnav2026",
};

export interface AdminAuth {
  loggedIn: boolean;
  loginAt: number | null;
}

const AUTH_KEY = "ttnav_admin_auth";

export function loadAuth(): AdminAuth {
  if (typeof window === "undefined") return { loggedIn: false, loginAt: null };
  try {
    const raw = localStorage.getItem(AUTH_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      // 登录态 7 天有效
      if (parsed.loginAt && Date.now() - parsed.loginAt < 7 * 24 * 3600 * 1000) {
        return parsed as AdminAuth;
      }
    }
  } catch {
    /* ignore */
  }
  return { loggedIn: false, loginAt: null };
}

export function saveAuth(auth: AdminAuth) {
  if (typeof window === "undefined") return;
  localStorage.setItem(AUTH_KEY, JSON.stringify(auth));
}

export function clearAuth() {
  if (typeof window === "undefined") return;
  localStorage.removeItem(AUTH_KEY);
}
