import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "甜甜导航 - 专业iOS资源导航站 | 巨魔商店IPA | 签名工具 | 果粉网盘",
  description:
    "甜甜导航，专业的 iOS 资源导航站：iOS 网盘、快捷指令、签名工具、巨魔商店 IPA、AI 工具、网盘云储、设计素材与 UED 团队一网打尽，精选优质网站随时直达。",
  keywords:
    "iOS导航, 巨魔商店, IPA, 苹果签名, 快捷指令, iOS网盘, 果粉网盘, 资源导航, AI工具, 设计素材",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="zh-CN" className="h-full antialiased">
      <body className="min-h-full flex flex-col bg-white text-[#0f172a] font-sans">
        {children}
      </body>
    </html>
  );
}
