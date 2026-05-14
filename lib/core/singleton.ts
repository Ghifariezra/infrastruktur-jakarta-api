/** biome-ignore-all lint/complexity/noThisInStatic: ... */
import { AppError } from "@core/error";
import { logger } from "@shared/logger";
import type { ContentfulStatusCode } from "hono/utils/http-status";

export abstract class BaseSingleton {
	private static _instances = new Map<unknown, unknown>();

	protected constructor() {}

	// biome-ignore lint/suspicious/noExplicitAny: Bypass strict public constructor check
	public static getInstance<T>(this: any): T {
		if (!BaseSingleton._instances.has(this)) {
			BaseSingleton._instances.set(this, new this());
		}
		return BaseSingleton._instances.get(this) as T;
	}

	/**
	 * Wrapper Global untuk menangani Try-Catch secara otomatis di seluruh layer
	 */
	protected async execute<T>(
		operation: () => Promise<T>,
		errorMessage = "An unexpected error occurred",
		errorCode = "INTERNAL_ERROR",
	): Promise<T> {
		try {
			return await operation();
		} catch (error: unknown) {
			// 1. Logging error asli untuk keperluan debugging di server
			logger.error(`[${errorCode}] ${errorMessage}`, error);

			// 2. Jika error sudah berupa turunan AppError (misal: UnauthorizedError, ValidationError), lempar langsung
			if (error instanceof AppError) {
				throw error;
			}

			// 3. Tangkap pesan error dinamis dari Database / Sistem
			const dynamicMessage =
				(error as { message?: string })?.message || errorMessage;

			// Ekstrak kode error database sekali saja agar lebih rapi
			const dbErrorCode = (error as { code?: string })?.code;

			// 4. Tangkap kode error spesifik Postgres
			// FIX: Tambahkan 403 ke dalam Union Type agar TypeScript tidak error
			let statusCode: 400 | 403 | 500 = 500;

			if (dbErrorCode === "23505" || dbErrorCode === "unique_violation") {
				statusCode = 400; // Ubah menjadi Bad Request karena ini kesalahan input user
			}

			if (dbErrorCode === "check_violation") {
				statusCode = 403; // Forbidden karena melanggar batas Kuota
			}

			// 5. Lempar sebagai AppError baru agar format response JSON tetap konsisten
			throw new AppError(
				dynamicMessage,
				statusCode as ContentfulStatusCode,
				errorCode,
			);
		}
	}
}
