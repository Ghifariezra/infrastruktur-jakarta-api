import { Hono } from "hono";
import { StatsController } from "./stats.controller";

const statsRoutes = new Hono();

const statsController = StatsController.getInstance<StatsController>();

statsRoutes.get("/summary", statsController.getSummary);
statsRoutes.get("/wilayah", statsController.getStatsWilayah);
statsRoutes.get("/jenis", statsController.getStatsJenis);
statsRoutes.get("/kecamatan", statsController.getStatsKecamatan);
statsRoutes.get("/density", statsController.getDensity);
statsRoutes.get("/blank-spot", statsController.getBlankSpot);

export { statsRoutes };
