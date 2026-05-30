import { PrismaClient } from '@prisma/client';

// Singleton Prisma client para uso na rota /health (dynamic import)
export const prisma = new PrismaClient();
