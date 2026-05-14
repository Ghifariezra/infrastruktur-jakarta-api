import { Hono } from "hono";
import { WilayahController } from "./wilayah.controller";

const wilayahRoutes = new Hono();

const wilayahController = WilayahController.getInstance<WilayahController>();

wilayahRoutes.get("/", wilayahController.getAll);
wilayahRoutes.get("/:id", wilayahController.getById);
wilayahRoutes.get("/:id/kecamatan", wilayahController.getKecamatan);
wilayahRoutes.get("/:id/kelurahan", wilayahController.getKelurahan);

export { wilayahRoutes };
