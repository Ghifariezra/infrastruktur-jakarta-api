import { BaseSingleton } from "@core/singleton";
import type { Context } from "hono";
import type { BaseService } from "./base.service";

export abstract class BaseController extends BaseSingleton {
	protected abstract get services(): BaseService[];

	protected handle = <T>(
		c: Context<{ Bindings: Env; Variables: HonoVariables }>,
		fn: () => Promise<T>,
		errorMessage: string,
		errorCode: string,
	): Promise<Response> => {
		return this.execute(
			async () => {
				// Pass c.env kalau ada (Cloudflare), skip kalau local
				if (c.env) {
					for (const s of this.services) {
						s.init(c.env);
					}
				}
				return await fn();
			},
			errorMessage,
			errorCode,
		) as Promise<Response>;
	};
}