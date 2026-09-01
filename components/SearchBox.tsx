"use client";

import { useState } from "react";

const PLACEHOLDERS = [
  "搜索 iOS 网盘、快捷指令、AI 工具……",
  "试试搜索「巨魔商店」「签名工具」",
  "输入关键词，直达精选站点",
];

function useRotatingPlaceholder() {
  const [idx, setIdx] = useState(0);
  const onFocus = () => setIdx((i) => (i + 1) % PLACEHOLDERS.length);
  return { placeholder: PLACEHOLDERS[idx], onFocus };
}

export default function SearchBox({
  onSearch,
}: {
  onSearch: (q: string) => void;
}) {
  const { placeholder, onFocus } = useRotatingPlaceholder();
  return (
    <form
      role="search"
      className="w-full max-w-xl mx-auto"
      onSubmit={(e) => {
        e.preventDefault();
        const input = e.currentTarget.elements.namedItem(
          "q"
        ) as HTMLInputElement;
        onSearch(input.value.trim());
      }}
    >
      <div className="relative">
        <input
          name="q"
          type="search"
          aria-label="搜索站点"
          placeholder={placeholder}
          onFocus={onFocus}
          className="w-full bg-white border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#6366f1]/20 focus:border-[#6366f1] transition-all h-12 md:h-14 pl-5 pr-24 text-base md:text-lg font-sans"
        />
        <button
          type="submit"
          className="absolute right-1.5 top-1/2 -translate-y-1/2 rounded-xl font-semibold transition-all duration-300 bg-[#6366f1] text-white shadow-lg shadow-[#6366f1]/25 hover:scale-[1.02] hover:shadow-xl hover:shadow-[#6366f1]/30 active:scale-95 h-9 md:h-11 px-4 md:px-5 text-sm md:text-base"
        >
          搜索
        </button>
      </div>
    </form>
  );
}
