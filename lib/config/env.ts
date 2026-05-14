import { z } from "zod";
import "dotenv/config";

const envSchema = z.object({
	// Server
	NODE_ENV: z
		.enum(["development", "production", "test"])
		.default("development"),
	PORT: z.coerce.number().default(3000),

	// Supabase client (@supabase/supabase-js)
	SUPABASE_URL: z.string().url(),
	SUPABASE_SERVICE_KEY: z.string().min(1),

	// Direct DB connection (postgres.js)
	DATABASE_URL: z.string().min(1),

	// Rate limit
	RATE_LIMIT_MAX: z.coerce.number().default(100),
	RATE_LIMIT_WINDOW_MS: z.coerce.number().default(60_000),
});

const parsed = envSchema.safeParse(process.env);

if (!parsed.success) {
	console.error("❌ Invalid environment variables:");
	console.error(JSON.stringify(parsed.error.flatten().fieldErrors, null, 2));
	process.exit(1);
}

export const env = parsed.data;
export type Env = typeof env;
