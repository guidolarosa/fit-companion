import type { MetadataRoute } from "next"

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/landing",
        disallow: [
          "/api/",
          "/login",
          "/onboarding",
          "/settings",
          "/food",
          "/exercise",
          "/weight",
          "/agent",
          "/lab",
          "/report",
          "/register",
        ],
      },
    ],
    sitemap: "https://fitcompanion.app/sitemap.xml",
  }
}
