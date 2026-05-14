import { UnauthorizedError } from "@core/error";
import type { Context, Next } from "hono";

export const requireAdmin = async (c: Context, next: Next) => {
	// Ambil info developer yang sudah disisipkan oleh middleware apiKeyAuth sebelumnya
	const developer = c.get("developer");

	// Jika tier-nya bukan admin, tendang keluar!
	if (!developer || developer.tier !== "admin") {
		throw new UnauthorizedError(
			"Forbidden: This route is strictly for EzDev internal use only.",
		);
	}

	await next();
};
