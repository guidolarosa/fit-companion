import type { MetadataRoute } from "next"

export default function robots(): MetadataRoute.Robots {
  const baseUrl = process.env.VERCEL_PROJECT_PRODUCTION_URL
    ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`
    : process.env.VERCEL_URL
      ? `https://${process.env.VERCEL_URL}`
      : "http://localhost:3000"

  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: [
          "/api/",
          "/login",
          "/onboarding",
          "/dashboard",
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
    sitemap: `${baseUrl}/sitemap.xml`,
  }
}
