"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { type NavGroup, type Site } from "@/lib/sites";
import SearchBox from "@/components/SearchBox";
import SiteCard from "@/components/SiteCard";
import TopAd from "@/components/TopAd";
import AnimatedLogo from "@/components/AnimatedLogo";
import { loadSiteData, type SiteData } from "@/lib/dataLoader";

// 分组主题色映射
const GROUP_THEMES: Record<string, { gradient: string; glow: string; text: string }> = {
  ios: { gradient: "from-[#6366f1] to-[#8b5cf6]", glow: "shadow-[#6366f1]/30", text: "text-[#6366f1]" },
  "other-pan": { gradient: "from-[#06b6d4] to-[#0ea5e9]", glow: "shadow-[#06b6d4]/30", text: "text-[#06b6d4]" },
  ai: { gradient: "from-[#ec4899] to-[#a855f7]", glow: "shadow-[#ec4899]/30", text: "text-[#ec4899]" },
  cloud: { gradient: "from-[#10b981] to-[#14b8a6]", glow: "shadow-[#10b981]/30", text: "text-[#10b981]" },
  shop: { gradient: "from-[#f59e0b] to-[#f97316]", glow: "shadow-[#f59e0b]/30", text: "text-[#f59e0b]" },
  news: { gradient: "from-[#3b82f6] to-[#06b6d4]", glow: "shadow-[#3b82f6]/30", text: "text-[#3b82f6]" },
  tools: { gradient: "from-[#8b5cf6] to-[#ec4899]", glow: "shadow-[#8b5cf6]/30", text: "text-[#8b5cf6]" },
  assets: { gradient: "from-[#0ea5e9] to-[#6366f1]", glow: "shadow-[#0ea5e9]/30", text: "text-[#0ea5e9]" },
  ued: { gradient: "from-[#ef4444] to-[#f59e0b]", glow: "shadow-[#ef4444]/30", text: "text-[#ef4444]" },
};

const DEFAULT_THEME = { gradient: "from-[#6366f1] to-[#8b5cf6]", glow: "shadow-[#6366f1]/30", text: "text-[#6366f1]" };

// 每个分组默认展示的站点数，超过则折叠
const DEFAULT_VISIBLE = 10;

