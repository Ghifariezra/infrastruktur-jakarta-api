import { z } from "zod";

export const statsWilayahSchema = z.object({
	nama_wilayah: z.string().max(100).optional(),
});

export const statsKecamatanSchema = z.object({
	nama_wilayah: z.string().max(100).optional(),
	nama_kecamatan: z.string().max(100).optional(),
});

export const statsDensitySchema = z.object({
	nama_wilayah: z.string().max(100).optional(),
	order: z.enum(["asc", "desc"]).default("desc"),
});

export const statsBlankSpotSchema = z.object({
	jenis: z.string().max(200).optional(),
	nama_wilayah: z.string().max(100).optional(),
	limit: z.coerce.number().int().min(1).max(500).default(100),
	offset: z.coerce.number().int().min(0).default(0),
});

export type StatsWilayahQueryParams = z.infer<typeof statsWilayahSchema>;
export type StatsKecamatanQueryParams = z.infer<typeof statsKecamatanSchema>;
export type StatsDensityQueryParams = z.infer<typeof statsDensitySchema>;
export type StatsBlankSpotQueryParams = z.infer<typeof statsBlankSpotSchema>;