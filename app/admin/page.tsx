"use client";

import { useMemo, useState, useEffect } from "react";
import { categories as defaultCategories, navGroups, type Site } from "@/lib/sites";
import { loadAdminData, saveAdminData, clearAdminData } from "@/lib/adminStore";
import { DEFAULT_ADS, loadAds, saveAds, type AdConfig } from "@/lib/ad";

type View = "sites" | "ads" | "export";

export default function AdminPage() {
  const [data, setData] = useState<Record<string, Site[]>>(defaultCategories);
  const [ads, setAds] = useState<AdConfig[]>(DEFAULT_ADS);
  const [view, setView] = useState<View>("sites");
  const [activeCat, setActiveCat] = useState<string>(Object.keys(defaultCategories)[0] ?? "");
  const [search, setSearch] = useState("");
  const [toast, setToast] = useState("");

  // editing state
  const [editing, setEditing] = useState<Site | null>(null);
  const [newCat, setNewCat] = useState("");

  useEffect(() => {
    setData(loadAdminData());
    setAds(loadAds());
    setActiveCat(Object.keys(loadAdminData())[0] ?? "");
  }, []);

  const notify = (msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(""), 2000);
  };

  const commit = (next: Record<string, Site[]>) => {
    setData(next);
    saveAdminData(next);
    notify("已保存");
  };

  const allCats = useMemo(() => Object.keys(data), [data]);

  const filteredSites = useMemo(() => {
    const q = search.trim().toLowerCase();
    const list = data[activeCat] ?? [];
    if (!q) return list;
    return list.filter(
      (s) =>
        s.name.toLowerCase().includes(q) ||
        s.url.toLowerCase().includes(q) ||
        s.desc.toLowerCase().includes(q)
    );
  }, [data, activeCat, search]);

  const saveSite = (site: Site) => {
    const list = data[activeCat] ?? [];
    if (editing) {
      const next = {
        ...data,
        [activeCat]: list.map((s) => (s.id === site.id ? site : s)),
      };
      commit(next);
      setEditing(null);
    } else {
      const next = {
        ...data,
        [activeCat]: [{ ...site, id: `c_${Date.now()}` }, ...list],
      };
      commit(next);
      setEditing(null);
    }
  };

  const deleteSite = (id: string) => {
    const list = data[activeCat] ?? [];
    commit({ ...data, [activeCat]: list.filter((s) => s.id !== id) });
  };

  const addCategory = () => {
    const name = newCat.trim();
    if (!name || data[name]) return;
    commit({ ...data, [name]: [] });
    setActiveCat(name);
    setNewCat("");
    notify(`已新建分类「${name}」`);
  };

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

  const resetAll = () => {
    if (!confirm("确定重置所有站点数据为默认值？此操作不可撤销。")) return;
    clearAdminData();
    setData(defaultCategories);
    notify("已重置为默认数据");
  };

  const exportData = () => {
    const blob = new Blob([JSON.stringify(data, null, 2)], {
      type: "application/json",
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "iosdh-nav-data.json";
    a.click();
    URL.revokeObjectURL(url);
    notify("数据已导出");
  };

  return (
    <div className="min-h-screen bg-gray-50 text-[#0f172a] font-sans">
      {/* Admin header */}
      <header className="bg-[#0f172a] text-white px-4 md:px-6 py-4">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <a href="/" className="flex items-center gap-2">
              <span className="h-8 w-8 rounded-xl bg-[#6366f1] flex items-center justify-center font-bold">
                甜
              </span>
              <span className="font-bold tracking-tight">甜甜导航 · 管理后台</span>
            </a>
          </div>
          <a
            href="/"
            className="rounded-xl font-semibold transition-all duration-300 bg-white/10 border border-white/20 px-4 py-2 text-sm hover:bg-white/20"
          >
            ← 返回首页
          </a>
        </div>
      </header>

      {/* toast */}
      {toast && (
        <div className="fixed top-4 right-4 z-50 bg-[#6366f1] text-white rounded-xl px-4 py-2.5 text-sm font-semibold shadow-lg shadow-[#6366f1]/25">
          {toast}
        </div>
      )}

      <div className="max-w-6xl mx-auto px-4 md:px-6 py-8 grid grid-cols-1 md:grid-cols-[220px_1fr] gap-6">
        {/* Sidebar */}
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
            onClick={() => setView("export")}
            className={`w-full text-left rounded-xl px-4 py-3 text-sm font-semibold transition-all duration-200 ${
              view === "export" ? "bg-[#6366f1] text-white shadow-lg shadow-[#6366f1]/25" : "bg-white border border-gray-200 hover:border-[#6366f1]/40"
            }`}
          >
            💾 数据导出
          </button>
        </aside>

        {/* Main */}
        <main className="space-y-6">
          {view === "sites" && (
            <>
              {/* Category selector + add */}
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
                      {cat} ({data[cat]?.length ?? 0})
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

              {/* Search + add site */}
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
                <button
                  onClick={resetAll}
                  className="rounded-xl font-semibold transition-all duration-300 bg-white text-[#0f172a] border border-gray-200 px-5 py-2.5 text-sm hover:border-red-300 hover:text-red-500 active:scale-95"
                >
                  重置默认
                </button>
              </div>

              {/* Edit form */}
              {editing && (
                <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-4 md:p-6">
                  <h3 className="font-bold tracking-tight text-lg mb-4">
                    {editing.id ? "编辑站点" : "新增站点"}
                    <span className="text-sm font-sans font-normal text-gray-400 ml-2">
                      分类：{activeCat}
                    </span>
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
                          notify("名称和网址必填");
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

              {/* Sites list */}
              <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-4 md:p-6">
                <h3 className="font-bold tracking-tight text-lg mb-4">
                  「{activeCat}」共 {filteredSites.length} 个站点
                </h3>
                <ul className="divide-y divide-gray-100">
                  {filteredSites.map((s) => (
                    <li
                      key={s.id}
                      className="py-3 flex items-center justify-between gap-3"
                    >
                      <div className="min-w-0">
                        <div className="font-semibold text-sm truncate">{s.name}</div>
                        <div className="text-xs text-gray-400 truncate mt-0.5">
                          {s.url} · {s.desc}
                        </div>
                      </div>
                      <div className="flex gap-2 shrink-0">
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
                    <li className="py-10 text-center text-sm text-gray-400">
                      该分类暂无站点
                    </li>
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
              <p className="font-sans text-sm text-gray-400">
                广告显示在首页顶部导航下方，可自定义文案、图片与跳转链接。
              </p>
              {ads.map((ad) => (
                <div
                  key={ad.id}
                  className="bg-white rounded-2xl shadow-sm border border-gray-100 p-4 md:p-6"
                >
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

          {view === "export" && (
            <div className="space-y-4">
              <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
                <h2 className="font-bold tracking-tight text-xl mb-3">数据导出</h2>
                <p className="font-sans text-sm text-gray-400 mb-6 leading-relaxed">
                  将当前所有站点数据（含后台修改）导出为 JSON 文件，可用于备份或提交到 GitHub 仓库更新线上数据。
                </p>
                <button
                  onClick={exportData}
                  className="rounded-xl font-semibold transition-all duration-300 bg-[#6366f1] text-white shadow-lg shadow-[#6366f1]/25 hover:scale-[1.02] px-6 py-3 text-sm active:scale-95"
                >
                  💾 导出 JSON 数据
                </button>
              </div>
              <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
                <h2 className="font-bold tracking-tight text-xl mb-3">统计信息</h2>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="bg-gray-50 rounded-2xl border border-gray-100 p-4 text-center">
                    <div className="font-bold tracking-tight text-3xl text-[#6366f1]">
                      {Object.values(data).reduce((n, a) => n + a.length, 0)}
                    </div>
                    <div className="text-xs text-gray-400 mt-1">站点总数</div>
                  </div>
                  <div className="bg-gray-50 rounded-2xl border border-gray-100 p-4 text-center">
                    <div className="font-bold tracking-tight text-3xl text-[#6366f1]">
                      {Object.keys(data).length}
                    </div>
                    <div className="text-xs text-gray-400 mt-1">分类总数</div>
                  </div>
                  <div className="bg-gray-50 rounded-2xl border border-gray-100 p-4 text-center">
                    <div className="font-bold tracking-tight text-3xl text-[#6366f1]">
                      {navGroups.length}
                    </div>
                    <div className="text-xs text-gray-400 mt-1">导航分组</div>
                  </div>
                  <div className="bg-gray-50 rounded-2xl border border-gray-100 p-4 text-center">
                    <div className="font-bold tracking-tight text-3xl text-[#6366f1]">
                      {ads.filter((a) => a.enabled).length}
                    </div>
                    <div className="text-xs text-gray-400 mt-1">启用广告位</div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
