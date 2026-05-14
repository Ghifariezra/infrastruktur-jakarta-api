import { UnauthorizedError } from "@core/error";
import { AuthService } from "@modules/auth/auth.service";
import type { Context, Next } from "hono";

export const apiKeyAuth = async (c: Context, next: Next) => {
	// 1. Ekstrak API Key dari header 'x-api-key' atau 'Authorization'
	let apiKey = c.req.header("x-api-key");

	if (!apiKey) {
		const authHeader = c.req.header("Authorization");
		if (authHeader?.startsWith("Bearer ")) {
			apiKey = authHeader.split(" ")[1];
		}
	}

	// 2. Jika tidak ada token sama sekali
	if (!apiKey) {
		throw new UnauthorizedError(
			"API Key is missing. Please provide it via 'x-api-key' or 'Authorization: Bearer' header.",
		);
	}

	// 3. Verifikasi ke Database via AuthService
	const authService = AuthService.getInstance<AuthService>();

	// Jika tidak valid, ini otomatis melempar UnauthorizedError dari dalam AuthService
	const developerInfo = await authService.verifyApiKey(apiKey);

	// 4. (Opsional) Simpan info developer ke Context Hono
	// Berguna kalau controller lo butuh tahu tier mereka (free/pro)
	c.set("developer", developerInfo);

	// 5. Lanjut ke proses berikutnya (Controller)
	await next();
};
