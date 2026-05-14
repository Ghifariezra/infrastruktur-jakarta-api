import { UnauthorizedError } from "@core/error";
import type { Context, Next } from "hono";

export const requireAdmin = async (c: Context, next: Next) => {
	const developer = c.get("developer");

	if (!developer || developer.tier !== "admin") {
		throw new UnauthorizedError(
			"Forbidden: This route is strictly for EzDev internal use only.",
		);
	}

	await next();
};
