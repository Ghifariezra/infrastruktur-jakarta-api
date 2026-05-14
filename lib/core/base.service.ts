import { sql } from "@config/supabase";
import { logger } from "@shared/logger";
import { BaseSingleton } from "./singleton";

export abstract class BaseService extends BaseSingleton {
	protected readonly sql = sql;
	protected readonly logger = logger;
}
