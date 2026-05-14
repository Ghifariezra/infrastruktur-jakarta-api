import { env } from "@config/env";
import { AppError, NotFoundError } from "@core/error";
import { serve } from "@hono/node-server";
import { requireAdmin } from "@middleware/admin-guard";
import { apiKeyAuth } from "@middleware/api-key";
import { publicCache } from "@middleware/cache";
// Middlewares
import { corsMiddleware } from "@middleware/cors";
import { rateLimitMiddleware } from "@middleware/rate-limit";
import { requestLogger } from "@middleware/request-logger";
import { authRoutes } from "@modules/auth/auth.routes";
// Routes
import { healthRoutes } from "@modules/facility/health.routes";
import { statsRoutes } from "@modules/stats/stats.routes";
import { wilayahRoutes } from "@modules/wilayah/wilayah.routes";
import { logger } from "@shared/logger";
import { sendError } from "@shared/response";
import { Hono } from "hono";
import { prettyJSON } from "hono/pretty-json";
import { secureHeaders } from "hono/secure-headers";

const app = new Hono();

// 1. Global Middlewares (Aman untuk semua endpoint)
app.use("*", requestLogger);
app.use("*", secureHeaders()); // Hardening: Aktif!
app.use("*", corsMiddleware);
app.use("*", rateLimitMiddleware);
app.use("*", prettyJSON({ space: 4, force: true }));

// 2. Register Routes
app.route("/api/v1/auth", authRoutes);

// B. Pasang Middleware Auth
app.use("/api/v1/facility/*", apiKeyAuth);
app.use("/api/v1/wilayah/*", apiKeyAuth);
app.use("/api/v1/stats/*", apiKeyAuth, requireAdmin);

// C. Pasang Cache SETELAH Auth
// (Hanya data yang valid dan sudah terpotong kuotanya yang di-cache)
app.use("/api/v1/facility/*", publicCache);
app.use("/api/v1/wilayah/*", publicCache);
app.use("/api/v1/stats/*", publicCache);

// D. Register Data Routes
app.route("/api/v1/facility", healthRoutes);
app.route("/api/v1/wilayah", wilayahRoutes);
app.route("/api/v1/stats", statsRoutes);
// ----------------------------------------------------

// 3. Fallback Route (404)
app.notFound((c) => {
	throw new NotFoundError(`Route ${c.req.path}`);
});

// 4. Global Error Handler
app.onError((err, c) => {
	logger.error(err.message, err.stack);

	if (err instanceof AppError) {
		return sendError(c, err.message, err.statusCode, {
			code: err.code,
			...((err.details as object) || {}),
		}) as unknown as Response;
	}

	return sendError(c, "Internal Server Error", 500) as unknown as Response;
});

// 5. Start Server
const port = env.PORT;
serve(
	{
		fetch: app.fetch,
		port: port,
	},
	(info) => {
		logger.info(
			`🚀 Server running in ${env.NODE_ENV} mode on http://localhost:${info.port}`,
		);
	},
);
