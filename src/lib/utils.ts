import { clsx, type ClassValue } from "clsx"
import { format } from "date-fns";
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatPublishedDate(value: string) {
  return format(new Date(value), "dd MMM yyyy, HH:mm");
}

export function toDatetimeLocalValue(value?: string) {
  if (!value) {
    return "";
  }

  return format(new Date(value), "yyyy-MM-dd'T'HH:mm");
}

export function getStatusTone(status?: "in_progress" | "completed" | "failed") {
  if (status === "completed") {
    return "success" as const;
  }

  if (status === "failed") {
    return "danger" as const;
  }

  if (status === "in_progress") {
    return "warning" as const;
  }

  return "neutral" as const;
}

export function normalizeRedirectTarget(value: string | string[] | null | undefined) {
  const raw = Array.isArray(value) ? value[0] : value;

  if (!raw) {
    return "/dashboard/posts";
  }

  if (raw.includes("/.well-known/") || raw.includes("com.chrome.devtools")) {
    return "/dashboard/posts";
  }

  if (raw.startsWith("/")) {
    return raw;
  }

  try {
    const url = new URL(raw);

    if (url.pathname.startsWith("/.well-known/")) {
      return "/dashboard/posts";
    }

    return `${url.pathname}${url.search}${url.hash}` || "/dashboard/posts";
  } catch {
    return "/dashboard/posts";
  }
}
