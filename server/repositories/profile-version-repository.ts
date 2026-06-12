import { type Prisma } from "@prisma/client";
import { prisma, type PrismaDbClient } from "@/lib/prisma";

export function findProfileVersionByUserIdAndVersion(
  userId: string,
  version: number,
  db: PrismaDbClient = prisma,
) {
  return db.profileVersion.findUnique({
    where: {
      userId_version: {
        userId,
        version,
      },
    },
  });
}

export function createProfileVersion(
  data: Prisma.ProfileVersionCreateInput,
  db: PrismaDbClient = prisma,
) {
  return db.profileVersion.create({
    data,
  });
}

export function listProfileVersionsForUser(
  userId: string,
  db: PrismaDbClient = prisma,
) {
  return db.profileVersion.findMany({
    where: {
      userId,
    },
    orderBy: {
      version: "desc",
    },
  });
}
