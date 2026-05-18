import { BaseService } from "@core/base.service";
import { UnauthorizedError } from "@core/error";
import { EmailService } from "@modules/email/email.service";
import type {
	ApiKeyResponse,
	CreateApiKeyRequest,
	VerifyKeyResponse,
} from "./auth.types";

export class AuthService extends BaseService {
	private readonly emailService = EmailService.getInstance<EmailService>();

	// ─── Create API Key ─────────────────────────────────────────────────────

	async createApiKey(payload: CreateApiKeyRequest): Promise<ApiKeyResponse> {
		if (!this.envConfig?.RESEND_API_KEY || !this.envConfig?.EMAIL_FROM) {
			throw new Error("Server configuration missing: Cannot send email.");
		}

		const result = await this.execute(
			async () => {
				const { data, error } = await this.supabase
					.schema("infrastruktur_jakarta")
					.rpc("create_api_key", {
						p_dev_name: payload.developer_name,
						p_project_name: payload.project_name,
						p_email: payload.email,
						p_use_case: payload.use_case,
						p_tier: payload.tier ?? "free",
						p_lifespan_days: payload.lifespan_days ?? null,
					});

				if (error) throw error;
				return data[0] as ApiKeyResponse;
			},
			"Failed to generate API Key",
			"DB_AUTH_CREATE_ERROR",
		);

		try {
			await this.emailService.sendApiKeyEmail({
				to: payload.email,
				developer_name: payload.developer_name,
				project_name: payload.project_name,
				api_key: result.api_key,
				expires_in_days: payload.lifespan_days,
			}, {
				resendKey: this.envConfig.RESEND_API_KEY,
				fromEmail: this.envConfig.EMAIL_FROM
			});
		} catch (err) {
			this.logger.error(
				"[AuthService] Email delivery failed, rolling back API key creation",
				{ err, email: payload.email },
			);

			if (result.id) {
				await this.revokeApiKey(result.id).catch((revokeErr) => {
					this.logger.error(
						"[AuthService] CRITICAL: Failed to rollback API key after email error",
						{ revokeErr, keyId: result.id },
					);
				});
			}

			throw new Error("Gagal mengirim email API Key. Silakan periksa kembali alamat email Anda atau coba beberapa saat lagi.");
		}

		return result;
	}

	// ─── Verify API Key ─────────────────────────────────────────────────────

	async verifyApiKey(apiKey: string): Promise<VerifyKeyResponse> {
		return this.execute(
			async () => {
				const { data, error } = await this.supabase
					.schema("infrastruktur_jakarta")
					.rpc("verify_api_key", { p_key: apiKey });

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

	// ─── Revoke API Key ─────────────────────────────────────────────────────

	async revokeApiKey(keyId: string): Promise<void> {
		return this.execute(
			async () => {
				const { error } = await this.supabase
					.schema("infrastruktur_jakarta")
					.rpc("revoke_api_key", { p_key_id: keyId });

				if (error) throw error;
			},
			"Failed to revoke API Key",
			"DB_AUTH_REVOKE_ERROR",
		);
	}
}