import type { Metadata, Viewport } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: {
    default: "甜甜导航 - 专业iOS资源导航站 | 巨魔商店IPA | 签名工具 | 果粉网盘",
    template: "%s | 甜甜导航",
  },
  description:
    "甜甜导航，专业的 iOS 资源导航站：iOS 网盘、快捷指令、签名工具、巨魔商店 IPA、AI 工具、网盘云储、设计素材与 UED 团队一网打尽，精选800+优质网站随时直达。",
  keywords:
    "iOS导航, 巨魔商店, IPA, 苹果签名, 快捷指令, iOS网盘, 果粉网盘, 资源导航, AI工具, 设计素材, 甜甜导航, eqkk",
  authors: [{ name: "甜甜导航" }],
  creator: "甜甜导航",
  publisher: "甜甜导航",
  alternates: {
    canonical: "https://eqkk.top/",
  },
  openGraph: {
    type: "website",
    locale: "zh_CN",
    url: "https://eqkk.top/",
    siteName: "甜甜导航",
    title: "甜甜导航 - 专业iOS资源导航站",
    description: "精选800+优质网站，覆盖iOS网盘、巨魔商店IPA、快捷指令、签名工具、AI工具与设计资源。",
    images: [
      {
        url: "https://eqkk.top/og-image.png",
        width: 1200,
        height: 630,
        alt: "甜甜导航 - 专业iOS资源导航站",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "甜甜导航 - 专业iOS资源导航站",
    description: "精选800+优质网站，覆盖iOS网盘、巨魔商店IPA、快捷指令、签名工具、AI工具与设计资源。",
    images: ["https://eqkk.top/og-image.png"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  category: "technology",
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
  viewportFit: "cover",
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#ffffff" },
    { media: "(prefers-color-scheme: dark)", color: "#0f172a" },
  ],
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: "甜甜导航",
    url: "https://eqkk.top/",
    description: "专业的iOS资源导航站，精选800+优质网站",
    potentialAction: {
      "@type": "SearchAction",
      target: "https://eqkk.top/?q={search_term_string}",
      "query-input": "required name=search_term_string",
    },
  };

  return (
    <html lang="zh-CN" className="h-full antialiased">
      <head>
        <link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png" />
        <link rel="icon" type="image/svg+xml" href="/favicon.svg" />
        <link rel="manifest" href="/manifest.json" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />
        <meta name="apple-mobile-web-app-title" content="甜甜导航" />
        <meta name="format-detection" content="telephone=no" />
        <meta name="apple-itunes-app" content="app-argument=https://eqkk.top/" />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body className="min-h-full flex flex-col bg-white text-[#0f172a] font-sans">
        {children}
      </body>
    </html>
  );
}
