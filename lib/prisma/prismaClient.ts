import { PrismaClient } from '@prisma/client';

// Add prisma to the global object
declare global {
    // eslint-disable-next-line no-var
    var prisma: PrismaClient | undefined; // need to use var for global context, const or let won't work
}

// Use a global instance in development, and a new instance in production
export const prisma =
    global.prisma ||
    new PrismaClient({
        log: ['query', 'info', 'warn', 'error'],
    });

if (process.env.NODE_ENV !== 'production') {
    global.prisma = prisma;
}
