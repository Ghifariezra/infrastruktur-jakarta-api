import { z } from "zod";

// ── GET /stats/wilayah ────────────────────────────────────────
export const statsWilayahSchema = z.object({
	nama_wilayah: z.string().max(100).optional(),
});

// ── GET /stats/kecamatan ──────────────────────────────────────
export const statsKecamatanSchema = z.object({
	nama_wilayah: z.string().max(100).optional(),
	nama_kecamatan: z.string().max(100).optional(),
});

// ── GET /stats/density ────────────────────────────────────────
export const statsDensitySchema = z.object({
	nama_wilayah: z.string().max(100).optional(),
	// sort: tertinggi atau terendah density-nya
	order: z.enum(["asc", "desc"]).default("desc"),
});

// stats.validation.ts — update statsBlankSpotSchema
export const statsBlankSpotSchema = z.object({
	jenis: z.string().max(200).optional(),
	nama_wilayah: z.string().max(100).optional(),
	limit: z.coerce.number().int().min(1).max(500).default(100),
	offset: z.coerce.number().int().min(0).default(0),
});

// ── Inferred Types ────────────────────────────────────────────
export type StatsWilayahQueryParams = z.infer<typeof statsWilayahSchema>;
export type StatsKecamatanQueryParams = z.infer<typeof statsKecamatanSchema>;
export type StatsDensityQueryParams = z.infer<typeof statsDensitySchema>;
export type StatsBlankSpotQueryParams = z.infer<typeof statsBlankSpotSchema>;
