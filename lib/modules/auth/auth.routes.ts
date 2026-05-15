import { requireAdmin } from "@middleware/admin-guard";
import { apiKeyAuth } from "@middleware/api-key";
import { Hono } from "hono";
import { AuthController } from "./auth.controller";

const authRoutes = new Hono();
const authController = AuthController.getInstance<AuthController>();

authRoutes.post("/keys", authController.generateKey);
authRoutes.post(
	"/keys/revoke",
	apiKeyAuth,
	requireAdmin,
	authController.revokeKey,
);

export { authRoutes };
