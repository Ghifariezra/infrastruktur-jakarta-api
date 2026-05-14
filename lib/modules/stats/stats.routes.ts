import { Hono } from "hono";
import { StatsController } from "./stats.controller";

const statsRoutes = new Hono();

const statsController = StatsController.getInstance<StatsController>();

// GET /api/v1/stats/summary
statsRoutes.get("/summary", statsController.getSummary);

// GET /api/v1/stats/wilayah?nama_wilayah=
statsRoutes.get("/wilayah", statsController.getStatsWilayah);

// GET /api/v1/stats/jenis
statsRoutes.get("/jenis", statsController.getStatsJenis);

// GET /api/v1/stats/kecamatan?nama_wilayah=&nama_kecamatan=
statsRoutes.get("/kecamatan", statsController.getStatsKecamatan);

// GET /api/v1/stats/density?nama_wilayah=&order=asc|desc
statsRoutes.get("/density", statsController.getDensity);

// GET /api/v1/stats/blank-spot?jenis=Klinik Pratama&nama_wilayah=
statsRoutes.get("/blank-spot", statsController.getBlankSpot);

export { statsRoutes };
