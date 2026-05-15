import { env } from "@config/env";
import { serve } from "@hono/node-server";
import { logger } from "@shared/logger";
import app from "./index";

const port = Number(env.PORT) || 3000;

serve(
    { fetch: app.fetch, port },
    (info) => {
        logger.info(
            `🚀 Server running in ${env.NODE_ENV} mode on http://localhost:${info.port}`,
        );
    },
);