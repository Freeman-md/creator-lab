import { runActorSyncForDatasetItems } from "../client";
import {
  LinkedInProfileIdentity,
  normalizeLinkedInPostSearchItems,
} from "../normalizers";

const DEFAULT_ACTOR_ID = "harvestapi/linkedin-post-search";

function getActorId() {
  return process.env.APIFY_LINKEDIN_POST_SEARCH_ACTOR_ID ?? DEFAULT_ACTOR_ID;
}

export async function fetchLinkedInPostsForProfile(
  profile: LinkedInProfileIdentity
) {
  const items = await runActorSyncForDatasetItems({
    actorId: getActorId(),
    input: {
      authorUrls: [profile.linkedinProfileUrl],
      postedLimit: "week",
      sortBy: "date",
      maxPosts: 20,
      scrapeReactions: false,
      scrapeComments: false,
      postNestedReactions: false,
      postNestedComments: false,
    },
  });

  return normalizeLinkedInPostSearchItems(items, profile);
}
