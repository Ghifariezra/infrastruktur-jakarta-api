import { z } from "zod";

export const createApiKeySchema = z.object({
	developer_name: z.string().min(3).max(255),
	project_name: z.string().min(3).max(255),
	email: z.string().min(1).email(),
	use_case: z.string().min(20).max(1000),
	tier: z.enum(["free", "pro", "enterprise"]).default("free"),
	lifespan_days: z.number().int().positive().nullable().default(null),
});
export const checkedCreateApiKeySchema = createApiKeySchema.omit({ 
	tier: true,
	lifespan_days: true,
 });

export const revokeApiKeySchema = z.object({
	key_id: z.string().uuid("Invalid API Key ID"),
});

export type CreateApiKeyPayload = z.infer<typeof createApiKeySchema>;
export type RevokeApiKeyPayload = z.infer<typeof revokeApiKeySchema>;