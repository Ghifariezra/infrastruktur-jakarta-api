// Cloudflare Workers environment bindings — di-generate dari wrangler.toml [vars]
// Ini hanya type declaration, bukan runtime value
declare interface Env {
	SUPABASE_URL: string;
	SUPABASE_SERVICE_KEY: string;
	DATABASE_URL: string;
	PORT: string;
	NODE_ENV?: string;
	RATE_LIMIT_WINDOW_MS: number;
	RATE_LIMIT_MAX: number;
}

// Hono context variables
declare interface HonoVariables {
	env: Env;
	developer: {
		is_valid: boolean;
		developer_name: string;
		tier: string;
	};
}
