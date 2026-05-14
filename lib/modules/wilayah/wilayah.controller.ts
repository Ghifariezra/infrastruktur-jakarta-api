import { ValidationError } from "@core/error";
import { BaseSingleton } from "@core/singleton";
import { sendSuccess } from "@shared/response";
import type { Context } from "hono";

import { WilayahService } from "./wilayah.service";
import {
	getKecamatanByWilayahSchema,
	getKelurahanByWilayahSchema,
	getWilayahByIdSchema,
	getWilayahSchema,
} from "./wilayah.validation";

export class WilayahController extends BaseSingleton {
	private wilayahService: WilayahService;

	protected constructor() {
		super();
		this.wilayahService = WilayahService.getInstance<WilayahService>();
	}

	// GET /wilayah
	public getAll = async (c: Context) => {
		return this.execute(
			async () => {
				const parsed = getWilayahSchema.safeParse(c.req.query());
				if (!parsed.success) {
					throw new ValidationError(
						"Invalid query parameters",
						parsed.error.flatten().fieldErrors,
					);
				}

				const data = await this.wilayahService.getAll(parsed.data.search);
				return sendSuccess(c, data, "Wilayah retrieved successfully");
			},
			"Failed to process wilayah request",
			"CONTROLLER_WILAYAH_ERROR",
		);
	};

	// GET /wilayah/:id
	public getById = async (c: Context) => {
		return this.execute(
			async () => {
				const parsed = getWilayahByIdSchema.safeParse({
					id: c.req.param("id"),
				});
				if (!parsed.success) {
					throw new ValidationError(
						"Invalid wilayah ID",
						parsed.error.flatten().fieldErrors,
					);
				}

				const data = await this.wilayahService.getById(parsed.data.id);
				return sendSuccess(c, data, "Wilayah retrieved successfully");
			},
			"Failed to process wilayah detail request",
			"CONTROLLER_WILAYAH_ERROR",
		);
	};

	// GET /wilayah/:id/kecamatan
	public getKecamatan = async (c: Context) => {
		return this.execute(
			async () => {
				const parsed = getKecamatanByWilayahSchema.safeParse({
					id: c.req.param("id"),
					...c.req.query(),
				});
				if (!parsed.success) {
					throw new ValidationError(
						"Invalid parameters",
						parsed.error.flatten().fieldErrors,
					);
				}

				const data = await this.wilayahService.getKecamatanByWilayah(
					parsed.data.id,
					parsed.data.search,
				);
				return sendSuccess(c, data, "Kecamatan retrieved successfully");
			},
			"Failed to process kecamatan request",
			"CONTROLLER_KECAMATAN_ERROR",
		);
	};

	// GET /wilayah/:id/kelurahan
	public getKelurahan = async (c: Context) => {
		return this.execute(
			async () => {
				const parsed = getKelurahanByWilayahSchema.safeParse({
					id: c.req.param("id"),
					...c.req.query(),
				});
				if (!parsed.success) {
					throw new ValidationError(
						"Invalid parameters",
						parsed.error.flatten().fieldErrors,
					);
				}

				const data = await this.wilayahService.getKelurahanByWilayah(
					parsed.data.id,
					parsed.data.kecamatan_id,
					parsed.data.search,
				);
				return sendSuccess(c, data, "Kelurahan retrieved successfully");
			},
			"Failed to process kelurahan request",
			"CONTROLLER_KELURAHAN_ERROR",
		);
	};
}
