import { getSupabase } from "@config/supabase";
import { logger } from "@shared/logger";
import type { SupabaseClient } from "@supabase/supabase-js";
import { BaseSingleton } from "./singleton";

export abstract class BaseService extends BaseSingleton {
	protected supabase: SupabaseClient = getSupabase();
	protected readonly logger = logger;

	init(env?: Env): void {
		this.supabase = getSupabase(env);
	}
}