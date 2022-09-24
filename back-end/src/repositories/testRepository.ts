import { prisma } from "../database.js";

export async function removeAll() {
    await prisma.$executeRaw`TRUNCATE TABLE recommendations RESTART IDENTITY;`;
  }