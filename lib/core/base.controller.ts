// import { AppError } from "@core/error";
// import { sendError } from "@shared/response";
import { BaseSingleton } from "@core/singleton";
import type { Context } from "hono";
import type { BaseService } from "./base.service";

export abstract class BaseController extends BaseSingleton {
	// Daftarkan semua service yang perlu di-init
	// Override di subclass: protected services = [this.wilayahService, ...]
	protected abstract get services(): BaseService[];

	// Wrapper yang auto-init services dari c.var.env sebelum eksekusi
	protected handle = <T>(
		c: Context<{ Bindings: Env; Variables: HonoVariables }>,
		fn: () => Promise<T>,
		errorMessage: string,
		errorCode: string,
	): Promise<Response> => {
		return this.execute(
			async () => {
				const env = c.env ?? c.var?.env;
				if (!env) throw new Error("Env bindings tidak tersedia di context");

				// Auto-init semua service dengan env dari context
				await Promise.all(this.services.map((s) => s.init(c.var.env ?? c.env)));
				return await fn();
			},
			errorMessage,
			errorCode,
		) as Promise<Response>;
	};
}
