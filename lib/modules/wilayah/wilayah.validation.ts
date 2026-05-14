import { z } from "zod";

// ── Reusable Primitives ───────────────────────────────────────

const uuidParam = z
	.string({
		error: "ID parameter is required and must be a string",
	})
	.uuid("Invalid UUID format");

const nameSearch = z.string().max(100, "Search query too long").optional();

// ── GET /wilayah ──────────────────────────────────────────────
export const getWilayahSchema = z.object({
	search: nameSearch,
});

// ── GET /wilayah/:id ─────────────────────────────────────────
export const getWilayahByIdSchema = z.object({
	id: uuidParam,
});

// ── GET /wilayah/:id/kecamatan ───────────────────────────────
export const getKecamatanByWilayahSchema = z.object({
	// path param
	id: uuidParam,
	// query param
	search: nameSearch,
});

// ── GET /wilayah/:id/kelurahan ───────────────────────────────
export const getKelurahanByWilayahSchema = z.object({
	id: uuidParam,
	kecamatan_id: z.string().uuid("Invalid kecamatan UUID").optional(),
	search: nameSearch,
});

// ── Inferred Types (diekspor ke types.ts) ────────────────────
export type WilayahQueryParams = z.infer<typeof getWilayahSchema>;
export type KecamatanQueryParams = z.infer<typeof getKecamatanByWilayahSchema>;
export type KelurahanQueryParams = z.infer<typeof getKelurahanByWilayahSchema>;
