import { z } from "zod";

export const createApiKeySchema = z.object({
	developer_name: z.string().min(3).max(255),
	project_name: z.string().min(3).max(255),
	tier: z.enum(["free", "pro", "enterprise"]).default("free"),
	lifespan_days: z.number().int().positive().nullable().default(null),
});

export const revokeApiKeySchema = z.object({
	key_id: z.string().uuid("Invalid API Key ID"),
});

export type CreateApiKeyPayload = z.infer<typeof createApiKeySchema>;
export type RevokeApiKeyPayload = z.infer<typeof revokeApiKeySchema>;
