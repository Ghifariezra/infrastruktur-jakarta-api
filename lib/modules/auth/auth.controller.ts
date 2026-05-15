import { BaseController } from "@core/base.controller";
import { ValidationError } from "@core/error";
// import { BaseSingleton } from "@core/singleton";
import { sendSuccess } from "@shared/response";
import type { Context } from "hono";
import { AuthService } from "./auth.service";
import { createApiKeySchema, revokeApiKeySchema } from "./auth.validation";

export class AuthController extends BaseController {
	// private authService: AuthService;

	// protected constructor() {
	// 	super();
	// 	this.authService = AuthService.getInstance<AuthService>();
	// }

	private authService = AuthService.getInstance<AuthService>();

	protected get services() {
		return [this.authService];
	}

	public generateKey = async (
		c: Context<{ Bindings: Env; Variables: HonoVariables }>,
	) => {
		return this.handle(
			c,
			async () => {
				// Parsing body request (karena ini method POST)
				const body = await c.req.json().catch(() => ({}));
				const parsed = createApiKeySchema.safeParse(body);

				if (!parsed.success) {
					throw new ValidationError(
						"Invalid payload",
						parsed.error.flatten().fieldErrors,
					);
				}

				const data = await this.authService.createApiKey(parsed.data);

				return sendSuccess(
					c,
					data,
					"API Key successfully generated. Please store it safely as it won't be shown again.",
				);
			},
			"Failed to create API Key",
			"CONTROLLER_AUTH_ERROR",
		);
	};

	public revokeKey = async (
		c: Context<{ Bindings: Env; Variables: HonoVariables }>,
	) => {
		return this.handle(
			c,
			async () => {
				const body = await c.req.json().catch(() => ({}));
				const parsed = revokeApiKeySchema.safeParse(body);

				if (!parsed.success) {
					throw new ValidationError(
						"Invalid key ID",
						parsed.error.flatten().fieldErrors,
					);
				}

				await this.authService.revokeApiKey(parsed.data.key_id);

				return sendSuccess(c, null, "API Key has been revoked");
			},
			"Failed to revoke API Key",
			"CONTROLLER_AUTH_ERROR",
		);
	};
}
