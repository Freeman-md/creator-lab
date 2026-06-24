import { clsx, type ClassValue } from "clsx"
import { format } from "date-fns";
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatPublishedDate(value: string) {
  return format(new Date(value), "dd MMM yyyy, HH:mm");
}

export function normalizeRedirectTarget(value: string | string[] | null | undefined) {
  const raw = Array.isArray(value) ? value[0] : value;

  if (!raw) {
    return "/posts";
  }

  if (raw.includes("/.well-known/") || raw.includes("com.chrome.devtools")) {
    return "/posts";
  }

  if (raw.startsWith("/")) {
    return raw;
  }

  try {
    const url = new URL(raw);

    if (url.pathname.startsWith("/.well-known/")) {
      return "/posts";
    }

    return `${url.pathname}${url.search}${url.hash}` || "/posts";
  } catch {
    return "/posts";
  }
}
