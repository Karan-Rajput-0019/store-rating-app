const { PrismaClient } = require('@prisma/client');

// Prisma 7+ expects the datasource URL to be provided via the client options.
const prisma = new PrismaClient({
  datasourceUrl: process.env.DATABASE_URL,
});

module.exports = prisma;

