import { BaseController } from "@core/base.controller";
import { ValidationError } from "@core/error";
import { sendSuccess } from "@shared/response";
import type { Context } from "hono";
import { StatsService } from "./stats.service";
import {
	statsBlankSpotSchema,
	statsDensitySchema,
	statsKecamatanSchema,
	statsWilayahSchema,
} from "./stats.validation";

export class StatsController extends BaseController {
	// private statsService: StatsService;

	// protected constructor() {
	// 	super();
	// 	this.statsService = StatsService.getInstance<StatsService>();
	// }

	private statsService = StatsService.getInstance<StatsService>();

	// Daftarkan semua service — BaseController akan auto-init sebelum handler
	protected get services() {
		return [this.statsService];
	}

	public getSummary = async (
		c: Context<{ Bindings: Env; Variables: HonoVariables }>,
	) => {
		return this.handle(
			c,
			async () => {
				const data = await this.statsService.getSummary();
				return sendSuccess(c, data, "Summary retrieved successfully");
			},
			"Failed to process summary request",
			"CONTROLLER_STATS_ERROR",
		);
	};

	public getStatsWilayah = async (
		c: Context<{ Bindings: Env; Variables: HonoVariables }>,
	) => {
		return this.handle(
			c,
			async () => {
				const parsed = statsWilayahSchema.safeParse(c.req.query());
				if (!parsed.success) {
					throw new ValidationError(
						"Invalid query parameters",
						parsed.error.flatten().fieldErrors,
					);
				}
				const data = await this.statsService.getStatsPerWilayah(parsed.data);
				return sendSuccess(c, data, "Stats per wilayah retrieved successfully");
			},
			"Failed to process stats wilayah request",
			"CONTROLLER_STATS_ERROR",
		);
	};

	public getStatsJenis = async (
		c: Context<{ Bindings: Env; Variables: HonoVariables }>,
	) => {
		return this.handle(
			c,
			async () => {
				const data = await this.statsService.getStatsPerJenis();
				return sendSuccess(c, data, "Stats per jenis retrieved successfully");
			},
			"Failed to process stats jenis request",
			"CONTROLLER_STATS_ERROR",
		);
	};

	public getStatsKecamatan = async (
		c: Context<{ Bindings: Env; Variables: HonoVariables }>,
	) => {
		return this.handle(
			c,
			async () => {
				const parsed = statsKecamatanSchema.safeParse(c.req.query());
				if (!parsed.success) {
					throw new ValidationError(
						"Invalid query parameters",
						parsed.error.flatten().fieldErrors,
					);
				}
				const data = await this.statsService.getStatsPerKecamatan(parsed.data);
				return sendSuccess(
					c,
					data,
					"Stats per kecamatan retrieved successfully",
				);
			},
			"Failed to process stats kecamatan request",
			"CONTROLLER_STATS_ERROR",
		);
	};

	public getDensity = async (
		c: Context<{ Bindings: Env; Variables: HonoVariables }>,
	) => {
		return this.handle(
			c,
			async () => {
				const parsed = statsDensitySchema.safeParse(c.req.query());
				if (!parsed.success) {
					throw new ValidationError(
						"Invalid query parameters",
						parsed.error.flatten().fieldErrors,
					);
				}
				const data = await this.statsService.getDensityScore(parsed.data);
				return sendSuccess(c, data, "Density score retrieved successfully");
			},
			"Failed to process density request",
			"CONTROLLER_STATS_ERROR",
		);
	};

	public getBlankSpot = async (
		c: Context<{ Bindings: Env; Variables: HonoVariables }>,
	) => {
		return this.handle(
			c,
			async () => {
				const parsed = statsBlankSpotSchema.safeParse(c.req.query());
				if (!parsed.success) {
					throw new ValidationError(
						"Invalid query parameters",
						parsed.error.flatten().fieldErrors,
					);
				}
				const data = await this.statsService.getBlankSpot(parsed.data);
				return sendSuccess(c, data, "Blank spot data retrieved successfully");
			},
			"Failed to process blank spot request",
			"CONTROLLER_STATS_ERROR",
		);
	};
}
