import { z } from "zod";

export const getFacilitiesQuerySchema = z.object({
	limit: z.coerce.number().int().min(1).max(100).default(50),
	offset: z.coerce.number().int().min(0).default(0),
});

export const getNearbyFacilitiesQuerySchema = z.object({
	lat: z.coerce.number().min(-90).max(90),
	lon: z.coerce.number().min(-180).max(180),
	radius: z.coerce.number().positive().max(100).default(5),
});
