declare interface Env {
	SUPABASE_URL: string;
	SUPABASE_SERVICE_KEY: string;
	PORT: string;
	NODE_ENV?: string;
	RATE_LIMIT_WINDOW_MS: string;
	RATE_LIMIT_MAX: string;
}

declare interface HonoVariables {
	env: Env;
	developer: {
		is_valid: boolean;
		developer_name: string;
		tier: string;
	};
}