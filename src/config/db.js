const { PrismaClient } = require('@prisma/client');

// Prisma 7+ reads DATABASE_URL from environment variables automatically
const prisma = new PrismaClient();

module.exports = prisma;

