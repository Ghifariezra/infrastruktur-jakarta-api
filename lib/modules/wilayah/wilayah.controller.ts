import { BaseController } from "@core/base.controller";
import { ValidationError } from "@core/error";
import { sendSuccess } from "@shared/response";
import type { Context } from "hono";
import { WilayahService } from "./wilayah.service";
import {
	getKecamatanByWilayahSchema,
	getKelurahanByWilayahSchema,
	getWilayahByIdSchema,
	getWilayahSchema,
} from "./wilayah.validation";

export class WilayahController extends BaseController {
	private wilayahService = WilayahService.getInstance<WilayahService>();

	protected get services() {
		return [this.wilayahService];
	}

	public getAll = async (
		c: Context<{ Bindings: Env; Variables: HonoVariables }>,
	) => {
		return this.handle(
			c,
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

	public getById = async (
		c: Context<{ Bindings: Env; Variables: HonoVariables }>,
	) => {
		return this.handle(
			c,
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

	public getKecamatan = async (
		c: Context<{ Bindings: Env; Variables: HonoVariables }>,
	) => {
		return this.handle(
			c,
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

	public getKelurahan = async (
		c: Context<{ Bindings: Env; Variables: HonoVariables }>,
	) => {
		return this.handle(
			c,
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
