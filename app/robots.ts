import type { MetadataRoute } from "next";

export const dynamic = "force-static";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: ["/admin", "/api/"],
      },
      {
        userAgent: "Googlebot",
        allow: "/",
        disallow: ["/admin"],
      },
      {
        userAgent: "Baiduspider",
        allow: "/",
        disallow: ["/admin"],
      },
      {
        userAgent: "Sogou web spider",
        allow: "/",
        disallow: ["/admin"],
      },
      {
        userAgent: "360Spider",
        allow: "/",
        disallow: ["/admin"],
      },
    ],
    sitemap: "https://eqkk.top/sitemap.xml",
    host: "https://eqkk.top",
  };
}
