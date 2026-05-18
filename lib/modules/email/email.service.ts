import { env } from "@config/env";
import { BaseSingleton } from "@core/singleton";
import { logger } from "@shared/logger";
import { Resend } from "resend";
import type { EmailResult, SendApiKeyEmailPayload } from "./email.types";

export class EmailService extends BaseSingleton {
    private readonly resend = new Resend(env.RESEND_API_KEY);
    private readonly from = env.EMAIL_FROM;
    protected readonly logger = logger;

    // ─── Send API Key Email ─────────────────────────────────────────────────

    async sendApiKeyEmail(payload: SendApiKeyEmailPayload): Promise<EmailResult> {
        const { to, developer_name, project_name, api_key, expires_in_days } = payload;

        const { data, error } = await this.resend.emails.send({
            from: `JakInfra <${this.from}>`,
            to,
            subject: `🔑 API Key JakInfra — ${project_name}`,
            html: buildApiKeyEmailHtml({ developer_name, project_name, api_key, expires_in_days }),
            text: buildApiKeyEmailText({ developer_name, project_name, api_key, expires_in_days }),
        });

        if (error || !data) {
            this.logger.error(
                "[EmailService] Failed to send API key email",
                { error, to, project_name },   // ← context jadi arg ke-2
            );
            throw new Error(`Failed to send email: ${error?.message ?? "Unknown error"}`);
        }

        this.logger.info(
            "[EmailService] API key email sent",
            { message_id: data.id, to, project_name },   // ← context jadi arg ke-2
        );

        return { message_id: data.id };
    }
}

// ─── Email Templates ──────────────────────────────────────────────────────────

interface TemplateVars {
    developer_name: string;
    project_name: string;
    api_key: string;
    expires_in_days?: number | null; // Tambahkan properti opsional ini
}

function buildApiKeyEmailHtml({ developer_name, project_name, api_key, expires_in_days }: TemplateVars): string {
    // Logika untuk menampilkan teks kedaluwarsa jika ada, atau "Selamanya" jika null/undefined
    const expirationText = expires_in_days
        ? `Berlaku selama: <strong style="color:#f1f5f9;">${expires_in_days} hari</strong>`
        : `Masa Aktif: <strong style="color:#10b981;">Selamanya (Never Expires)</strong>`;

    return `<!DOCTYPE html>
<html lang="id">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>API Key JakInfra</title>
</head>
<body style="margin:0;padding:0;background:#0f172a;font-family:'Segoe UI',sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#0f172a;padding:40px 16px;">
    <tr>
      <td align="center">
        <table width="560" cellpadding="0" cellspacing="0" style="background:#1e293b;border-radius:16px;overflow:hidden;border:1px solid #334155;">

          <tr>
            <td style="background:linear-gradient(90deg,#14b8a6,#06b6d4);padding:4px 0;"></td>
          </tr>
          <tr>
            <td style="padding:32px 36px 24px;">
                <img src="https://jakinfra.ezdev.xyz/logo.png"
                    width="32"
                    height="32"
                    alt="JakInfra"
                    style="margin-bottom:12px; border-radius:8px; display:block;" />
                <p style="margin:0 0 4px;font-size:12px;color:#64748b;letter-spacing:2px;text-transform:uppercase;">Open Source WebGIS</p>
                <h1 style="margin:0;font-size:22px;color:#f1f5f9;font-weight:700;">JakInfra</h1>
            </td>
          </tr>

          <tr>
            <td style="padding:0 36px 28px;">
              <p style="margin:0 0 16px;font-size:15px;color:#cbd5e1;line-height:1.6;">
                Halo <strong style="color:#f1f5f9;">${developer_name}</strong>,
              </p>
              <p style="margin:0 0 16px;font-size:15px;color:#94a3b8;line-height:1.6;">
                Permohonan akses API untuk proyek <strong style="color:#f1f5f9;">${project_name}</strong> telah disetujui.
                Berikut adalah API Key eksklusif milikmu:
              </p>

              <div style="background:#0f172a;border:1px solid #14b8a6;border-radius:12px;padding:20px 24px;margin:24px 0;">
                <p style="margin:0 0 8px;font-size:11px;color:#64748b;letter-spacing:1.5px;text-transform:uppercase;">API Key</p>
                <code style="font-size:15px;color:#2dd4bf;font-family:'Courier New',monospace;word-break:break-all;letter-spacing:0.5px;">${api_key}</code>
              </div>

              <p style="margin:-12px 0 24px;font-size:13px;color:#cbd5e1;line-height:1.6;text-align:center;">
                ⏱️ ${expirationText}
              </p>

              <table cellpadding="0" cellspacing="0" style="background:#422006;border:1px solid #92400e;border-radius:10px;width:100%;margin-bottom:24px;">
                <tr>
                  <td style="padding:14px 18px;">
                    <p style="margin:0;font-size:13px;color:#fbbf24;line-height:1.6;">
                      ⚠️ <strong>Rahasiakan key ini.</strong> Jangan commit ke repository publik atau bagikan ke pihak lain.
                      Jika bocor, segera hubungi kami untuk revoke dan generate ulang.
                    </p>
                  </td>
                </tr>
              </table>

              <p style="margin:0 0 8px;font-size:14px;color:#94a3b8;line-height:1.6;">
                Sertakan key ini di setiap request sebagai header:
              </p>
              <div style="background:#0f172a;border-radius:8px;padding:12px 16px;margin-bottom:24px;">
                <code style="font-size:13px;color:#7dd3fc;font-family:'Courier New',monospace;">X-API-Key: ${api_key}</code>
              </div>

              <p style="margin:0;font-size:14px;color:#64748b;line-height:1.6;">
                Untuk dokumentasi lengkap, kunjungi
                <a href="https://jakinfra.ezdev.xyz/about" style="color:#2dd4bf;text-decoration:none;">jakinfra.ezdev.xyz/about</a>.
                Ada pertanyaan? Balas email ini atau hubungi
                <a href="mailto:hello@ezdev.xyz" style="color:#2dd4bf;text-decoration:none;">hello@ezdev.xyz</a>.
              </p>
            </td>
          </tr>

          <tr>
            <td style="padding:20px 36px;border-top:1px solid #334155;">
              <p style="margin:0;font-size:12px;color:#475569;text-align:center;">
                © ${new Date().getFullYear()} JakInfra by EzDev Studio · Jakarta, Indonesia
              </p>
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>
</body>
</html>`;
}

function buildApiKeyEmailText({ developer_name, project_name, api_key, expires_in_days }: TemplateVars): string {
    const expirationText = expires_in_days
        ? `Masa aktif key: ${expires_in_days} hari`
        : `Masa aktif key: Selamanya`;

    return `Halo ${developer_name},

Permohonan akses API untuk proyek "${project_name}" telah disetujui.

API Key kamu:
${api_key}

⏱️ ${expirationText}

Gunakan sebagai header di setiap request:
X-API-Key: ${api_key}

⚠ Rahasiakan key ini. Jangan commit ke repository publik.
Jika bocor, segera hubungi hello@ezdev.xyz untuk revoke.

Dokumentasi: https://jakinfra.ezdev.xyz/about

© ${new Date().getFullYear()} JakInfra by EzDev Studio
`.trim();
}