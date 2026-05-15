// import { UnauthorizedError } from "@core/error";
// import { AuthService } from "@modules/auth/auth.service";
// import type { Context, Next } from "hono";

// export const apiKeyAuth = async (c: Context, next: Next) => {
// 	let apiKey = c.req.header("x-api-key");

// 	if (!apiKey) {
// 		const authHeader = c.req.header("Authorization");
// 		if (authHeader?.startsWith("Bearer ")) {
// 			apiKey = authHeader.split(" ")[1];
// 		}
// 	}

// 	if (!apiKey) {
// 		throw new UnauthorizedError(
// 			"API Key is missing. Please provide it via 'x-api-key' or 'Authorization: Bearer' header.",
// 		);
// 	}

// 	const authService = AuthService.getInstance<AuthService>();
// 	const developerInfo = await authService.verifyApiKey(apiKey);
// 	c.set("developer", developerInfo);
// 	await next();
// };


import { UnauthorizedError } from "@core/error";
import { AuthService } from "@modules/auth/auth.service";
import type { MiddlewareHandler } from "hono";

export const apiKeyAuth: MiddlewareHandler<{ Bindings: Env; Variables: HonoVariables }> = async (c, next) => {
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
	// Fix: init service dengan env dari context sebelum pakai this.sql
	await authService.init(c.env);
	const developerInfo = await authService.verifyApiKey(apiKey);
	c.set("developer", developerInfo);
	await next();
};