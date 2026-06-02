import Redis from "ioredis"
import { config } from "./env.js"
import { logger } from "../utils/logger.js";

const globalForRedis = globalThis;

if (!globalForRedis.redis) {
    const redisConfig = {
        // ---- Connection 
        host: config.REDIS_HOST,
        port: config.REDIS_PORT,
        password: config.REDIS_PASSWORD,
        db: config.REDIS_DB,

        // --TLS
        tls: config.REDIS_TLS ? {  rejectUnauthorized: true } : undefined,

        // ---- Retry Strategy
        retryStrategy(times) {
            if (times > 5) {
                logger.error("[Redis] Max retry reached , giving up");
                return null;
            }

            const delay = Math.min(times * 200, 2000);
            logger.warn(`[Redis] Retrying connection.. attempt ${times} (${delay}ms)`)
            return delay;
        },
        // -- Timeout
        connectionTimeout: 10_000, 
        commandTimout: 5_000,
        keepAlive: 30_000,

        // -- Reconnet on error 
        reconnectOnError(err) {
            const targetErrors = ["READONLY", "ECONNRESET", "ETIMEDOUT"];
            return targetErrors.some((e) => err.message.includes(e));
        },

        // -- misc
        maxRetriesPerRequest: 3,
        enableReadyCheck: true,
        lazyConnect: true,
    };

    globalForRedis.redis = config.REDIS_URL 
    ? new Redis(config.REDIS_URL, redisConfig)
    : new Redis(redisConfig);

    // -- Events
    globalForRedis.redis.on("connect", () => logger.info("✅ Database connected"));
    globalForRedis.redis.on("ready", () => logger.info("✅ Redis ready"));
    globalForRedis.redis.on("error", (err) => logger.error("[Redis] Error:", err.message));
    globalForRedis.redis.on("close", () => logger.warn("[Redis] connetion closed"));
    globalForRedis.redis.on("reconnecting",   () => logger.warn("[Redis] Reconnecting..."));
    globalForRedis.redis.on("end",            () => logger.warn("[Redis] Connection ended"));

    const shutdown = async () => {
        logger.info("Shuting down Redis..");
        await globalForRedis.redis.quite();
        process.exit(0);
    };

    process.once("SIGINT", shutdown);
    process.once("SIGTERM", shutdown);

}

export const redis = globalForRedis.redis;
