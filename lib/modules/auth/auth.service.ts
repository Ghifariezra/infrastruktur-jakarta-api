import { BaseService } from "@core/base.service";
import { UnauthorizedError } from "@core/error";
import type {
	ApiKeyResponse,
	CreateApiKeyRequest,
	VerifyKeyResponse,
} from "./auth.types";

export class AuthService extends BaseService {
	// 1. Membuat API Key baru (Untuk halaman pendaftaran developer)
	async createApiKey(payload: CreateApiKeyRequest): Promise<ApiKeyResponse> {
		return this.execute(
			async () => {
				// Panggil RPC create_api_key
				// Gunakan fallback ?? null atau default string karena SQL tidak menerima `undefined`
				const result = await this.sql<ApiKeyResponse[]>`
                    SELECT id, api_key FROM infrastruktur_jakarta.create_api_key(
                        ${payload.developer_name},
                        ${payload.project_name},
                        ${payload.tier ?? "free"},
                        ${payload.lifespan_days ?? null}
                    )
                `;
				return result[0];
			},
			"Failed to generate API Key",
			"DB_AUTH_CREATE_ERROR",
		);
	}

	// 2. Memverifikasi API Key (Akan sering dipanggil oleh middleware)
	async verifyApiKey(apiKey: string): Promise<VerifyKeyResponse> {
		return this.execute(
			async () => {
				const result = await this.sql<VerifyKeyResponse[]>`
                    SELECT is_valid, developer_name, tier 
                    FROM infrastruktur_jakarta.verify_api_key(${apiKey})
                `;

				if (!result || result.length === 0 || !result[0].is_valid) {
					throw new UnauthorizedError("Invalid, expired, or revoked API Key");
				}

				return result[0];
			},
			"Failed to verify API Key",
			"DB_AUTH_VERIFY_ERROR",
		);
	}

	// 3. Mencabut (Revoke) API Key
	async revokeApiKey(keyId: string): Promise<void> {
		return this.execute(
			async () => {
				await this.sql`SELECT infrastruktur_jakarta.revoke_api_key(${keyId})`;
			},
			"Failed to revoke API Key",
			"DB_AUTH_REVOKE_ERROR",
		);
	}
}
