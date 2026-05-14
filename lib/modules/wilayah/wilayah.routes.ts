import { Hono } from "hono";
import { WilayahController } from "./wilayah.controller";

const wilayahRoutes = new Hono();

const wilayahController = WilayahController.getInstance<WilayahController>();

// Static routes HARUS di atas dynamic /:id
// agar "/wilayah/kecamatan" tidak tertangkap sebagai id

// GET /api/v1/wilayah
wilayahRoutes.get("/", wilayahController.getAll);

// GET /api/v1/wilayah/:id
wilayahRoutes.get("/:id", wilayahController.getById);

// GET /api/v1/wilayah/:id/kecamatan?search=
wilayahRoutes.get("/:id/kecamatan", wilayahController.getKecamatan);

// GET /api/v1/wilayah/:id/kelurahan?kecamatan_id=&search=
wilayahRoutes.get("/:id/kelurahan", wilayahController.getKelurahan);

export { wilayahRoutes };
