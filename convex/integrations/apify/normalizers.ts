import { getLinkedInPublicIdentifierFromUrl } from "../../lib/linkedin";

export type LinkedInImportCounts = {
  fetched: number;
  imported: number;
  skippedDuplicate: number;
  skippedInvalid: number;
  skippedRepost: number;
  skippedNonOwned: number;
  metricsUpdated: number;
  failed: number;
};

export type LinkedInProfileIdentity = {
  linkedinProfileUrl: string;
  linkedinPublicIdentifier?: string;
  linkedinAuthorId?: string;
};

export type NormalizedLinkedInPost = {
  body: string;
  publishedDateTime: string;
  linkedinPostId: string;
  linkedinUrl: string;
  authorId?: string;
  authorPublicIdentifier?: string;
  metrics: {
    impressions: number;
    reactions: number;
    likes: number;
    comments: number;
    reposts: number;
    shares: number;
    profileVisits: number;
    reactionBreakdown: Record<string, number>;
  };
};

type LinkedInPostSearchItem = {
  type?: unknown;
  id?: unknown;
  entityId?: unknown;
  linkedinUrl?: unknown;
  content?: unknown;
  author?: {
    id?: unknown;
    publicIdentifier?: unknown;
    linkedinUrl?: unknown;
  };
  postedAt?: {
    date?: unknown;
  };
  engagement?: {
    likes?: unknown;
    comments?: unknown;
    shares?: unknown;
    reactions?: unknown;
  };
  repostedAt?: unknown;
  repostedBy?: unknown;
  repost?: unknown;
  repostId?: unknown;
};

export const emptyLinkedInImportCounts = (): LinkedInImportCounts => ({
  fetched: 0,
  imported: 0,
  skippedDuplicate: 0,
  skippedInvalid: 0,
  skippedRepost: 0,
  skippedNonOwned: 0,
  metricsUpdated: 0,
  failed: 0,
});

export function normalizeLinkedInPostSearchItems(
  items: unknown[],
  profile: LinkedInProfileIdentity
) {
  const counts = emptyLinkedInImportCounts();
  counts.fetched = items.length;

  const posts: NormalizedLinkedInPost[] = [];

  for (const item of items) {
    const post = item as LinkedInPostSearchItem;

    if (isRepost(post)) {
      counts.skippedRepost += 1;
      continue;
    }

    if (!hasRequiredPostFields(post)) {
      counts.skippedInvalid += 1;
      continue;
    }

    if (!isOwnedByProfile(post, profile)) {
      counts.skippedNonOwned += 1;
      continue;
    }

    const normalized = toNormalizedLinkedInPost(post);
    if (!normalized) {
      counts.skippedInvalid += 1;
      continue;
    }

    posts.push(normalized);
  }

  return { posts, counts };
}

function isRepost(item: LinkedInPostSearchItem) {
  return Boolean(
    item.repostedAt || item.repostedBy || item.repost || item.repostId
  );
}

function hasRequiredPostFields(item: LinkedInPostSearchItem) {
  return (
    item.type === "post" &&
    typeof item.content === "string" &&
    item.content.trim().length > 0 &&
    typeof (item.entityId ?? item.id) === "string" &&
    typeof item.linkedinUrl === "string" &&
    typeof item.postedAt?.date === "string" &&
    !Number.isNaN(new Date(item.postedAt.date).getTime())
  );
}

function isOwnedByProfile(
  item: LinkedInPostSearchItem,
  profile: LinkedInProfileIdentity
) {
  const expectedPublicIdentifier =
    profile.linkedinPublicIdentifier ??
    getLinkedInPublicIdentifierFromUrl(profile.linkedinProfileUrl);
  const authorPublicIdentifier =
    typeof item.author?.publicIdentifier === "string"
      ? item.author.publicIdentifier
      : getLinkedInPublicIdentifierFromUrl(
          typeof item.author?.linkedinUrl === "string"
            ? item.author.linkedinUrl
            : null
        );
  const authorId =
    typeof item.author?.id === "string" ? item.author.id : undefined;

  if (
    expectedPublicIdentifier &&
    authorPublicIdentifier &&
    expectedPublicIdentifier === authorPublicIdentifier
  ) {
    return true;
  }

  return Boolean(
    profile.linkedinAuthorId && authorId && profile.linkedinAuthorId === authorId
  );
}

function toNormalizedLinkedInPost(
  item: LinkedInPostSearchItem
): NormalizedLinkedInPost | null {
  if (!hasRequiredPostFields(item)) {
    return null;
  }

  const linkedinPostId = String(item.entityId ?? item.id);
  const body = String(item.content).trim();
  const publishedDateTime = new Date(String(item.postedAt?.date)).toISOString();
  const linkedinUrl = String(item.linkedinUrl);
  const reactionBreakdown = getReactionBreakdown(item.engagement?.reactions);
  const reactionsTotal = sumValues(reactionBreakdown);
  const likes = getNumber(item.engagement?.likes);
  const comments = getNumber(item.engagement?.comments);
  const shares = getNumber(item.engagement?.shares);
  const authorId =
    typeof item.author?.id === "string" ? item.author.id : undefined;
  const authorPublicIdentifier =
    typeof item.author?.publicIdentifier === "string"
      ? item.author.publicIdentifier
      : getLinkedInPublicIdentifierFromUrl(
          typeof item.author?.linkedinUrl === "string"
            ? item.author.linkedinUrl
            : null
        ) ?? undefined;

  return {
    body,
    publishedDateTime,
    linkedinPostId,
    linkedinUrl,
    authorId,
    authorPublicIdentifier,
    metrics: {
      impressions: 0,
      reactions: reactionsTotal || likes,
      likes,
      comments,
      reposts: shares,
      shares,
      profileVisits: 0,
      reactionBreakdown,
    },
  };
}

function getReactionBreakdown(value: unknown) {
  if (!Array.isArray(value)) {
    return {};
  }

  return value.reduce<Record<string, number>>((breakdown, reaction) => {
    if (
      reaction &&
      typeof reaction === "object" &&
      "type" in reaction &&
      "count" in reaction &&
      typeof reaction.type === "string"
    ) {
      breakdown[reaction.type] =
        (breakdown[reaction.type] ?? 0) + getNumber(reaction.count);
    }

    return breakdown;
  }, {});
}

function getNumber(value: unknown) {
  return typeof value === "number" && Number.isFinite(value) ? value : 0;
}

function sumValues(value: Record<string, number>) {
  return Object.values(value).reduce((total, count) => total + count, 0);
}
