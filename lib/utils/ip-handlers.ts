import type { Context } from "hono";

export const getRealIp = (c: Context): string => {
	const cfIp = c.req.header("cf-connecting-ip");
	if (cfIp) return cfIp;

	const forwardedFor = c.req.header("x-forwarded-for");
	if (forwardedFor) {
		return forwardedFor.split(",")[0].trim();
	}

	const realIp = c.req.header("x-real-ip");
	if (realIp) return realIp;

	return "global";
};
