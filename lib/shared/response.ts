import type { Context, TypedResponse } from "hono";
import type { ContentfulStatusCode } from "hono/utils/http-status";

export interface ApiResponse<T = unknown> {
	success: boolean;
	message: string;
	data?: T;
	details?: unknown;
}

export const sendSuccess = <T>(
	c: Context,
	data: T,
	message = "Success",
	status: ContentfulStatusCode = 200,
): TypedResponse<ApiResponse<T>> => {
	return c.json(
		{
			success: true,
			message,
			data,
		},
		status,
	);
};

export const sendError = (
	c: Context,
	message: string,
	status: ContentfulStatusCode = 500,
	details?: unknown,
): TypedResponse<ApiResponse> => {
	return c.json(
		{
			success: false,
			message,
			details,
		},
		status,
	);
};
