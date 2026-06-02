import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "@prisma/client";
import { Pool } from "pg";
import { config } from "../config/env.js";

const globalForPrisma = globalThis;

if (!globalForPrisma.prisma) {
  const pool = new Pool({
    connectionString: config.DATABASE_URL,
    max: config.DB_POOL_MAX,
    idleTimeoutMillis: 30_000,
    connectionTimeoutMillis: 5_000,
    ssl: config.NODE_ENV === "production" ? { rejectUnauthorized: true } : false,
  });

  pool.on("error", (err) => console.error("[DB] Pool error:", err));

  globalForPrisma.prisma = new PrismaClient({
    adapter: new PrismaPg(pool),
    log: [
      { emit: "event", level: "error" },
      { emit: "event", level: "warn" },
      ...(config.NODE_ENV === "development"
        ? [{ emit: "event", level: "query" }]
        : []),
    ],
  });

  globalForPrisma.prisma.$on("error", (e) => console.error("[Prisma Error]", e));
  globalForPrisma.prisma.$on("warn", (e) => console.warn("[Prisma Warn]", e));

  if (config.NODE_ENV === "development") {
    globalForPrisma.prisma.$on("query", (e) => {
      console.log(`[Query] ${e.query} — ${e.duration}ms`);
    });
  }

  const shutdown = async () => {
    console.log("SIGTERM received, disconnecting Prisma...");
    await globalForPrisma.prisma.$disconnect();
    await pool.end();
    process.exit(0);
  };

  process.once("SIGINT", shutdown);
  process.once("SIGTERM", shutdown);
}

export const prisma = globalForPrisma.prisma;
