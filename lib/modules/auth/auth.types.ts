export interface CreateApiKeyRequest {
	developer_name: string;
	project_name: string;
	tier?: "free" | "pro" | "enterprise";
	lifespan_days?: number | null;
}

export interface ApiKeyResponse {
	id: string;
	api_key: string;
}

export interface VerifyKeyResponse {
	is_valid: boolean;
	developer_name: string;
	tier: string;
}
