// import { getSql, sql } from "@config/supabase";
// import { logger } from "@shared/logger";
// import { BaseSingleton } from "./singleton";

// const sql = await getSql(c.env);

// export abstract class BaseService extends BaseSingleton {
// 	protected readonly sql = sql;
// 	protected readonly logger = logger;
// }


// Fix: hapus import 'sql' karena sudah tidak di-export (diganti getSql)
// Fix: hapus 'const sql = await getSql(c.env)' — c tidak tersedia di sini
import { getSql, getSupabase } from "@config/supabase";
import type { Sql } from "postgres";
import type { SupabaseClient } from "@supabase/supabase-js";
import { logger } from "@shared/logger";
import { BaseSingleton } from "./singleton";

export abstract class BaseService extends BaseSingleton {
	// sql dan supabase di-inject saat konstruksi, bukan di top-level
	// karena Cloudflare Workers env hanya tersedia di dalam handler
	protected sql!: Sql;
	protected supabase!: SupabaseClient;
	protected readonly logger = logger;

	// Panggil init(env) di awal setiap handler sebelum pakai sql/supabase
	async init(env: Env): Promise<void> {
		this.sql = await getSql(env);
		this.supabase = getSupabase(env);
	}
}