import { Hono } from "hono";
import { HealthFacilityController } from "./health.controller";

const healthRoutes = new Hono();
const healthFacilityController =
	HealthFacilityController.getInstance<HealthFacilityController>();

// /api/v1/facility/
healthRoutes.get("/", healthFacilityController.getAllHealthFacilities);

// /api/v1/facility/nearby?lat=-6.200000&lon=106.816666&radius=2
healthRoutes.get("/nearby", healthFacilityController.getNearbyHealthFacilities);

// RUTE BBOX BARU
// /api/v1/facility/bbox?min_lat=-6.3&min_lon=106.7&max_lat=-6.1&max_lon=106.9
healthRoutes.get("/bbox", healthFacilityController.getFacilitiesInBBox);

export { healthRoutes };
