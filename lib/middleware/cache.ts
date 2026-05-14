import { cache } from "hono/cache";

export const publicCache = cache({
	cacheName: "jakarta-health-api-v1",
	// Cache selama 1 jam (3600 detik)
	cacheControl: "public, max-age=3600, stale-while-revalidate=86400",
	wait: true, // Tunggu hingga cache siap sebelum merespons
});