export default function Home() {
  const [data, setData] = useState<SiteData | null>(null);
  const [query, setQuery] = useState("");
  const [activeGroup, setActiveGroup] = useState<string>("all");
  const [expanded, setExpanded] = useState<Record<string, boolean>>({});
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const resultRef = useRef<HTMLDivElement>(null);

  // 加载云端数据
  useEffect(() => {
    loadSiteData().then(setData);
  }, []);

  const categories = data?.categories ?? {};
  const navGroups = data?.navGroups ?? [];
  const TOTAL = useMemo(
    () => Object.values(categories).reduce((n, c) => n + c.length, 0),
    [categories]
  );
  const totalCats = Object.keys(categories).length;
  const q = query.trim().toLowerCase();

  const filtered: { group: NavGroup; sites: { site: Site; cat: string }[] }[] =
    useMemo(() => {
      if (!data) return [];
      return navGroups
        .filter((g) => activeGroup === "all" || g.id === activeGroup)
        .map((g) => {
          const items: { site: Site; cat: string }[] = [];
          for (const c of g.cats) {
            for (const s of categories[c] ?? []) {
              items.push({ site: s, cat: c });
            }
          }
          const matched = q
            ? items.filter(
                ({ site }) =>
                  site.name.toLowerCase().includes(q) ||
                  site.url.toLowerCase().includes(q) ||
                  site.desc.toLowerCase().includes(q)
              )
            : items;
          return { group: g, sites: matched };
        })
        .filter((x) => x.sites.length > 0);
    }, [activeGroup, q, categories, navGroups, data]);

  const matchedCount = filtered.reduce((n, x) => n + x.sites.length, 0);

  const handleSearch = (v: string) => {
    setQuery(v);
    setActiveGroup("all");
    // 搜索时自动展开所有分组
    setExpanded({});
    requestAnimationFrame(() => {
      resultRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
    });
  };

  const scrollTo = (id: string) => {
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  const toggleExpand = (groupId: string) => {
    setExpanded((prev) => ({ ...prev, [groupId]: !prev[groupId] }));
  };

  // 加载中
  if (!data) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="h-10 w-10 rounded-xl bg-[#6366f1] animate-pulse mx-auto" />
          <p className="font-sans text-sm text-gray-400 mt-4">正在加载站点数据…</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col flex-1">
      {/* 顶部广告位 */}
      <TopAd />

      {/* 顶部导航：左上 Logo，右上 导航 + 首要 CTA（Z 点 1/2） */}
      <header className="sticky top-0 z-50 bg-white/95 backdrop-blur border border-gray-200 px-4 md:px-6 lg:px-8">
        <div className="flex items-center justify-between max-w-6xl mx-auto gap-4 md:gap-6 h-16">
          <a href="#" className="flex items-center gap-2.5">
            <AnimatedLogo size="md" />
          </a>
          <nav
            className="hidden md:flex items-center gap-6 font-sans text-sm text-gray-600"
            aria-label="主导航"
          >
            <button
              onClick={() => scrollTo("featured")}
              className="hover:text-[#0f172a] transition-colors"
            >
              热门网址
            </button>
            <button
              onClick={() => scrollTo("all-groups")}
              className="hover:text-[#0f172a] transition-colors"
            >
              全部收录
            </button>
            <button
              onClick={() => scrollTo("footer")}
              className="hover:text-[#0f172a] transition-colors"
            >
              关于本站
            </button>
            <a
              href="/admin"
              className="rounded-xl font-semibold transition-all duration-300 bg-white text-[#0f172a] border border-gray-200 px-3 py-1.5 text-sm hover:border-[#6366f1]/50 hover:text-[#6366f1]"
            >
              管理后台
            </a>
          </nav>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden rounded-xl font-semibold transition-all duration-300 bg-white text-[#0f172a] border border-gray-200 p-2 hover:border-[#6366f1]/50 active:scale-95"
              aria-label="菜单"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                {mobileMenuOpen ? (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                )}
              </svg>
            </button>
            <a
              href="#all-groups"
              className="rounded-xl font-semibold transition-all duration-300 bg-[#6366f1] text-white shadow-lg shadow-[#6366f1]/25 hover:scale-[1.02] hover:shadow-xl hover:shadow-[#6366f1]/30 active:scale-95 px-3 md:px-5 py-2 text-xs md:text-base"
            >
              开始浏览
            </a>
          </div>
        </div>
        {/* 手机展开菜单 */}
        {mobileMenuOpen && (
          <div className="md:hidden border-t border-gray-100 bg-white px-4 py-3 space-y-1">
            <button
              onClick={() => { scrollTo("featured"); setMobileMenuOpen(false); }}
              className="block w-full text-left rounded-xl px-4 py-2.5 text-sm font-sans text-gray-600 hover:bg-gray-50 hover:text-[#6366f1] transition-colors"
            >
              热门网址
            </button>
            <button
              onClick={() => { scrollTo("all-groups"); setMobileMenuOpen(false); }}
              className="block w-full text-left rounded-xl px-4 py-2.5 text-sm font-sans text-gray-600 hover:bg-gray-50 hover:text-[#6366f1] transition-colors"
            >
              全部收录
            </button>
            <button
              onClick={() => { scrollTo("footer"); setMobileMenuOpen(false); }}
              className="block w-full text-left rounded-xl px-4 py-2.5 text-sm font-sans text-gray-600 hover:bg-gray-50 hover:text-[#6366f1] transition-colors"
            >
              关于本站
            </button>
            <a
              href="/admin"
              onClick={() => setMobileMenuOpen(false)}
              className="block w-full text-left rounded-xl px-4 py-2.5 text-sm font-semibold text-[#6366f1] hover:bg-[#6366f1]/5 transition-colors"
            >
              管理后台
            </a>
          </div>
        )}
      </header>

      {/* Hero：中间对角线区域 = 核心价值主张（Z 点 3） */}
      <section
        id="featured"
        className="relative bg-white text-[#0f172a] py-12 md:py-16 lg:py-20 px-4 md:px-6 lg:px-8 overflow-hidden"
      >
        <div
          className="pointer-events-none absolute -top-24 -right-24 h-72 w-72 rounded-full bg-[#6366f1]/10 blur-3xl"
          aria-hidden="true"
        />
        <div
          className="pointer-events-none absolute -bottom-24 -left-24 h-72 w-72 rounded-full bg-[#06b6d4]/10 blur-3xl"
          aria-hidden="true"
        />
        <div className="relative max-w-4xl mx-auto text-center">
          <span className="inline-block bg-[#6366f1]/10 text-[#6366f1] border border-[#6366f1]/20 rounded-xl px-3 py-1 text-xs font-semibold mb-5">
            ✦ 专业 iOS 资源导航 · 持续更新
          </span>
          <h1 className="font-bold tracking-tight text-3xl sm:text-4xl md:text-5xl lg:text-6xl">
            专业 iOS 资源导航站
          </h1>
          <p className="font-sans text-sm sm:text-base md:text-lg text-gray-600 max-w-2xl mx-auto mt-4 md:mt-5 leading-relaxed">
            精选 {TOTAL} 个优质网站，覆盖 iOS 网盘、巨魔商店 IPA、快捷指令、
            签名工具、AI 工具与设计资源，一键直达。
          </p>
          <div className="mt-8">
            <SearchBox onSearch={handleSearch} />
          </div>
          {/* stats row */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-2 md:gap-3 mt-8 md:mt-10 max-w-2xl mx-auto">
            <div className="bg-gray-50 rounded-2xl border border-gray-100 p-3 md:p-4 text-center">
              <div className="font-bold tracking-tight text-xl md:text-2xl lg:text-3xl text-[#6366f1]">
                {TOTAL}
              </div>
              <div className="font-sans text-xs text-gray-400 mt-1">收录站点</div>
            </div>
            <div className="bg-gray-50 rounded-2xl border border-gray-100 p-3 md:p-4 text-center">
              <div className="font-bold tracking-tight text-xl md:text-2xl lg:text-3xl text-[#06b6d4]">
                {totalCats}
              </div>
              <div className="font-sans text-xs text-gray-400 mt-1">细分分类</div>
            </div>
            <div className="bg-gray-50 rounded-2xl border border-gray-100 p-3 md:p-4 text-center">
              <div className="font-bold tracking-tight text-xl md:text-2xl lg:text-3xl text-[#f59e0b]">
                {navGroups.length}
              </div>
              <div className="font-sans text-xs text-gray-400 mt-1">大板块</div>
            </div>
            <div className="bg-gray-50 rounded-2xl border border-gray-100 p-3 md:p-4 text-center">
              <div className="font-bold tracking-tight text-xl md:text-2xl lg:text-3xl text-[#10b981]">
                24h
              </div>
              <div className="font-sans text-xs text-gray-400 mt-1">免费开放</div>
            </div>
          </div>
        </div>
      </section>

      {/* 分类筛选：快速定位 */}
      <section className="bg-gray-50 text-[#0f172a] py-6 md:py-8 px-4 md:px-6 lg:px-8 border-y border-gray-100">
        <div className="max-w-6xl mx-auto">
          <div className="flex md:flex-wrap items-center justify-start md:justify-center gap-2 md:gap-3 overflow-x-auto pb-2 md:pb-0 -mx-4 px-4 md:mx-0 md:px-0 scrollbar-hide">
            <button
              onClick={() => setActiveGroup("all")}
              className={`rounded-xl font-semibold transition-all duration-300 px-4 py-2 text-sm active:scale-95 ${
                activeGroup === "all"
                  ? "bg-[#6366f1] text-white shadow-lg shadow-[#6366f1]/25"
                  : "bg-white text-[#0f172a] border border-gray-200 hover:-translate-y-0.5 hover:shadow-md"
              }`}
            >
              全部
            </button>
            {navGroups.map((g) => (
              <button
                key={g.id}
                onClick={() => {
                  setActiveGroup(g.id);
                  setQuery("");
                }}
                className={`rounded-xl font-semibold transition-all duration-300 px-4 py-2 text-sm active:scale-95 ${
                  activeGroup === g.id
                    ? "bg-[#6366f1] text-white shadow-lg shadow-[#6366f1]/25"
                    : "bg-white text-[#0f172a] border border-gray-200 hover:-translate-y-0.5 hover:shadow-md"
                }`}
              >
                {g.icon} {g.name}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* 结果区 */}
      <section
        id="all-groups"
        ref={resultRef}
        className="bg-gray-50 text-[#0f172a] py-12 md:py-16 lg:py-20 px-4 md:px-6 lg:px-8 scroll-mt-20"
      >
        <div className="max-w-6xl mx-auto space-y-14 md:space-y-20">
          {q && (
            <div className="text-center">
              <h2 className="font-bold tracking-tight text-2xl md:text-3xl">
                搜索「{query}」
              </h2>
              <p className="font-sans text-sm text-gray-400 mt-2">
                找到 {matchedCount} 个相关站点
              </p>
            </div>
          )}
          {filtered.map(({ group, sites }) => {
            const theme = GROUP_THEMES[group.id] || DEFAULT_THEME;
            const isExpanded = !!expanded[group.id] || !!q;
            const visibleSites = isExpanded ? sites : sites.slice(0, DEFAULT_VISIBLE);
            const hiddenCount = sites.length - DEFAULT_VISIBLE;
            return (
              <div key={group.id} id={`group-${group.id}`} className="scroll-mt-20">
                <div className="flex items-center justify-between gap-2 md:gap-4 mb-4 md:mb-8">
                  <div className="flex items-center gap-2 md:gap-4 min-w-0">
                    {/* 渐变图标容器 */}
                    <div className={`h-11 w-11 md:h-16 md:w-16 rounded-xl md:rounded-2xl bg-gradient-to-br ${theme.gradient} flex items-center justify-center text-lg md:text-3xl shadow-lg ${theme.glow} shrink-0`}>
                      {group.icon}
                    </div>
                    <div className="min-w-0">
                      <h2 className="font-bold tracking-tight text-lg md:text-3xl text-[#0f172a] truncate">
                        {group.name}
                      </h2>
                      <p className="font-sans text-xs md:text-sm text-gray-400 mt-0.5 md:mt-1 truncate">{group.desc}</p>
                    </div>
                  </div>
                  {/* 站点数徽章 */}
                  <div className={`bg-gradient-to-r ${theme.gradient} text-white rounded-lg md:rounded-xl px-2.5 md:px-4 py-1.5 md:py-2 shadow-lg ${theme.glow} shrink-0`}>
                    <span className="font-bold text-sm md:text-lg">{sites.length}</span>
                    <span className="font-sans text-[10px] md:text-xs ml-0.5 md:ml-1 opacity-90">个站点</span>
                  </div>
                </div>
                {/* 分组装饰线 */}
                <div className={`h-1 w-12 md:w-16 rounded-full bg-gradient-to-r ${theme.gradient} mb-4 md:mb-8`} />
                <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-2 md:gap-3 lg:gap-4">
                  {visibleSites.map(({ site, cat }) => (
                    <SiteCard key={site.id} site={site} category={cat} />
                  ))}
                </div>
                {/* 查看更多 / 收起 */}
                {hiddenCount > 0 && (
                  <div className="flex justify-center mt-6">
                    <button
                      onClick={() => toggleExpand(group.id)}
                      className="rounded-xl font-semibold transition-all duration-300 bg-white text-[#6366f1] border border-[#6366f1]/30 px-6 py-2.5 text-sm hover:scale-[1.02] hover:bg-[#6366f1] hover:text-white hover:shadow-lg hover:shadow-[#6366f1]/25 active:scale-95"
                    >
                      {isExpanded
                        ? "收起 ↑"
                        : `查看更多（还有 ${hiddenCount} 个）↓`}
                    </button>
                  </div>
                )}
              </div>
            );
          })}
          {filtered.length === 0 && (
            <div className="text-center py-16">
              <h3 className="font-bold tracking-tight text-xl text-[#0f172a]">
                没有找到相关站点
              </h3>
              <p className="font-sans text-sm text-gray-400 mt-2">
                换个关键词试试，或点击上方分类浏览
              </p>
            </div>
          )}
        </div>
      </section>

      {/* 底部转化区：左下信任标识 + 右下最终 CTA（Z 点 4/5） */}
      <section className="bg-white text-[#0f172a] py-12 md:py-16 lg:py-20 px-4 md:px-6 lg:px-8 border-t border-gray-100">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-8">
          <div className="text-center md:text-left">
            <h2 className="font-bold tracking-tight text-2xl md:text-3xl">
              收藏即达，永不迷路
            </h2>
            <p className="font-sans text-sm text-gray-600 mt-2 max-w-md mx-auto md:mx-0">
              甜甜导航持续收录优质 iOS 与设计资源站点，免费开放，随时查看。
            </p>
            <div className="flex flex-wrap items-center justify-center md:justify-start gap-3 mt-5 font-sans text-sm text-gray-600">
              <span className="flex items-center gap-1.5 bg-gray-50 border border-gray-200 rounded-xl px-3 py-1.5">
                {TOTAL}+ 精选站点
              </span>
              <span className="flex items-center gap-1.5 bg-gray-50 border border-gray-200 rounded-xl px-3 py-1.5">
                持续更新
              </span>
              <span className="flex items-center gap-1.5 bg-gray-50 border border-gray-200 rounded-xl px-3 py-1.5">
                永久免费
              </span>
            </div>
          </div>
          <a
            href="#all-groups"
            className="rounded-xl font-semibold transition-all duration-300 bg-[#6366f1] text-white shadow-lg shadow-[#6366f1]/25 hover:scale-[1.02] hover:shadow-xl hover:shadow-[#6366f1]/30 active:scale-95 px-8 py-3.5 text-base md:text-lg shrink-0"
          >
            立即开始浏览 →
          </a>
        </div>
      </section>

      {/* 页脚 */}
      <footer
        id="footer"
        className="bg-gray-50 text-gray-600 py-10 md:py-12 px-4 md:px-6 lg:px-8"
      >
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 md:gap-10">
            <div className="md:col-span-2">
              <span className="font-bold tracking-tight text-lg md:text-xl text-[#0f172a]">
                甜甜导航
              </span>
              <p className="font-sans text-sm mt-2 leading-relaxed">
                专业 iOS 资源导航站，收录巨魔商店 IPA、签名工具、快捷指令、
                AI 工具与设计资源，共 {TOTAL} 个精选站点。
              </p>
            </div>
            <div>
              <h4 className="font-bold tracking-tight text-base text-[#0f172a]">
                热门分类
              </h4>
              <ul className="font-sans text-sm mt-3 space-y-2">
                <li>
                  <button
                    onClick={() => scrollTo("group-ios")}
                    className="hover:text-[#6366f1] transition-colors"
                  >
                    iOS 资源
                  </button>
                </li>
                <li>
                  <button
                    onClick={() => scrollTo("group-ai")}
                    className="hover:text-[#6366f1] transition-colors"
                  >
                    AI 工具
                  </button>
                </li>
                <li>
                  <button
                    onClick={() => scrollTo("group-cloud")}
                    className="hover:text-[#6366f1] transition-colors"
                  >
                    网盘云储
                  </button>
                </li>
                <li>
                  <button
                    onClick={() => scrollTo("group-tools")}
                    className="hover:text-[#6366f1] transition-colors"
                  >
                    常用工具
                  </button>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="font-bold tracking-tight text-base text-[#0f172a]">
                关于本站
              </h4>
              <ul className="font-sans text-sm mt-3 space-y-2">
                <li>
                  <button
                    onClick={() => scrollTo("group-assets")}
                    className="hover:text-[#6366f1] transition-colors"
                  >
                    素材资源
                  </button>
                </li>
                <li>
                  <button
                    onClick={() => scrollTo("group-ued")}
                    className="hover:text-[#6366f1] transition-colors"
                  >
                    UED 团队
                  </button>
                </li>
                <li>
                  <a href="/admin" className="hover:text-[#6366f1] transition-colors">
                    管理后台
                  </a>
                </li>
              </ul>
              <p className="font-sans text-xs text-gray-400 mt-4 leading-relaxed">
                本站仅作网址导航与分享，所有站点版权归原作者所有。
              </p>
            </div>
          </div>
          <div className="border-t border-gray-200 mt-8 pt-6 flex flex-col md:flex-row items-center justify-between gap-3 font-sans text-xs text-gray-400">
            <span>© {new Date().getFullYear()} 甜甜导航 · 专业 iOS 资源导航站</span>
            <span>精选 {TOTAL} 优质网站 · 免费开放</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
