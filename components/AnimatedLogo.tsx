"use client";
import { useState } from "react";
/**
 * 炫酷动画 Logo 组件
 * - 渐变流动背景
 * - 脉冲光晕
 * - 悬停旋转+缩放
 * - "甜"字带光影效果
 */
export default function AnimatedLogo({
  size = "md",
  showText = true,
}: {
  size?: "sm" | "md" | "lg";
  showText?: boolean;
}) {
  const [hovered, setHovered] = useState(false);
  const sizeMap = {
    sm: "h-8 w-8 text-sm",
    md: "h-9 w-9 text-lg",
    lg: "h-14 w-14 text-2xl",
  };
  return (
    <div
      className="flex items-center gap-2.5 group cursor-pointer"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      {/* Logo 图标容器 */}
      <div className="relative">
        {/* 外层脉冲光晕 */}
        <div
          className={`absolute inset-0 rounded-xl bg-gradient-to-br from-[#6366f1] to-[#8b5cf6] opacity-60 blur-md animate-pulse`}
          style={{ animationDuration: "2s" }}
        />
        {/* 旋转渐变环 */}
        <div
          className={`absolute -inset-0.5 rounded-xl bg-gradient-to-r from-[#6366f1] via-[#ec4899] to-[#06b6d4] opacity-70 transition-all duration-500 ${
            hovered ? "opacity-100 blur-sm" : ""
          }`}
          style={{
            backgroundSize: "200% 200%",
            animation: "gradientShift 3s ease infinite",
          }}
        />
        {/* 主图标 */}
        <div
          className={`relative ${sizeMap[size]} rounded-xl bg-gradient-to-br from-[#6366f1] via-[#7c3aed] to-[#8b5cf6] flex items-center justify-center font-bold tracking-tight text-white shadow-lg shadow-[#6366f1]/30 transition-all duration-300 ease-out overflow-hidden ${
            hovered ? "scale-110 rotate-6" : ""
          }`}
          style={{
            backgroundSize: "200% 200%",
            animation: "gradientShift 4s ease infinite",
          }}
        >
          {/* 内部光影扫过效果 */}
          <div
            className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent"
            style={{
              animation: "shine 3s ease-in-out infinite",
              transform: "translateX(-100%)",
            }}
          />
          <span className="relative z-10 select-none drop-shadow-lg">甜</span>
        </div>
      </div>
      {/* Logo 文字 */}
      {showText && (
        <span
          className={`font-bold tracking-tight text-lg md:text-xl text-[#0f172a] transition-all duration-300 ${
            hovered ? "text-[#6366f1]" : ""
          }`}
        >
          甜甜导航
        </span>
      )}
      {/* 内联动画样式 */}
      <style jsx>{`
        @keyframes gradientShift {
          0% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
          100% { background-position: 0% 50%; }
        }
        @keyframes shine {
          0% { transform: translateX(-100%); }
          50% { transform: translateX(100%); }
          100% { transform: translateX(100%); }
        }
      `}</style>
    </div>
  );
}
