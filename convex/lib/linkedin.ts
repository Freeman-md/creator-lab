const LINKEDIN_HOSTS = new Set(["linkedin.com", "www.linkedin.com"]);

export function normalizeLinkedInProfileUrl(value: string) {
  const trimmed = value.trim();

  let url: URL;
  try {
    url = new URL(trimmed);
  } catch {
    throw new Error("Enter a valid LinkedIn profile URL.");
  }

  const host = url.hostname.toLowerCase();
  if (!LINKEDIN_HOSTS.has(host)) {
    throw new Error("Enter a valid LinkedIn profile URL.");
  }

  const publicIdentifier = getLinkedInPublicIdentifierFromPath(url.pathname);
  if (!publicIdentifier) {
    throw new Error("Enter a LinkedIn profile URL like https://www.linkedin.com/in/your-name.");
  }

  return {
    linkedinProfileUrl: `https://www.linkedin.com/in/${publicIdentifier}/`,
    linkedinPublicIdentifier: publicIdentifier,
  };
}

export function getLinkedInPublicIdentifierFromPath(pathname: string) {
  const [, type, rawIdentifier] = pathname.split("/");

  if (type !== "in" || !rawIdentifier) {
    return null;
  }

  const decoded = decodeURIComponent(rawIdentifier).trim();
  if (!/^[A-Za-z0-9_-]+$/.test(decoded)) {
    return null;
  }

  return decoded;
}

export function getLinkedInPublicIdentifierFromUrl(value?: string | null) {
  if (!value) {
    return null;
  }

  try {
    const url = new URL(value.trim());
    return getLinkedInPublicIdentifierFromPath(url.pathname);
  } catch {
    return null;
  }
}
