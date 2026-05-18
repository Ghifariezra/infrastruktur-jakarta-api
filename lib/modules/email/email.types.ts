export interface SendApiKeyEmailPayload {
    to: string;
    developer_name: string;
    project_name: string;
    api_key: string;
    expires_in_days?: number | null;
}

export interface EmailResult {
    message_id: string;
}