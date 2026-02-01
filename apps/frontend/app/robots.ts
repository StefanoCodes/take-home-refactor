import { APP_BASE_URL } from "@/lib/constants";
import type { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
	return {
		rules: {
			userAgent: "*",
			allow: ["/", "/login"],
			disallow: ["/dashboard/*", "/api/*"],
		},
		sitemap: `${APP_BASE_URL}/sitemap.xml`,
	};
}
