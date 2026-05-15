import type { ContentfulStatusCode } from "hono/utils/http-status";

export class AppError extends Error {
	constructor(
		public readonly message: string,
		public readonly statusCode: ContentfulStatusCode,
		public readonly code: string,
		public readonly details?: unknown,
	) {
		super(message);
		this.name = this.constructor.name;
		Error.captureStackTrace(this, this.constructor);
	}
}

export class NotFoundError extends AppError {
	constructor(resource: string, details?: unknown) {
		super(`${resource} not found`, 404, "NOT_FOUND", details);
	}
}

export class UnauthorizedError extends AppError {
	constructor(message: string = "Unauthorized access", details?: unknown) {
		// 401 adalah ContentfulStatusCode untuk Unauthorized
		super(message, 401, "UNAUTHORIZED", details);
	}
}

export class ValidationError extends AppError {
	constructor(message: string, details?: unknown) {
		super(message, 400, "VALIDATION_ERROR", details);
	}
}
