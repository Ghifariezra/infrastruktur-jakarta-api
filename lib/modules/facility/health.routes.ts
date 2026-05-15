import { Hono } from "hono";
import { HealthFacilityController } from "./health.controller";

const healthRoutes = new Hono();
const healthFacilityController =
	HealthFacilityController.getInstance<HealthFacilityController>();

healthRoutes.get("/", healthFacilityController.getAllHealthFacilities);
healthRoutes.get("/nearby", healthFacilityController.getNearbyHealthFacilities);
healthRoutes.get("/bbox", healthFacilityController.getFacilitiesInBBox);

export { healthRoutes };
