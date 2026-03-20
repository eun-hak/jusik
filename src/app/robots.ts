import { MetadataRoute } from "next";
import { SITE_URL } from "@/lib/config";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [{ userAgent: "*", allow: "/" }],
    host: SITE_URL.replace(/^https?:\/\//, ""),
    sitemap: `${SITE_URL}/sitemap.xml`,
  };
}
