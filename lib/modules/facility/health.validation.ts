import { z } from "zod";

export const getFacilitiesQuerySchema = z.object({
	// Longgarkan max limit di Zod agar Admin bisa tarik banyak data.
	// Publik tetap akan dipotong jadi 100 di Controller.
	limit: z.coerce.number().int().min(1).default(50),
	offset: z.coerce.number().int().min(0).default(0),
});

export const getNearbyFacilitiesQuerySchema = z.object({
	lat: z.coerce.number().min(-90).max(90),
	lon: z.coerce.number().min(-180).max(180),
	radius: z.coerce.number().positive().max(100).default(5),
});

// health.validation.ts — tambahkan schema ini
export const getBBoxFacilitiesSchema = z
	.object({
		min_lat: z.coerce.number().min(-90).max(90),
		max_lat: z.coerce.number().min(-90).max(90),
		min_lon: z.coerce.number().min(-180).max(180),
		max_lon: z.coerce.number().min(-180).max(180),
	})
	.refine((d) => d.min_lat < d.max_lat, {
		message: "min_lat must be less than max_lat",
		path: ["min_lat"],
	})
	.refine((d) => d.min_lon < d.max_lon, {
		message: "min_lon must be less than max_lon",
		path: ["min_lon"],
	});

export type BBoxQuery = z.infer<typeof getBBoxFacilitiesSchema>;
