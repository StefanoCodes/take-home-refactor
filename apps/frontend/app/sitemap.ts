import type { MetadataRoute } from "next";
import { APP_BASE_URL } from "@/lib/constants";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
	const now = new Date();
	const BASE_URL = APP_BASE_URL;

	const staticEntries: MetadataRoute.Sitemap = [
		{
			url: BASE_URL,
			lastModified: now,
			priority: 1,
			changeFrequency: "weekly",
		},
	];

	// possible dynamic entries if needed

	return [...staticEntries];
}
