// import { PrismaClient } from "@prisma/client"
 
// const globalForPrisma = globalThis as unknown as { prisma: PrismaClient }
 
// export const prisma = globalForPrisma.prisma || new PrismaClient()
 
// if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma
import { PrismaClient } from '@prisma/client';

const prismaClientSingleton = () => {
  return new PrismaClient();
};

declare global {
  var prisma: undefined | ReturnType<typeof prismaClientSingleton>;
}

const prisma = globalThis.prisma ?? prismaClientSingleton();
async () => {
  await prisma.$connect()
  // console.log("connected to db");
  
}
export default prisma;

if (process.env.NODE_ENV !== 'production') globalThis.prisma = prisma;