import { describe, expect, test } from "vitest";

import { normalizeLinkedInPostSearchItems } from "@convex/integrations/apify/normalizers";

const profile = {
  linkedinProfileUrl: "https://www.linkedin.com/in/freeman-madudili-9864101a2/",
  linkedinPublicIdentifier: "freeman-madudili-9864101a2",
};

const basePost = {
  type: "post",
  id: "7477722643778146304",
  entityId: "7477722643778146304",
  linkedinUrl:
    "https://www.linkedin.com/posts/freeman-madudili-9864101a2_example-activity-7477722643778146304-d1EG",
  content: "One project changed how I think about building software...",
  author: {
    id: "ACoAAC9nJnYBwoatgTjvQ7-e7VIdaCSC0ZBmYcA",
    publicIdentifier: "freeman-madudili-9864101a2",
    linkedinUrl:
      "https://www.linkedin.com/in/freeman-madudili-9864101a2?miniProfileUrn=abc",
  },
  postedAt: {
    date: "2026-06-30T14:00:07.645Z",
  },
  engagement: {
    likes: 7,
    comments: 2,
    shares: 1,
    reactions: [
      { type: "INTEREST", count: 1 },
      { type: "EMPATHY", count: 2 },
    ],
  },
};

describe("normalizeLinkedInPostSearchItems", () => {
  test("normalizes owned post fields and engagement summary", () => {
    const result = normalizeLinkedInPostSearchItems([basePost], profile);

    expect(result.counts).toMatchObject({
      fetched: 1,
      skippedInvalid: 0,
      skippedNonOwned: 0,
      skippedRepost: 0,
    });
    expect(result.posts).toEqual([
      expect.objectContaining({
        body: basePost.content,
        linkedinPostId: basePost.entityId,
        linkedinUrl: basePost.linkedinUrl,
        publishedDateTime: "2026-06-30T14:00:07.645Z",
        authorId: basePost.author.id,
        authorPublicIdentifier: basePost.author.publicIdentifier,
        metrics: {
          impressions: 0,
          reactions: 3,
          likes: 7,
          comments: 2,
          reposts: 1,
          shares: 1,
          profileVisits: 0,
          reactionBreakdown: {
            INTEREST: 1,
            EMPATHY: 2,
          },
        },
      }),
    ]);
  });

  test("skips reposts", () => {
    const result = normalizeLinkedInPostSearchItems(
      [
        {
          ...basePost,
          repostedAt: {
            date: "2026-06-30T11:52:51.241Z",
          },
        },
      ],
      profile
    );

    expect(result.posts).toEqual([]);
    expect(result.counts.skippedRepost).toBe(1);
  });

  test("skips non-owned posts", () => {
    const result = normalizeLinkedInPostSearchItems(
      [
        {
          ...basePost,
          author: {
            ...basePost.author,
            publicIdentifier: "someone-else",
          },
        },
      ],
      profile
    );

    expect(result.posts).toEqual([]);
    expect(result.counts.skippedNonOwned).toBe(1);
  });

  test("defaults missing engagement safely", () => {
    const result = normalizeLinkedInPostSearchItems(
      [
        {
          ...basePost,
          engagement: undefined,
        },
      ],
      profile
    );

    expect(result.posts[0]?.metrics).toEqual({
      impressions: 0,
      reactions: 0,
      likes: 0,
      comments: 0,
      reposts: 0,
      shares: 0,
      profileVisits: 0,
      reactionBreakdown: {},
    });
  });
});
