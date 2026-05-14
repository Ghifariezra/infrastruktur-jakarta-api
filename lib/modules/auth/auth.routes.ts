import { Hono } from "hono";
import { AuthController } from "./auth.controller";
import { apiKeyAuth } from "@middleware/api-key";
import { requireAdmin } from "@middleware/admin-guard";

const authRoutes = new Hono();
const authController = AuthController.getInstance<AuthController>();

authRoutes.post("/keys", authController.generateKey);
authRoutes.post("/keys/revoke", apiKeyAuth, requireAdmin, authController.revokeKey);

export { authRoutes };