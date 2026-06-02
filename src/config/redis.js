import Redis from "ioredis";
import { config } from "./env.js";
import { logger } from "../utils/logger.js";

const globalForRedis = globalThis;

if (!globalForRedis.redis) {
    const redisConfig = {
        // -- TLS
        tls: config.REDIS_TLS ? { rejectUnauthorized: true } : undefined,

        // ---- Retry Strategy
        retryStrategy(times) {
            if (times > 5) {
                logger.error("[Redis] Max retry reached, giving up");
                return null;
            }

            const delay = Math.min(times * 200, 2000);
            logger.warn(`[Redis] Retrying connection.. attempt ${times} (${delay}ms)`);
            return delay;
        },
        
        // -- Timeout (Fixed typo: commandTimout -> commandTimeout)
        connectionTimeout: 10_000, 
        commandTimeout: 5_000, 
        keepAlive: 30_000,

        // -- Reconnect on error 
        reconnectOnError(err) {
            const targetErrors = ["READONLY", "ECONNRESET", "ETIMEDOUT"];
            return targetErrors.some((e) => err.message.includes(e));
        },

        // -- misc (Set to null if you use BullMQ queues, otherwise 3 is fine)
        maxRetriesPerRequest: 3, 
        enableReadyCheck: true,
        lazyConnect: true,
    };

    if (config.REDIS_URL) {
        // Force-parse the public URL to extract host, port, and password cleanly
        const redisUrl = new URL(config.REDIS_URL);

        globalForRedis.redis = new Redis({
            ...redisConfig,
            host: redisUrl.hostname,
            port: parseInt(redisUrl.port),
            password: redisUrl.password || undefined,
            username: redisUrl.username || undefined,
        });
    } else {
        globalForRedis.redis = new Redis(redisConfig);
    }


    globalForRedis.redis = config.REDIS_URL 
        ? new Redis(config.REDIS_URL, redisConfig)
        : new Redis(redisConfig);

    // -- Events
    globalForRedis.redis.on("connect", () => logger.info("✅ Database connected"));
    globalForRedis.redis.on("ready", () => logger.info("✅ Redis ready"));
    globalForRedis.redis.on("error", (err) => logger.error("[Redis] Error:", err.message));
    globalForRedis.redis.on("close", () => logger.warn("[Redis] Connection closed"));
    globalForRedis.redis.on("reconnecting", () => logger.warn("[Redis] Reconnecting..."));
    globalForRedis.redis.on("end", () => logger.warn("[Redis] Connection ended"));

    const shutdown = async () => {
        logger.info("Shutting down Redis..");
        try {
            // Fixed typo: quite() -> quit()
            await globalForRedis.redis.quit();
        } catch (err) {
            logger.error("[Redis] Error during disconnect:", err);
        } finally {
            process.exit(0);
        }
    };

    process.once("SIGINT", shutdown);
    process.once("SIGTERM", shutdown);
}

export const redis = globalForRedis.redis;
