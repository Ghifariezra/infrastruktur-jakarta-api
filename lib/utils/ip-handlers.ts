import type { Context } from "hono";

export const getRealIp = (c: Context): string => {
	// 1. Cloudflare (Paling akurat & susah dipalsukan kalau server di balik CF)
	const cfIp = c.req.header("cf-connecting-ip");
	if (cfIp) return cfIp;

	// 2. Standard Reverse Proxy (AWS, Nginx, HAProxy)
	const forwardedFor = c.req.header("x-forwarded-for");
	if (forwardedFor) {
		// x-forwarded-for formatnya: "client_ip, proxy1_ip, proxy2_ip"
		// Kita selalu ambil yang paling kiri (karena itu yang paling awal / si client)
		return forwardedFor.split(",")[0].trim();
	}

	// 3. Nginx Specific Header
	const realIp = c.req.header("x-real-ip");
	if (realIp) return realIp;

	// 4. Fallback (Tidak ada proxy atau local development)
	return "global"; // Ubah dari "unknown" ke "global" agar sinkron dengan fallback rate limiter
};
