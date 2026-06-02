import "dotenv/config";
import { app } from "./src/app.js";
import { config } from "./src/config/env.js";
import { prisma } from "./src/config/prisma.js"
import { redis } from "./src/config/redis.js"
import http from "node:http2";

async function startServer() {
    try {
        // start the db connecttion
        const server = http.createServer(app);

        await prisma.$connect();
        console.log("✅ Database connected");

        await redis.connect();
        await redis.ping();
        console.log("✅ Redis connected");

        server.listen(config.PORT, () => {
            console.log(`✅ Server running on port ${config.PORT}`);
            if (process.env.NODE_ENV === "development") {
                console.log("✅ Running in dev mode");
            }
        })

    } catch (error) {
        console.error("error starting server", error.message);
        await prisma.$disconnect();
        await redis.quite();
        process.exit(1);
    }
}

startServer();
