// import { env } from "@config/env";
// import { sendError } from "@shared/response";
// import { getRealIp } from "@utils/ip-handlers";
// import { rateLimiter } from "hono-rate-limiter";

// export const rateLimitMiddleware = rateLimiter({
// 	windowMs: env.RATE_LIMIT_WINDOW_MS,
// 	limit: env.RATE_LIMIT_MAX,
// 	standardHeaders: "draft-6",

// 	keyGenerator: (c) => {
// 		const apiKey = c.req.header("x-api-key");
// 		if (apiKey) return apiKey;

// 		const authHeader = c.req.header("Authorization");
// 		if (authHeader?.startsWith("Bearer ")) {
// 			return authHeader.split(" ")[1];
// 		}

// 		return getRealIp(c);
// 	},

// 	handler: (c) => {
// 		return sendError(
// 			c,
// 			"Too many requests. Please slow down and try again in a minute.",
// 			429,
// 		);
// 	},
// });

// import { env } from "@config/env";
// Fix: rateLimiter tidak bisa di-init di top-level karena env belum tersedia.
// Gunakan factory function yang dipanggil di dalam handler.
import { sendError } from "@shared/response";
import { getRealIp } from "@utils/ip-handlers";
import type { MiddlewareHandler } from "hono";
import { rateLimiter } from "hono-rate-limiter";

// Fix: hono-rate-limiter punya generic Env-nya sendiri yang berbeda dari Hono<{ Bindings: Env }>.
// Cast c ke 'any' saat diteruskan ke rateLimiter untuk menghindari type conflict.
export const rateLimitMiddleware: MiddlewareHandler<{ Bindings: Env; Variables: HonoVariables }> = (
	c,
	next,
) => {
	return rateLimiter({
		windowMs: Number(c.env.RATE_LIMIT_WINDOW_MS),
		limit: Number(c.env.RATE_LIMIT_MAX),
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
		// eslint-disable-next-line @typescript-eslint/no-explicit-any
	})(c as any, next);
};
