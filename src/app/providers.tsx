"use client";

import { ConvexProvider, ConvexReactClient } from "convex/react";
import { ThemeProvider } from "next-themes";

import { Toaster } from "@/components/ui/sonner";

const convexUrl = process.env.NEXT_PUBLIC_CONVEX_URL;
const convex =
  convexUrl && convexUrl.length > 0 ? new ConvexReactClient(convexUrl) : null;

type ProvidersProps = {
  children: React.ReactNode;
};

export function Providers({ children }: ProvidersProps) {
  const content = convex ? (
    <ConvexProvider client={convex}>{children}</ConvexProvider>
  ) : (
    children
  );

  return (
    <ThemeProvider
      attribute="class"
      defaultTheme="light"
      enableSystem={false}
      disableTransitionOnChange
    >
      {content}
      <Toaster richColors position="top-right" />
    </ThemeProvider>
  );
}
