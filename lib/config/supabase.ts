import { createClient, type SupabaseClient } from "@supabase/supabase-js";

let _supabase: SupabaseClient | null = null;

export function getSupabase(env?: Env): SupabaseClient {
	if (env || !_supabase) {
		const url = env?.SUPABASE_URL ?? process.env.SUPABASE_URL;
		const key = env?.SUPABASE_SERVICE_KEY ?? process.env.SUPABASE_SERVICE_KEY;

		if (!url || !key) {
			throw new Error("Missing SUPABASE_URL or SUPABASE_SERVICE_KEY");
		}

		_supabase = createClient(url, key, {
			auth: { persistSession: false },
		});
	}
	return _supabase;
}