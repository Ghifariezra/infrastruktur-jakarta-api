import { BaseService } from "@core/base.service";
import { UnauthorizedError } from "@core/error";
import type {
	ApiKeyResponse,
	CreateApiKeyRequest,
	VerifyKeyResponse,
} from "./auth.types";

export class AuthService extends BaseService {
	async createApiKey(payload: CreateApiKeyRequest): Promise<ApiKeyResponse> {
		return this.execute(
			async () => {
				const { data, error } = await this.supabase.rpc("create_api_key", {
					p_developer_name: payload.developer_name,
					p_project_name: payload.project_name,
					p_tier: payload.tier ?? "free",
					p_lifespan_days: payload.lifespan_days ?? null,
				});

				if (error) throw error;
				return data[0] as ApiKeyResponse;
			},
			"Failed to generate API Key",
			"DB_AUTH_CREATE_ERROR",
		);
	}

	async verifyApiKey(apiKey: string): Promise<VerifyKeyResponse> {
		return this.execute(
			async () => {
				const { data, error } = await this.supabase.rpc("verify_api_key", {
					p_api_key: apiKey,
				});

				if (error) throw error;

				if (!data || data.length === 0 || !data[0].is_valid) {
					throw new UnauthorizedError("Invalid, expired, or revoked API Key");
				}

				return data[0] as VerifyKeyResponse;
			},
			"Failed to verify API Key",
			"DB_AUTH_VERIFY_ERROR",
		);
	}

	async revokeApiKey(keyId: string): Promise<void> {
		return this.execute(
			async () => {
				const { error } = await this.supabase.rpc("revoke_api_key", {
					p_key_id: keyId,
				});
				if (error) throw error;
			},
			"Failed to revoke API Key",
			"DB_AUTH_REVOKE_ERROR",
		);
	}
}