type RunActorSyncArgs = {
  actorId: string;
  input: Record<string, unknown>;
};

function getApifyToken() {
  const token = process.env.APIFY_TOKEN;

  if (!token) {
    throw new Error("APIFY_TOKEN is not configured for LinkedIn post sync.");
  }

  return token;
}

export async function runActorSyncForDatasetItems({
  actorId,
  input,
}: RunActorSyncArgs): Promise<unknown[]> {
  const actorPath = actorId.replace("/", "~");
  const response = await fetch(
    `https://api.apify.com/v2/acts/${actorPath}/run-sync-get-dataset-items?timeout=300`,
    {
      method: "POST",
      headers: {
        Authorization: `Bearer ${getApifyToken()}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(input),
    }
  );

  if (!response.ok) {
    const errorBody = await response.text();
    throw new Error(
      `Apify LinkedIn post sync failed (${response.status}): ${errorBody}`
    );
  }

  const data: unknown = await response.json();

  if (!Array.isArray(data)) {
    throw new Error("Apify LinkedIn post sync returned an unexpected response.");
  }

  return data;
}
