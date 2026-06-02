import Redis from "ioredis"
import { config } from "./env.js"

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
                console.error("[Redis] Max retry reached , giving up");
                return null;
            }

            const delay = Math.min(times * 200, 2000);
            console.warn(`[Redis] Retrying connection.. attempt ${times} (${delay}ms)`)
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
    globalForRedis.redis.on("connect", () => console.log("Redis connected"));
    globalForRedis.redis.on("ready", () => console.log("Redis ready"));
    globalForRedis.redis.on("error", (err) => console.error("[Redis] Error:", err.message));
    globalForRedis.redis.on("close", () => console.warn("[Redis] connetion closed"));
    globalForRedis.redis.on("reconnecting",   () => console.warn("[Redis] Reconnecting..."));
    globalForRedis.redis.on("end",            () => console.warn("[Redis] Connection ended"));

    const shutdown = async () => {
        console.log("Shuting down Redis..");
        await globalForRedis.redis.quite();
        process.exit(0);
    };

    process.once("SIGINT", shutdown);
    process.once("SIGTERM", shutdown);

}

export const redis = globalForRedis.redis;
