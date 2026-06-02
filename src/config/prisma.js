const { PrismaPg } = require("@prisma/adapter-pg");
const { PrismaClient } = require("@prisma/client");
const { Pool } = require("pg");

const globalForPrisma = global;

if (!globalForPrisma.prisma) {
    const connectionString = config.DATABASE_URL;
    const pool  = new Pool({ connectionString })
    const adapter = new PrismaPg(pool);

    globalForPrisma.prisma = new PrismaClient({
        adapter,
        log: 
        config.NODE_ENV === 'development'
        ? ["query", "error","warn"]
        : ["error", "warn"]
    })
}

const prisma = globalForPrisma.prisma;

module.exports = { prisma };
