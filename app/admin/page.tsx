"use client";

import { useEffect, useMemo, useState } from "react";
import {
  loadSiteData,
  loadJsonbinConfig,
  saveJsonbinConfig,
  clearLocalData,
  type SiteData,
} from "@/lib/dataLoader";
import { type Site } from "@/lib/sites";
import {
  ADMIN_CONFIG,
  loadAuth,
  saveAuth,
  clearAuth,
  type AdminAuth,
} from "@/lib/adminConfig";
import {
  createBin,
  updateBin,
  verifyApiKey,
  type JsonbinConfig,
} from "@/lib/jsonbin";
import { DEFAULT_ADS, loadAds, saveAds, type AdConfig } from "@/lib/ad";

type View = "sites" | "ads" | "settings";
type LoginStep = "login" | "setup";

export default function AdminPage() {
  const [auth, setAuth] = useState<AdminAuth>({ loggedIn: false, loginAt: null });
  const [data, setData] = useState<SiteData | null>(null);
  const [ads, setAds] = useState<AdConfig[]>(DEFAULT_ADS);
  const [view, setView] = useState<View>("sites");
  const [activeCat, setActiveCat] = useState<string>("");
  const [search, setSearch] = useState("");
  const [toast, setToast] = useState<{ msg: string; type: "success" | "error" } | null>(null);
  const [submitting, setSubmitting] = useState(false);

  // 登录表单
  const [loginStep, setLoginStep] = useState<LoginStep>("login");
  const [loginPwd, setLoginPwd] = useState("");
  const [apiKey, setApiKey] = useState("");
  const [binId, setBinId] = useState("");
  const [loginError, setLoginError] = useState("");
  const [creating, setCreating] = useState(false);

  // 编辑状态
  const [editing, setEditing] = useState<Site | null>(null);
  const [newCat, setNewCat] = useState("");

  useEffect(() => {
    const a = loadAuth();
    setAuth(a);
    if (a.loggedIn) {
      loadSiteData().then(setData);
      setAds(loadAds());
    }
  }, []);

  const notify = (msg: string, type: "success" | "error" = "success") => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3500);
  };

  // 验证并保存配置
  const finishLogin = (config: JsonbinConfig) => {
    saveJsonbinConfig(config);
    const newAuth: AdminAuth = { loggedIn: true, loginAt: Date.now() };
    saveAuth(newAuth);
    setAuth(newAuth);
    loadSiteData().then(setData);
    setAds(loadAds());
    notify("登录成功，数据已从云端加载");
  };

  // 登录（已有 Bin）
  const handleLogin = async () => {
    setLoginError("");
    if (loginPwd !== ADMIN_CONFIG.password) {
      setLoginError("管理密码错误");
      return;
    }
    if (!apiKey.trim()) {
      setLoginError("请输入 jsonbin API Key");
      return;
    }
    if (!binId.trim()) {
      setLoginError("请输入 Bin ID，或点击「首次使用，创建新 Bin」");
      return;
    }
    // 验证 API Key
    const result = await verifyApiKey(apiKey.trim());
    if (!result.valid) {
      setLoginError(`API Key 验证失败：${result.message}`);
      return;
    }
    finishLogin({ binId: binId.trim(), apiKey: apiKey.trim() });
  };

  // 首次使用：创建新 Bin
  const handleCreateBin = async () => {
    setLoginError("");
    setCreating(true);
    try {
      if (loginPwd !== ADMIN_CONFIG.password) {
        setLoginError("管理密码错误");
        return;
      }
      if (!apiKey.trim()) {
        setLoginError("请输入 jsonbin API Key");
        return;
      }
      // 验证 API Key
      const verify = await verifyApiKey(apiKey.trim());
      if (!verify.valid) {
        setLoginError(`API Key 验证失败：${verify.message}`);
        return;
      }
      // 加载本地默认数据作为初始内容
      const defaultData = await loadSiteData();
      const result = await createBin(apiKey.trim(), defaultData, "iosdh-nav-data", false);
      if (!result.success || !result.binId) {
        setLoginError(result.message);
        return;
      }
      notify(`Bin 创建成功：${result.binId}`);
      finishLogin({ binId: result.binId, apiKey: apiKey.trim() });
    } finally {
      setCreating(false);
    }
  };

  // 退出登录
  const handleLogout = () => {
    clearAuth();
    setAuth({ loggedIn: false, loginAt: null });
    setData(null);
    setLoginPwd("");
    setApiKey("");
    setBinId("");
    setLoginStep("login");
    notify("已退出登录");
  };

  const allCats = useMemo(() => (data ? Object.keys(data.categories) : []), [data]);

  useEffect(() => {
    if (allCats.length > 0 && !activeCat) setActiveCat(allCats[0]);
  }, [allCats, activeCat]);

  const filteredSites = useMemo(() => {
    if (!data) return [];
    const q = search.trim().toLowerCase();
    const list = data.categories[activeCat] ?? [];
    if (!q) return list;
    return list.filter(
      (s) =>
        s.name.toLowerCase().includes(q) ||
        s.url.toLowerCase().includes(q) ||
        s.desc.toLowerCase().includes(q)
    );
  }, [data, activeCat, search]);

  // 保存数据到本地（立即生效）
  const commitLocal = (next: SiteData) => {
    setData(next);
    if (typeof window !== "undefined") {
      localStorage.setItem("ttnav_admin_data", JSON.stringify(next));
    }
  };

  const saveSite = (site: Site) => {
    if (!data) return;
    const list = data.categories[activeCat] ?? [];
    let next: SiteData;
    if (editing && editing.id) {
      next = {
        ...data,
        categories: {
          ...data.categories,
          [activeCat]: list.map((s) => (s.id === site.id ? site : s)),
        },
      };
    } else {
      next = {
        ...data,
        categories: {
          ...data.categories,
          [activeCat]: [{ ...site, id: `c_${Date.now()}` }, ...list],
        },
      };
    }
    commitLocal(next);
    setEditing(null);
    notify("已保存（本地生效，需同步到云端）");
  };

  const deleteSite = (id: string) => {
    if (!data) return;
    const list = data.categories[activeCat] ?? [];
    commitLocal({
      ...data,
      categories: { ...data.categories, [activeCat]: list.filter((s) => s.id !== id) },
    });
    notify("已删除");
  };

  const addCategory = () => {
    if (!data) return;
    const name = newCat.trim();
    if (!name || data.categories[name]) return;
    commitLocal({ ...data, categories: { ...data.categories, [name]: [] } });
    setActiveCat(name);
    setNewCat("");
    notify(`已新建分类「${name}」`);
  };

  // 云端同步到 jsonbin
  const handleSyncToCloud = async () => {
    if (!data) return;
    const config = loadJsonbinConfig();
    if (!config) {
      notify("未配置 jsonbin，请重新登录", "error");
      return;
    }
    setSubmitting(true);
    try {
      const result = await updateBin(config, data);
      if (result.success) {
        // 同步成功后清除本地覆盖，让前台直接读云端
        clearLocalData();
        notify("已同步到 jsonbin 云端，所有访客将看到最新数据");
      } else {
        notify(result.message, "error");
      }
    } finally {
      setSubmitting(false);
    }
  };

  // 从云端重新加载
  const handleReloadFromCloud = async () => {
    clearLocalData();
    const d = await loadSiteData();
    setData(d);
    notify("已从云端重新加载数据");
  };

  // 广告位
  const saveAd = (ad: AdConfig) => {
    const next = ads.map((a) => (a.id === ad.id ? ad : a));
    setAds(next);
    saveAds(next);
    notify("广告位已保存");
  };

  const addAd = () => {
    const ad: AdConfig = {
      id: `ad_${Date.now()}`,
      name: "新广告位",
      text: "新广告文案",
      url: "https://example.com",
      enabled: true,
    };
    const next = [...ads, ad];
    setAds(next);
    saveAds(next);
    notify("已新增广告位");
  };

  const deleteAd = (id: string) => {
    const next = ads.filter((a) => a.id !== id);
    setAds(next);
    saveAds(next);
    notify("广告位已删除");
  };

  const exportData = () => {
    if (!data) return;
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "iosdh-nav-data.json";
    a.click();
    URL.revokeObjectURL(url);
  };

  // ========== 登录页 ==========
  if (!auth.loggedIn) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4 py-8">
        <div className="w-full max-w-md">
          <div className="text-center mb-8">
            <div className="h-14 w-14 rounded-2xl bg-[#6366f1] text-white flex items-center justify-center font-bold tracking-tight text-2xl shadow-lg shadow-[#6366f1]/25 mx-auto">
              甜
            </div>
            <h1 className="font-bold tracking-tight text-2xl text-[#0f172a] mt-4">
              甜甜导航 · 管理后台
            </h1>
            <p className="font-sans text-sm text-gray-400 mt-1">
              数据存储在 jsonbin.io 免费云端
            </p>
          </div>

          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 md:p-8 space-y-4">
            {/* 步骤切换 */}
            <div className="flex gap-2 bg-gray-50 rounded-xl p-1">
              <button
                onClick={() => setLoginStep("login")}
                className={`flex-1 rounded-lg py-2 text-sm font-semibold transition-all ${
                  loginStep === "login" ? "bg-white text-[#6366f1] shadow-sm" : "text-gray-400"
                }`}
              >
                已有 Bin
              </button>
              <button
                onClick={() => setLoginStep("setup")}
                className={`flex-1 rounded-lg py-2 text-sm font-semibold transition-all ${
                  loginStep === "setup" ? "bg-white text-[#6366f1] shadow-sm" : "text-gray-400"
                }`}
              >
                首次使用
              </button>
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-500 mb-1.5">管理密码</label>
              <input
                type="password"
                value={loginPwd}
                onChange={(e) => setLoginPwd(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && (loginStep === "login" ? handleLogin() : handleCreateBin())}
                placeholder="请输入管理密码"
                className="w-full bg-white border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#6366f1]/20 focus:border-[#6366f1] transition-all px-4 py-2.5 text-sm"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-500 mb-1.5">
                jsonbin API Key
                <a
                  href="https://jsonbin.io/login"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-[#6366f1] hover:underline ml-1.5 font-normal"
                >
                  去获取 →
                </a>
              </label>
              <input
                type="password"
                value={apiKey}
                onChange={(e) => setApiKey(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && (loginStep === "login" ? handleLogin() : handleCreateBin())}
                placeholder="$2b$10$xxxxxxxxxxxx（在 jsonbin.io 仪表盘复制）"
                className="w-full bg-white border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#6366f1]/20 focus:border-[#6366f1] transition-all px-4 py-2.5 text-sm font-mono"
              />
            </div>

            {loginStep === "login" && (
              <div>
                <label className="block text-xs font-semibold text-gray-500 mb-1.5">Bin ID</label>
                <input
                  type="text"
                  value={binId}
                  onChange={(e) => setBinId(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && handleLogin()}
                  placeholder="65f1a2b3c4d5e6f7a8b9c0d1（在 jsonbin.io 仪表盘复制）"
                  className="w-full bg-white border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#6366f1]/20 focus:border-[#6366f1] transition-all px-4 py-2.5 text-sm font-mono"
                />
              </div>
            )}

            {loginStep === "setup" && (
              <div className="bg-[#6366f1]/5 border border-[#6366f1]/20 rounded-xl p-4">
                <p className="font-sans text-xs text-gray-600 leading-relaxed">
                  <strong className="text-[#6366f1]">首次使用说明：</strong>
                  点击下方按钮将自动在你的 jsonbin 账号中创建一个新的 Bin，
                  并把当前 400 个站点数据作为初始内容上传。
                  创建成功后会自动登录，Bin ID 会保存在本地浏览器。
                </p>
              </div>
            )}

            {loginError && (
              <div className="bg-red-50 border border-red-200 text-red-600 rounded-xl px-4 py-2.5 text-sm">
                {loginError}
              </div>
            )}

            {loginStep === "login" ? (
              <button
                onClick={handleLogin}
                className="w-full rounded-xl font-semibold transition-all duration-300 bg-[#6366f1] text-white shadow-lg shadow-[#6366f1]/25 hover:scale-[1.01] hover:shadow-xl hover:shadow-[#6366f1]/30 active:scale-95 px-6 py-3 text-sm"
              >
                登录后台
              </button>
            ) : (
              <button
                onClick={handleCreateBin}
                disabled={creating}
                className="w-full rounded-xl font-semibold transition-all duration-300 bg-[#6366f1] text-white shadow-lg shadow-[#6366f1]/25 hover:scale-[1.01] hover:shadow-xl hover:shadow-[#6366f1]/30 active:scale-95 px-6 py-3 text-sm disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {creating ? "正在创建 Bin…" : "创建 Bin 并登录"}
              </button>
            )}
          </div>

          <div className="text-center mt-6">
            <a href="/" className="font-sans text-sm text-gray-400 hover:text-[#6366f1] transition-colors">
              ← 返回前台首页
            </a>
          </div>
        </div>
      </div>
    );
  }

  // ========== 管理后台 ==========
  const jsonbinConfig = loadJsonbinConfig();

  return (
    <div className="min-h-screen bg-gray-50 text-[#0f172a] font-sans">
      {/* 顶部 */}
      <header className="bg-[#0f172a] text-white px-4 md:px-6 py-4">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <a href="/" className="flex items-center gap-2">
              <span className="h-8 w-8 rounded-xl bg-[#6366f1] flex items-center justify-center font-bold">甜</span>
              <span className="font-bold tracking-tight">甜甜导航 · 管理后台</span>
            </a>
            <span className="hidden md:inline-block text-xs bg-green-500/20 text-green-400 border border-green-500/30 rounded-lg px-2 py-0.5">
              jsonbin 云端
            </span>
          </div>
          <div className="flex items-center gap-2">
            <a href="/" className="rounded-xl font-semibold transition-all duration-300 bg-white/10 border border-white/20 px-4 py-2 text-sm hover:bg-white/20">
              查看前台
            </a>
            <button
              onClick={handleLogout}
              className="rounded-xl font-semibold transition-all duration-300 bg-white/10 border border-white/20 px-4 py-2 text-sm hover:bg-red-500/30 hover:border-red-500/50"
            >
              退出
            </button>
          </div>
        </div>
      </header>

      {/* toast */}
      {toast && (
        <div
          className={`fixed top-4 right-4 z-50 rounded-xl px-4 py-2.5 text-sm font-semibold shadow-lg ${
            toast.type === "success" ? "bg-[#6366f1] text-white shadow-[#6366f1]/25" : "bg-red-500 text-white shadow-red-500/25"
          }`}
        >
          {toast.msg}
        </div>
      )}

      <div className="max-w-6xl mx-auto px-4 md:px-6 py-8 grid grid-cols-1 md:grid-cols-[220px_1fr] gap-6">
        {/* 侧边栏 */}
        <aside className="space-y-1">
          <button
            onClick={() => setView("sites")}
            className={`w-full text-left rounded-xl px-4 py-3 text-sm font-semibold transition-all duration-200 ${
              view === "sites" ? "bg-[#6366f1] text-white shadow-lg shadow-[#6366f1]/25" : "bg-white border border-gray-200 hover:border-[#6366f1]/40"
            }`}
          >
            📚 站点管理
          </button>
          <button
            onClick={() => setView("ads")}
            className={`w-full text-left rounded-xl px-4 py-3 text-sm font-semibold transition-all duration-200 ${
              view === "ads" ? "bg-[#6366f1] text-white shadow-lg shadow-[#6366f1]/25" : "bg-white border border-gray-200 hover:border-[#6366f1]/40"
            }`}
          >
            📢 广告位管理
          </button>
          <button
            onClick={() => setView("settings")}
            className={`w-full text-left rounded-xl px-4 py-3 text-sm font-semibold transition-all duration-200 ${
              view === "settings" ? "bg-[#6366f1] text-white shadow-lg shadow-[#6366f1]/25" : "bg-white border border-gray-200 hover:border-[#6366f1]/40"
            }`}
          >
            ☁️ 云端同步
          </button>
        </aside>

        {/* 主内容 */}
        <main className="space-y-6">
          {view === "sites" && data && (
            <>
              {/* 分类选择 */}
              <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-4 md:p-6">
                <div className="flex flex-wrap gap-2">
                  {allCats.map((cat) => (
                    <button
                      key={cat}
                      onClick={() => setActiveCat(cat)}
                      className={`rounded-xl px-3 py-1.5 text-sm font-semibold transition-all duration-200 active:scale-95 ${
                        activeCat === cat
                          ? "bg-[#6366f1] text-white shadow-lg shadow-[#6366f1]/25"
                          : "bg-gray-50 border border-gray-200 hover:border-[#6366f1]/40"
                      }`}
                    >
                      {cat} ({data.categories[cat]?.length ?? 0})
                    </button>
                  ))}
                </div>
                <div className="flex gap-2 mt-4">
                  <input
                    value={newCat}
                    onChange={(e) => setNewCat(e.target.value)}
                    placeholder="新建分类名称"
                    className="flex-1 bg-white border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#6366f1]/20 focus:border-[#6366f1] transition-all px-4 py-2 text-sm"
                  />
                  <button
                    onClick={addCategory}
                    className="rounded-xl font-semibold transition-all duration-300 bg-[#6366f1] text-white shadow-lg shadow-[#6366f1]/25 hover:scale-[1.02] px-4 py-2 text-sm active:scale-95"
                  >
                    + 新建分类
                  </button>
                </div>
              </div>

              {/* 搜索 + 新增 */}
              <div className="flex flex-col sm:flex-row gap-3">
                <input
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder={`在「${activeCat}」中搜索站点…`}
                  className="flex-1 bg-white border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#6366f1]/20 focus:border-[#6366f1] transition-all px-4 py-2.5 text-sm"
                />
                <button
                  onClick={() => setEditing({ id: "", name: "", url: "", desc: "" })}
                  className="rounded-xl font-semibold transition-all duration-300 bg-[#6366f1] text-white shadow-lg shadow-[#6366f1]/25 hover:scale-[1.02] px-5 py-2.5 text-sm active:scale-95"
                >
                  + 新增站点
                </button>
              </div>

              {/* 编辑表单 */}
              {editing && (
                <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-4 md:p-6">
                  <h3 className="font-bold tracking-tight text-lg mb-4">
                    {editing.id ? "编辑站点" : "新增站点"}
                    <span className="text-sm font-sans font-normal text-gray-400 ml-2">分类：{activeCat}</span>
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <label className="block">
                      <span className="block text-xs text-gray-400 mb-1.5">站点名称 *</span>
                      <input
                        value={editing.name}
                        onChange={(e) => setEditing({ ...editing, name: e.target.value })}
                        className="w-full bg-white border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#6366f1]/20 focus:border-[#6366f1] transition-all px-4 py-2 text-sm"
                      />
                    </label>
                    <label className="block">
                      <span className="block text-xs text-gray-400 mb-1.5">网址 URL *</span>
                      <input
                        value={editing.url}
                        onChange={(e) => setEditing({ ...editing, url: e.target.value })}
                        placeholder="https://"
                        className="w-full bg-white border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#6366f1]/20 focus:border-[#6366f1] transition-all px-4 py-2 text-sm"
                      />
                    </label>
                    <label className="block md:col-span-2">
                      <span className="block text-xs text-gray-400 mb-1.5">简介（15字左右）</span>
                      <input
                        value={editing.desc}
                        onChange={(e) => setEditing({ ...editing, desc: e.target.value })}
                        className="w-full bg-white border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#6366f1]/20 focus:border-[#6366f1] transition-all px-4 py-2 text-sm"
                      />
                    </label>
                  </div>
                  <div className="flex gap-3 mt-5">
                    <button
                      onClick={() => {
                        if (!editing.name.trim() || !editing.url.trim()) {
                          notify("名称和网址必填", "error");
                          return;
                        }
                        saveSite(editing);
                      }}
                      className="rounded-xl font-semibold transition-all duration-300 bg-[#6366f1] text-white shadow-lg shadow-[#6366f1]/25 hover:scale-[1.02] px-5 py-2 text-sm active:scale-95"
                    >
                      {editing.id ? "保存修改" : "添加站点"}
                    </button>
                    <button
                      onClick={() => setEditing(null)}
                      className="rounded-xl font-semibold transition-all duration-300 bg-white text-[#0f172a] border border-gray-200 px-5 py-2 text-sm active:scale-95"
                    >
                      取消
                    </button>
                  </div>
                </div>
              )}

              {/* 站点列表 */}
              <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-4 md:p-6">
                <h3 className="font-bold tracking-tight text-lg mb-4">
                  「{activeCat}」共 {filteredSites.length} 个站点
                </h3>
                <ul className="divide-y divide-gray-100">
                  {filteredSites.map((s) => (
                    <li key={s.id} className="py-3 flex items-center justify-between gap-3">
                      <div className="min-w-0">
                        <div className="font-semibold text-sm truncate">{s.name}</div>
                        <div className="text-xs text-gray-400 truncate mt-0.5">{s.url} · {s.desc}</div>
                      </div>
                      <div className="flex gap-2 shrink-0">
                        <a
                          href={`/site/${encodeURIComponent(s.id)}/`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="rounded-lg font-semibold transition-all duration-200 bg-gray-50 border border-gray-200 px-3 py-1.5 text-xs hover:border-[#6366f1]/50"
                        >
                          预览
                        </a>
                        <button
                          onClick={() => setEditing({ ...s })}
                          className="rounded-lg font-semibold transition-all duration-200 bg-gray-50 border border-gray-200 px-3 py-1.5 text-xs hover:border-[#6366f1]/50"
                        >
                          编辑
                        </button>
                        <button
                          onClick={() => {
                            if (confirm(`确定删除「${s.name}」？`)) deleteSite(s.id);
                          }}
                          className="rounded-lg font-semibold transition-all duration-200 bg-white border border-gray-200 px-3 py-1.5 text-xs text-red-500 hover:border-red-300"
                        >
                          删除
                        </button>
                      </div>
                    </li>
                  ))}
                  {filteredSites.length === 0 && (
                    <li className="py-10 text-center text-sm text-gray-400">该分类暂无站点</li>
                  )}
                </ul>
              </div>
            </>
          )}

          {view === "ads" && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h2 className="font-bold tracking-tight text-xl">顶部广告位管理</h2>
                <button
                  onClick={addAd}
                  className="rounded-xl font-semibold transition-all duration-300 bg-[#6366f1] text-white shadow-lg shadow-[#6366f1]/25 hover:scale-[1.02] px-4 py-2 text-sm active:scale-95"
                >
                  + 新增广告位
                </button>
              </div>
              <p className="font-sans text-sm text-gray-400">广告显示在首页顶部导航下方，可自定义文案、图片与跳转链接。广告位数据保存在本地浏览器。</p>
              {ads.map((ad) => (
                <div key={ad.id} className="bg-white rounded-2xl shadow-sm border border-gray-100 p-4 md:p-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <label className="block">
                      <span className="block text-xs text-gray-400 mb-1.5">广告名称</span>
                      <input
                        value={ad.name}
                        onChange={(e) => saveAd({ ...ad, name: e.target.value })}
                        className="w-full bg-white border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#6366f1]/20 focus:border-[#6366f1] transition-all px-4 py-2 text-sm"
                      />
                    </label>
                    <label className="block">
                      <span className="block text-xs text-gray-400 mb-1.5">跳转链接</span>
                      <input
                        value={ad.url}
                        onChange={(e) => saveAd({ ...ad, url: e.target.value })}
                        className="w-full bg-white border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#6366f1]/20 focus:border-[#6366f1] transition-all px-4 py-2 text-sm"
                      />
                    </label>
                    <label className="block md:col-span-2">
                      <span className="block text-xs text-gray-400 mb-1.5">广告文案</span>
                      <input
                        value={ad.text}
                        onChange={(e) => saveAd({ ...ad, text: e.target.value })}
                        className="w-full bg-white border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#6366f1]/20 focus:border-[#6366f1] transition-all px-4 py-2 text-sm"
                      />
                    </label>
                    <label className="block md:col-span-2">
                      <span className="block text-xs text-gray-400 mb-1.5">广告图片 URL（可选）</span>
                      <input
                        value={ad.image ?? ""}
                        onChange={(e) => saveAd({ ...ad, image: e.target.value || undefined })}
                        placeholder="https://example.com/banner.png"
                        className="w-full bg-white border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#6366f1]/20 focus:border-[#6366f1] transition-all px-4 py-2 text-sm"
                      />
                    </label>
                  </div>
                  <div className="flex items-center justify-between mt-4">
                    <label className="flex items-center gap-2 text-sm font-sans">
                      <input
                        type="checkbox"
                        checked={ad.enabled}
                        onChange={(e) => saveAd({ ...ad, enabled: e.target.checked })}
                        className="h-4 w-4 rounded border-gray-300 text-[#6366f1] focus:ring-[#6366f1]"
                      />
                      启用
                    </label>
                    <button
                      onClick={() => {
                        if (confirm("确定删除该广告位？")) deleteAd(ad.id);
                      }}
                      className="rounded-xl font-semibold transition-all duration-200 bg-white border border-gray-200 px-4 py-1.5 text-sm text-red-500 hover:border-red-300"
                    >
                      删除
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}

          {view === "settings" && (
            <div className="space-y-4">
              <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
                <h2 className="font-bold tracking-tight text-xl mb-3">云端同步</h2>
                <p className="font-sans text-sm text-gray-400 mb-6 leading-relaxed">
                  数据存储在 <strong className="text-[#0f172a]">jsonbin.io</strong> 免费云端。
                  在「站点管理」中修改后先保存在本地（前台立即生效），
                  确认无误后点击「同步到云端」，所有访客将看到最新数据。
                </p>
                <div className="bg-gray-50 rounded-xl border border-gray-100 p-4 mb-6">
                  <div className="flex items-center justify-between text-sm">
                    <span className="font-sans text-gray-500">云端服务</span>
                    <span className="font-semibold text-[#6366f1]">jsonbin.io（免费）</span>
                  </div>
                  <div className="flex items-center justify-between text-sm mt-2">
                    <span className="font-sans text-gray-500">Bin ID</span>
                    <span className="font-mono text-xs text-gray-400">
                      {jsonbinConfig?.binId ? `${jsonbinConfig.binId.slice(0, 8)}...${jsonbinConfig.binId.slice(-6)}` : "未配置"}
                    </span>
                  </div>
                  <div className="flex items-center justify-between text-sm mt-2">
                    <span className="font-sans text-gray-500">站点总数</span>
                    <span className="font-semibold text-[#6366f1]">
                      {data ? Object.values(data.categories).reduce((n, a) => n + a.length, 0) : 0}
                    </span>
                  </div>
                  <div className="flex items-center justify-between text-sm mt-2">
                    <span className="font-sans text-gray-500">免费额度</span>
                    <span className="font-sans text-xs text-green-600">10000 请求/月</span>
                  </div>
                </div>
                <div className="flex flex-col sm:flex-row gap-3">
                  <button
                    onClick={handleSyncToCloud}
                    disabled={submitting}
                    className="rounded-xl font-semibold transition-all duration-300 bg-[#6366f1] text-white shadow-lg shadow-[#6366f1]/25 hover:scale-[1.02] hover:shadow-xl hover:shadow-[#6366f1]/30 px-6 py-3 text-sm active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {submitting ? "同步中…" : "☁️ 同步到云端（更新线上数据）"}
                  </button>
                  <button
                    onClick={handleReloadFromCloud}
                    className="rounded-xl font-semibold transition-all duration-300 bg-white text-[#0f172a] border border-gray-200 hover:border-[#6366f1]/40 px-6 py-3 text-sm active:scale-95"
                  >
                    🔄 从云端重新加载
                  </button>
                  <button
                    onClick={exportData}
                    className="rounded-xl font-semibold transition-all duration-300 bg-white text-[#0f172a] border border-gray-200 hover:border-[#6366f1]/40 px-6 py-3 text-sm active:scale-95"
                  >
                    💾 导出 JSON 备份
                  </button>
                </div>
              </div>

              <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
                <h3 className="font-bold tracking-tight text-lg mb-3">使用流程</h3>
                <ol className="font-sans text-sm text-gray-500 space-y-2 list-decimal list-inside">
                  <li>在「站点管理」中增删改站点，修改后前台立即生效（本地）</li>
                  <li>确认无误后，到「云端同步」点击「同步到云端」</li>
                  <li>数据上传到 jsonbin.io，所有访客刷新页面即看到最新数据</li>
                  <li>管理密码、API Key 和 Bin ID 保存在本地浏览器，不会上传</li>
                  <li>换浏览器或清除缓存后，用「已有 Bin」模式重新登录即可</li>
                </ol>
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
