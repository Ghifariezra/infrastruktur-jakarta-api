import { env } from "@config/env";
import { createClient } from "@supabase/supabase-js";
import postgres from "postgres";

// ── Supabase JS Client ───────────────────────────────────────
// Pakai service role key agar bypass RLS dari backend
export const supabase = createClient(
	env.SUPABASE_URL,
	env.SUPABASE_SERVICE_KEY,
	{
		auth: { persistSession: false },
	},
);

// ── postgres.js — Raw SQL + PostGIS ─────────────────────────
// prepare: false → wajib untuk Supabase Transaction Pooler (port 6543)
// ssl: "require" → wajib untuk semua koneksi Supabase
export const sql = postgres(env.DATABASE_URL, {
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
