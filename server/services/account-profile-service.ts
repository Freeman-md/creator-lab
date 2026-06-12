import { prisma } from "@/lib/prisma";
import {
  createAccountProfile,
  findAccountProfileByUserId,
} from "@/server/repositories/account-profile-repository";
import {
  createProfileVersion,
  findProfileVersionByUserIdAndVersion,
} from "@/server/repositories/profile-version-repository";
import { isUniqueConstraintError } from "@/lib/utils";

const INITIAL_PROFILE_VERSION = {
  version: 1,
  writingPreferences: [] as string[],
  contentPatterns: [] as string[],
  revisionPatterns: [] as string[],
  avoidPatterns: [] as string[],
  userInstructions: [] as string[],
};

export async function ensureAccountProfile(userId: string) {
  return prisma.$transaction(async (tx) => {
    const existingProfile = await findAccountProfileByUserId(userId, tx);

    if (existingProfile) {
      return existingProfile;
    }

    let versionOneProfile = await findProfileVersionByUserIdAndVersion(
      userId,
      INITIAL_PROFILE_VERSION.version,
      tx
    );

    if (!versionOneProfile) {
      try {
        versionOneProfile = await createProfileVersion(
          {
            userId,
            ...INITIAL_PROFILE_VERSION,
          },
          tx,
        );
      } catch (error) {
        if (
          isUniqueConstraintError(error)
        ) {
          const conflictedVersion =
            await findProfileVersionByUserIdAndVersion(
              userId,
              INITIAL_PROFILE_VERSION.version,
              tx,
            );

          if (conflictedVersion) {
            versionOneProfile = conflictedVersion;
          } else {
            throw error;
          }
        } else {
          throw error;
        }
      }
    }

    try {
      return await createAccountProfile(
        {
          userId,
          currentProfileVersionId: versionOneProfile.id,
        },
        tx,
      );
    } catch (error) {
      if (
        isUniqueConstraintError(error)
      ) {
        const conflictedProfile = await findAccountProfileByUserId(userId, tx);

        if (conflictedProfile) {
          return conflictedProfile;
        }
      }

      throw error;
    }
  });
}
