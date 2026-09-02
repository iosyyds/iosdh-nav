import Link from "next/link";
import AnimatedLogo from "@/components/AnimatedLogo";

export const metadata = {
  title: "页面未找到",
  description: "您访问的页面不存在或已被移除",
  robots: { index: false, follow: false },
};

export default function NotFound() {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center px-4">
      <div className="text-center max-w-md">
        <div className="flex justify-center mb-6">
          <AnimatedLogo size="lg" />
        </div>
        <h1 className="font-bold tracking-tight text-6xl md:text-7xl text-[#6366f1]">
          404
        </h1>
        <h2 className="font-bold tracking-tight text-2xl text-[#0f172a] mt-4">
          页面未找到
        </h2>
        <p className="font-sans text-sm text-gray-500 mt-3 leading-relaxed">
          您访问的页面可能已被移除、名称已更改或暂时不可用。
        </p>
        <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-3">
          <Link
            href="/"
            className="rounded-xl font-semibold transition-all duration-300 bg-[#6366f1] text-white shadow-lg shadow-[#6366f1]/25 hover:scale-[1.02] hover:shadow-xl hover:shadow-[#6366f1]/30 active:scale-95 px-8 py-3 text-sm w-full sm:w-auto"
          >
            返回首页
          </Link>
          <Link
            href="/#all-groups"
            className="rounded-xl font-semibold transition-all duration-300 bg-white text-[#0f172a] border border-gray-200 hover:border-[#6366f1]/40 px-8 py-3 text-sm w-full sm:w-auto active:scale-95"
          >
            浏览全部站点
          </Link>
        </div>
      </div>
    </div>
  );
}
