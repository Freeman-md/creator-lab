import { createPost } from "@/server/repositories/post-repository";
import { ensureAccountProfile } from "@/server/services/account-profile-service";

type CreateDraftPostInput = {
  userId: string;
  profileVersionId: string;
  title?: string | null;
  draftContent: string;
  supportingContext?: string | null;
  referenceUrls?: string[];
};

type CreateDraftPostForUserInput = {
  userId: string;
  title?: string;
  draftContent: string;
  supportingContext?: string;
  referenceUrls?: string[];
};


export async function createDraftPost(input: CreateDraftPostInput) {
  return createPost({
    userId: input.userId,
    profileVersionId: input.profileVersionId,
    title: input.title ?? null,
    draftContent: input.draftContent,
    supportingContext: input.supportingContext ?? null,
    referenceUrls: input.referenceUrls ?? [],
    status: "draft",
  });
}

export async function createDraftPostForUser(
  input: CreateDraftPostForUserInput,
) {
  const accountProfile = await ensureAccountProfile(input.userId);

  const post = await createDraftPost({
    userId: input.userId,
    profileVersionId: accountProfile.currentProfileVersionId,
    title: input.title,
    draftContent: input.draftContent,
    supportingContext: input.supportingContext,
    referenceUrls: input.referenceUrls,
  });

  return {
    postId: post.id,
  };
}
