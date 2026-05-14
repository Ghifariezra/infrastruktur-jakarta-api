import { cache } from "hono/cache";

export const publicCache = cache({
	cacheName: "jakarta-health-api-v1",
	cacheControl: "public, max-age=3600, stale-while-revalidate=86400",
	wait: true,
});
