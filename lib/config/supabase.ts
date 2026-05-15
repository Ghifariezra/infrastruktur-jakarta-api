// import { env } from "@config/env";
// import { createClient } from "@supabase/supabase-js";
// import postgres from "postgres";

// // ── Supabase JS Client ───────────────────────────────────────
// // Pakai service role key agar bypass RLS dari backend
// export const supabase = createClient(
// 	env.SUPABASE_URL,
// 	env.SUPABASE_SERVICE_KEY,
// 	{
// 		auth: { persistSession: false },
// 	},
// );

// // ── postgres.js — Raw SQL + PostGIS ─────────────────────────
// // prepare: false → wajib untuk Supabase Transaction Pooler (port 6543)
// // ssl: "require" → wajib untuk semua koneksi Supabase
// export const sql = postgres(env.DATABASE_URL, {
// 	ssl: "require",
// 	prepare: false,
// 	max: 10,
// 	idle_timeout: 20,
// 	connect_timeout: 10,
// 	max_lifetime: 60 * 30,
// 	connection: {
// 		statement_timeout: 5000,
// 	},
// });

// import { env } from "@config/env";
import { createClient, type SupabaseClient } from "@supabase/supabase-js";
// Fix: static import — dynamic import (await import()) dihitung sebagai subrequest
// di Cloudflare Workers dan menyebabkan "Too many subrequests" error
import postgres, { type Sql } from "postgres";

// ── Lazy instances (di-init saat pertama kali dipakai) ───────
// Cloudflare Workers: `env` hanya tersedia di dalam handler,
// BUKAN di top-level module scope. Jadi kita tidak boleh
// langsung createClient() / postgres() di sini.
let _supabase: SupabaseClient | null = null;
let _sql: Sql | null = null;

// ── Supabase JS Client ───────────────────────────────────────
// Pakai service role key agar bypass RLS dari backend
export function getSupabase(env: Env): SupabaseClient {
	if (!_supabase) {
		_supabase = createClient(env.SUPABASE_URL, env.SUPABASE_SERVICE_KEY, {
			auth: { persistSession: false },
		});
	}
	return _supabase;
}

// ── postgres.js — Raw SQL + PostGIS ─────────────────────────
// prepare: false → wajib untuk Supabase Transaction Pooler (port 6543)
// ssl: "require" → wajib untuk semua koneksi Supabase
// Fix: tidak lagi async — static import tidak butuh await
export function getSql(env: Env): Sql {
	if (!_sql) {
		_sql = postgres(env.DATABASE_URL, {
			ssl: "require",
			prepare: false,
			max: 10,
			idle_timeout: 20,
			connect_timeout: 10,
			max_lifetime: 60 * 30,
			connection: {
				statement_timeout: 5000,
			},
		});
	}
	return _sql;
}
