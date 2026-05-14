import { UnauthorizedError } from "@core/error";
import { AuthService } from "@modules/auth/auth.service";
import type { Context, Next } from "hono";

export const apiKeyAuth = async (c: Context, next: Next) => {
	let apiKey = c.req.header("x-api-key");

	if (!apiKey) {
		const authHeader = c.req.header("Authorization");
		if (authHeader?.startsWith("Bearer ")) {
			apiKey = authHeader.split(" ")[1];
		}
	}

	if (!apiKey) {
		throw new UnauthorizedError(
			"API Key is missing. Please provide it via 'x-api-key' or 'Authorization: Bearer' header.",
		);
	}

	const authService = AuthService.getInstance<AuthService>();
	const developerInfo = await authService.verifyApiKey(apiKey);
	c.set("developer", developerInfo);
	await next();
};
