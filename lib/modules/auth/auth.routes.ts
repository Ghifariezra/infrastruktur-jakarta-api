import { Hono } from "hono";
import { AuthController } from "./auth.controller";
import { apiKeyAuth } from "@middleware/api-key";
import { requireAdmin } from "@middleware/admin-guard";

const authRoutes = new Hono();
const authController = AuthController.getInstance<AuthController>();

// POST /api/v1/auth/keys
authRoutes.post("/keys", authController.generateKey);

// POST /api/v1/auth/keys/revoke
authRoutes.post("/keys/revoke", apiKeyAuth, requireAdmin, authController.revokeKey);

export { authRoutes };