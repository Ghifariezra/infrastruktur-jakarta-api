import { env } from "@config/env";
import { sendError } from "@shared/response";
import { getRealIp } from "@utils/ip-handlers";
import { rateLimiter } from "hono-rate-limiter";

export const rateLimitMiddleware = rateLimiter({
	windowMs: env.RATE_LIMIT_WINDOW_MS,
	limit: env.RATE_LIMIT_MAX,
	standardHeaders: "draft-6",

	keyGenerator: (c) => {
		const apiKey = c.req.header("x-api-key");
		if (apiKey) return apiKey;

		const authHeader = c.req.header("Authorization");
		if (authHeader?.startsWith("Bearer ")) {
			return authHeader.split(" ")[1];
		}
		
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
