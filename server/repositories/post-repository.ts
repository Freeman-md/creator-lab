import { type Post, type Prisma } from "@prisma/client";
import { prisma, type PrismaDbClient } from "@/lib/prisma";

export function createPost(
  data: Prisma.PostCreateInput | Prisma.PostUncheckedCreateInput,
  db: PrismaDbClient = prisma,
) {
  return db.post.create({
    data,
  });
}

export function findPostById(
  id: Post["id"],
  db: PrismaDbClient = prisma,
) {
  return db.post.findUnique({
    where: {
      id,
    },
  });
}

export function findPostsByUserId(
  userId: Post["userId"],
  db: PrismaDbClient = prisma,
) {
  return db.post.findMany({
    where: {
      userId,
    },
    orderBy: {
      createdAt: "desc",
    },
  });
}

export function updatePost(
  id: Post["id"],
  data: Prisma.PostUpdateInput | Prisma.PostUncheckedUpdateInput,
  db: PrismaDbClient = prisma,
) {
  return db.post.update({
    where: {
      id,
    },
    data,
  });
}
