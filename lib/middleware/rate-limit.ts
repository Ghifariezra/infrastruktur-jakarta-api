import { env } from "@config/env";
import { sendError } from "@shared/response";
import { getRealIp } from "@utils/ip-handlers"; // <-- IMPORT DI SINI
import { rateLimiter } from "hono-rate-limiter";

export const rateLimitMiddleware = rateLimiter({
	windowMs: env.RATE_LIMIT_WINDOW_MS, // 60000 (1 menit)
	limit: env.RATE_LIMIT_MAX, // 100 request
	standardHeaders: "draft-6",

	keyGenerator: (c) => {
		// 1. Coba ambil dari header x-api-key
		const apiKey = c.req.header("x-api-key");
		if (apiKey) return apiKey;

		// 2. Coba ambil dari header Authorization (Bearer token)
		const authHeader = c.req.header("Authorization");
		if (authHeader?.startsWith("Bearer ")) {
			return authHeader.split(" ")[1];
		}

		// 3. Fallback ke IP Address jika tidak ada API Key (menggunakan util)
		// Jauh lebih bersih dan tidak redundan!
		return getRealIp(c);
	},

	handler: (c) => {
		return sendError(
			c,
			"Too many requests. Please slow down and try again in a minute.",
			429,
		);
	},
});
