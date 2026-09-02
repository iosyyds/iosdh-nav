"use client";
import { useEffect, useMemo, useState } from "react";
import { type Site } from "@/lib/sites";
import SiteCard from "@/components/SiteCard";
import TopAd from "@/components/TopAd";
import AnimatedLogo from "@/components/AnimatedLogo";
import { loadSiteData, type SiteData } from "@/lib/dataLoader";

export default function Home() {
  const [data, setData] = useState<SiteData | null>(null);
  const [query, setQuery] = useState("");
  const [activeGroup, setActiveGroup] = useState("all");
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [expandedGroups, setExpandedGroups] = useState<Set<string>>(new Set());

  // 加载数据 + 自动同步（每3分钟检查）
  useEffect(() => {
    loadSiteData().then(setData);
    const timer = setInterval(() => {
      loadSiteData().then((newData) => {
        setData((prev) => {
          if (!prev) return newData;
          const prevStr = JSON.stringify(prev.categories);
          const newStr = JSON.stringify(newData.categories);
          return prevStr !== newStr ? newData : prev;
        });
      });
    }, 3 * 60 * 1000);
    return () => clearInterval(timer);
  }, []);

  const categories = data?.categories ?? {};
  const navGroups = data?.navGroups ?? [];

  const TOTAL = useMemo(
    () => Object.values(categories).reduce((n, c) => n + c.length, 0),
    [categories]
  );

  // 搜索过滤
  const filteredCategories = useMemo(() => {
    if (!query.trim()) return categories;
    const q = query.toLowerCase();
    const result: Record<string, Site[]> = {};
    for (const [cat, sites] of Object.entries(categories)) {
      const matched = sites.filter(
        (s) =>
          s.name.toLowerCase().includes(q) ||
          (s.desc && s.desc.toLowerCase().includes(q)) ||
          s.url.toLowerCase().includes(q)
      );
      if (matched.length > 0) result[cat] = matched;
    }
    return result;
  }, [categories, query]);

  // 按分组过滤分类
  const visibleGroups = useMemo(() => {
    if (activeGroup === "all") return navGroups;
    return navGroups.filter((g) => g.id === activeGroup);
  }, [navGroups, activeGroup]);

  const scrollTo = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
  };

  const toggleGroup = (groupId: string) => {
    setExpandedGroups((prev) => {
      const next = new Set(prev);
      if (next.has(groupId)) next.delete(groupId);
      else next.add(groupId);
      return next;
    });
  };

  return (
    <div className="min-h-screen bg-gray-50 text-gray-900 font-sans">
      {/* 顶部导航 */}
      <header className="sticky top-0 z-50 bg-white/90 backdrop-blur-lg border-b border-gray-100">
        <div className="max-w-6xl mx-auto px-4 h-14 flex items-center justify-between gap-3">
          <a href="#" className="flex items-center gap-2 min-w-0">
            <AnimatedLogo size="sm" />
            <span className="font-bold text-base truncate">甜甜导航</span>
          </a>

          {/* 桌面导航 */}
          <nav className="hidden md:flex items-center gap-6 text-sm text-gray-500">
            <button onClick={() => scrollTo("groups")} className="hover:text-gray-900 transition-colors">全部收录</button>
            <a href="/admin" className="px-3 py-1.5 rounded-lg border border-gray-200 hover:border-indigo-300 hover:text-indigo-600 transition-colors">管理后台</a>
          </nav>

          {/* 手机按钮组 */}
          <div className="flex items-center gap-2">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden w-9 h-9 rounded-lg border border-gray-200 flex items-center justify-center hover:border-indigo-300 active:scale-95 transition-all"
              aria-label="菜单"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                {mobileMenuOpen ? (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                )}
              </svg>
            </button>
            <a
              href="#groups"
              className="h-9 px-3 rounded-lg bg-indigo-500 text-white text-xs font-semibold flex items-center hover:bg-indigo-600 active:scale-95 transition-all md:px-4 md:text-sm"
            >
              开始浏览
            </a>
          </div>
        </div>

        {/* 手机展开菜单 */}
        {mobileMenuOpen && (
          <div className="md:hidden border-t border-gray-100 bg-white px-4 py-2 space-y-1">
            <button onClick={() => { scrollTo("groups"); setMobileMenuOpen(false); }} className="block w-full text-left px-3 py-2.5 rounded-lg text-sm text-gray-600 hover:bg-gray-50">全部收录</button>
            <a href="/admin" onClick={() => setMobileMenuOpen(false)} className="block w-full text-left px-3 py-2.5 rounded-lg text-sm font-semibold text-indigo-600 hover:bg-indigo-50">管理后台</a>
          </div>
        )}
      </header>

      {/* Hero 区域 */}
      <section className="bg-gradient-to-b from-white to-gray-50 px-4 pt-8 pb-6">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-2xl md:text-4xl font-bold tracking-tight bg-gradient-to-r from-gray-900 to-gray-600 bg-clip-text text-transparent">
            精选优质网站导航
          </h1>
          <p className="mt-2 text-sm md:text-base text-gray-500">
            收录 {TOTAL}+ 优质网站，iOS 资源、AI 工具、设计素材一网打尽
          </p>

          {/* 搜索框 */}
          <div className="mt-5 max-w-xl mx-auto">
            <div className="relative">
              <svg className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
              <input
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="搜索网站名称、描述..."
                className="w-full h-11 pl-10 pr-4 rounded-xl border border-gray-200 bg-white text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all shadow-sm"
              />
              {query && (
                <button
                  onClick={() => setQuery("")}
                  className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 rounded-full bg-gray-100 flex items-center justify-center hover:bg-gray-200"
                >
                  <svg className="w-3 h-3 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              )}
            </div>
          </div>

          {/* 统计数据 */}
          <div className="mt-5 flex items-center justify-center gap-6 md:gap-10">
            <div className="text-center">
              <div className="text-xl md:text-2xl font-bold text-indigo-600">{TOTAL}</div>
              <div className="text-xs text-gray-400 mt-0.5">收录站点</div>
            </div>
            <div className="w-px h-8 bg-gray-200" />
            <div className="text-center">
              <div className="text-xl md:text-2xl font-bold text-cyan-600">{Object.keys(categories).length}</div>
              <div className="text-xs text-gray-400 mt-0.5">细分分类</div>
            </div>
            <div className="w-px h-8 bg-gray-200" />
            <div className="text-center">
              <div className="text-xl md:text-2xl font-bold text-pink-600">{navGroups.length}</div>
              <div className="text-xs text-gray-400 mt-0.5">大板块</div>
            </div>
          </div>
        </div>
      </section>

      {/* 广告位 */}
      <TopAd />

      {/* 分组筛选标签 */}
      <section className="bg-white border-y border-gray-100 px-4 py-3">
        <div className="max-w-6xl mx-auto flex items-center gap-2 overflow-x-auto pb-1 -mx-4 px-4 scrollbar-hide">
          <button
            onClick={() => setActiveGroup("all")}
            className={`shrink-0 h-8 px-3 rounded-lg text-xs font-semibold transition-all ${
              activeGroup === "all"
                ? "bg-indigo-500 text-white shadow-sm"
                : "bg-gray-50 text-gray-600 border border-gray-100 hover:border-indigo-200"
            }`}
          >
            全部
          </button>
          {navGroups.map((g) => (
            <button
              key={g.id}
              onClick={() => setActiveGroup(g.id)}
              className={`shrink-0 h-8 px-3 rounded-lg text-xs font-semibold transition-all ${
                activeGroup === g.id
                  ? "bg-indigo-500 text-white shadow-sm"
                  : "bg-gray-50 text-gray-600 border border-gray-100 hover:border-indigo-200"
              }`}
            >
              {g.icon} {g.name}
            </button>
          ))}
        </div>
      </section>

      {/* 分组内容 */}
      <main id="groups" className="max-w-6xl mx-auto px-4 py-6 space-y-8">
        {visibleGroups.map((group) => {
          const groupSites: Site[] = [];
          const groupCats = group.cats || [];
          for (const catName of groupCats) {
            if (filteredCategories[catName]) {
              groupSites.push(...filteredCategories[catName]);
            }
          }
          if (groupSites.length === 0) return null;

          const isExpanded = expandedGroups.has(group.id);
          const displaySites = isExpanded ? groupSites : groupSites.slice(0, 8);

          return (
            <section key={group.id} id={`group-${group.id}`}>
              {/* 分组标题 */}
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2.5">
                  <span className="w-8 h-8 rounded-lg bg-gradient-to-br from-indigo-500 to-purple-500 flex items-center justify-center text-base shadow-sm">
                    {group.icon}
                  </span>
                  <div>
                    <h2 className="text-base md:text-lg font-bold">{group.name}</h2>
                    <p className="text-xs text-gray-400 hidden md:block">{group.desc}</p>
                  </div>
                </div>
                <span className="text-xs text-gray-400 bg-gray-100 px-2 py-1 rounded-lg">
                  {groupSites.length} 个
                </span>
              </div>

              {/* 站点卡片网格 */}
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
                {displaySites.map((site) => {
                  let catName = "";
                  for (const [c, sites] of Object.entries(filteredCategories)) {
                    if (sites.find((s) => s.id === site.id)) {
                      catName = c;
                      break;
                    }
                  }
                  return <SiteCard key={site.id} site={site} category={catName} />;
                })}
              </div>

              {/* 查看更多 */}
              {groupSites.length > 8 && (
                <div className="mt-4 text-center">
                  <button
                    onClick={() => toggleGroup(group.id)}
                    className="h-9 px-5 rounded-lg border border-gray-200 bg-white text-xs font-semibold text-gray-600 hover:border-indigo-300 hover:text-indigo-600 active:scale-95 transition-all inline-flex items-center gap-1.5"
                  >
                    {isExpanded ? "收起" : `查看更多 (${groupSites.length - 8})`}
                    <svg className={`w-3.5 h-3.5 transition-transform ${isExpanded ? "rotate-180" : ""}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </button>
                </div>
              )}
            </section>
          );
        })}

        {/* 搜索无结果 */}
        {query && Object.keys(filteredCategories).length === 0 && (
          <div className="text-center py-16">
            <div className="w-16 h-16 rounded-2xl bg-gray-100 flex items-center justify-center mx-auto text-2xl">🔍</div>
            <h3 className="mt-4 font-bold text-lg">未找到相关网站</h3>
            <p className="mt-1 text-sm text-gray-400">试试其他关键词，或浏览全部收录</p>
            <button
              onClick={() => setQuery("")}
              className="mt-4 h-9 px-5 rounded-lg bg-indigo-500 text-white text-xs font-semibold hover:bg-indigo-600 active:scale-95 transition-all"
            >
              清除搜索
            </button>
          </div>
        )}
      </main>

      {/* 页脚 */}
      <footer id="footer" className="bg-white border-t border-gray-100 mt-8">
        <div className="max-w-6xl mx-auto px-4 py-8">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <AnimatedLogo size="sm" />
              <span className="font-bold text-sm">甜甜导航</span>
            </div>
            <p className="text-xs text-gray-400 text-center">
              © {new Date().getFullYear()} 甜甜导航 · 专业 iOS 资源导航站 · eqkk.top
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
