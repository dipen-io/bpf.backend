import "dotenv/config";
import { app } from "./src/app.js";
import { config } from "./src/config/env.js";
import { prisma } from "./src/config/prisma.js"
import { redis } from "./src/config/redis.js"
import http from "node:http";
import { logger } from "./src/utils/logger.js"


async function startServer() {
    try {

        const server = http.createServer(app);

        await prisma.$connect();

        await redis.connect();
        await redis.ping();
        logger.info("✅ Redis connected");

        server.listen(config.PORT, () => {
            logger.info(`✅ Server running on port ${config.PORT}`);
            if (process.env.NODE_ENV === "development") {
                logger.info("✅ Running in dev mode");
            }
        })

    } catch (error) {
        logger.error("error starting server", error.message);

        // Clean infrastructure disconnections on boot failure
        try {
            await prisma.$disconnect();
            await redis.quit();
        } catch (cleanupError) {
            logger.error("Error cleaning up connections during crash:", cleanupError.message);
        }
        process.exit(1);
    }
}

startServer();
