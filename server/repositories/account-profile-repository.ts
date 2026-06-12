import { type Prisma, type AccountProfile } from "@prisma/client";
import { prisma, type PrismaDbClient } from "@/lib/prisma";

export function findAccountProfileByUserId(
  userId: string,
  db: PrismaDbClient = prisma,
) {
  return db.accountProfile.findUnique({
    where: {
      userId,
    },
  });
}

export function findAccountProfileWithCurrentVersion(
  userId: string,
  db: PrismaDbClient = prisma,
) {
  return db.accountProfile.findUnique({
    where: {
      userId,
    },
    include: {
      currentProfileVersion: true,
    },
  });
}

export function createAccountProfile(
  data: Prisma.AccountProfileCreateInput,
  db: PrismaDbClient = prisma,
) {
  return db.accountProfile.create({
    data,
  });
}

export function updateAccountProfileCurrentVersion(
  profileId: AccountProfile["id"],
  currentProfileVersionId: AccountProfile["currentProfileVersionId"],
  db: PrismaDbClient = prisma,
) {
  return db.accountProfile.update({
    where: {
      id: profileId,
    },
    data: {
      currentProfileVersionId,
    },
  });
}
