import { createPost } from "@/server/repositories/post-repository";

type CreateDraftPostInput = {
  userId: string;
  profileVersionId: string;
  title?: string | null;
  draftContent: string;
  supportingContext?: string | null;
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
