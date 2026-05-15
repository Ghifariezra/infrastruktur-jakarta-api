import { BaseController } from "@core/base.controller";
import { ValidationError } from "@core/error";
// import { BaseSingleton } from "@core/singleton";
import { HealthFacilityService } from "@modules/facility/health.service";
import {
	getBBoxFacilitiesSchema,
	getFacilitiesQuerySchema,
	getNearbyFacilitiesQuerySchema,
} from "@modules/facility/health.validation";
import { sendSuccess } from "@shared/response";
import type { Context } from "hono";

export class HealthFacilityController extends BaseController {
	// private facilityService: HealthFacilityService;

	// protected constructor() {
	// 	super();
	// 	this.facilityService =
	// 		HealthFacilityService.getInstance<HealthFacilityService>();
	// }

	private facilityService =
		HealthFacilityService.getInstance<HealthFacilityService>();

	protected get services() {
		return [this.facilityService];
	}

	public getAllHealthFacilities = async (
		c: Context<{ Bindings: Env; Variables: HonoVariables }>,
	) => {
		return this.handle(
			c,
			async () => {
				const developer = c.get("developer") as {
					tier: string;
					developer_name: string;
				};

				const query = c.req.query();
				const parsed = getFacilitiesQuerySchema.safeParse(query);

				if (!parsed.success) {
					throw new ValidationError(
						"Invalid pagination parameters",
						parsed.error.flatten().fieldErrors,
					);
				}

				let { limit, offset } = parsed.data;

				if (developer?.tier !== "admin") {
					if (limit > 100) {
						limit = 100;
					}
				}

				const data = await this.facilityService.getFacilities(limit, offset);

				return sendSuccess(
					c,
					data,
					developer?.tier === "admin"
						? "Facilities retrieved successfully"
						: `Facilities retrieved with pagination (limited to ${limit} per request for public tier)`,
				);
			},
			"Failed to process health facility request",
			"CONTROLLER_HEALTH_ERROR",
		);
	};

	public getNearbyHealthFacilities = async (
		c: Context<{ Bindings: Env; Variables: HonoVariables }>,
	) => {
		return this.handle(
			c,
			async () => {
				const developer = c.get("developer") as { tier: string };

				const query = c.req.query();
				const parsed = getNearbyFacilitiesQuerySchema.safeParse(query);

				if (!parsed.success) {
					throw new ValidationError(
						"Invalid spatial query parameters",
						parsed.error.flatten().fieldErrors,
					);
				}

				let { lat, lon, radius } = parsed.data;

				if (developer?.tier !== "admin" && radius > 5) {
					radius = 5;
				}

				const data = await this.facilityService.getFacilitiesNearby(
					lat,
					lon,
					radius,
				);

				return sendSuccess(c, data, `Facilities within ${radius}km retrieved`);
			},
			"Failed to process nearby facility request",
			"CONTROLLER_HEALTH_ERROR",
		);
	};

	public getFacilitiesInBBox = async (
		c: Context<{ Bindings: Env; Variables: HonoVariables }>,
	) => {
		return this.handle(
			c,
			async () => {
				const developer = c.get("developer") as { tier: string };

				const query = c.req.query();
				const parsed = getBBoxFacilitiesSchema.safeParse(query);

				if (!parsed.success) {
					throw new ValidationError(
						"Invalid BBox parameters",
						parsed.error.flatten().fieldErrors,
					);
				}

				const { min_lat, min_lon, max_lat, max_lon } = parsed.data;

				if (developer?.tier !== "admin") {
					const latDiff = Math.abs(max_lat - min_lat);
					const lonDiff = Math.abs(max_lon - min_lon);

					if (latDiff > 0.1 || lonDiff > 0.1) {
						throw new ValidationError(
							"Bounding box area is too large for public tier.",
							{
								hint: "Maximum allowed difference between min/max coordinates is 0.1 degrees (~11 KM).",
							},
						);
					}
				}
				// =================================================================

				const data = await this.facilityService.getFacilitiesInBBox(
					min_lat,
					min_lon,
					max_lat,
					max_lon,
				);

				return sendSuccess(
					c,
					data,
					"Facilities within BBox retrieved successfully",
				);
			},
			"Failed to process BBox request",
			"CONTROLLER_HEALTH_ERROR",
		);
	};
}
