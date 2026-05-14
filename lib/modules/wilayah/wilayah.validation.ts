import { z } from "zod";

const uuidParam = z
	.string({
		error: "ID parameter is required and must be a string",
	})
	.uuid("Invalid UUID format");

const nameSearch = z.string().max(100, "Search query too long").optional();

export const getWilayahSchema = z.object({
	search: nameSearch,
});

export const getWilayahByIdSchema = z.object({
	id: uuidParam,
});

export const getKecamatanByWilayahSchema = z.object({
	id: uuidParam,
	search: nameSearch,
});

export const getKelurahanByWilayahSchema = z.object({
	id: uuidParam,
	kecamatan_id: z.string().uuid("Invalid kecamatan UUID").optional(),
	search: nameSearch,
});

export type WilayahQueryParams = z.infer<typeof getWilayahSchema>;
export type KecamatanQueryParams = z.infer<typeof getKecamatanByWilayahSchema>;
export type KelurahanQueryParams = z.infer<typeof getKelurahanByWilayahSchema>;
