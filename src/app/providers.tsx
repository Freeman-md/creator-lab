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

function ConvexProviders({ children }: ProvidersProps) {
  if (!convex) {
    return children;
  }

  return <ConvexProvider client={convex}>{children}</ConvexProvider>;
}

export function Providers({ children }: ProvidersProps) {
  return (
    <ThemeProvider
      attribute="class"
      defaultTheme="light"
      enableSystem={false}
      disableTransitionOnChange
    >
      <ConvexProviders>{children}</ConvexProviders>
      <Toaster richColors position="top-right" />
    </ThemeProvider>
  );
}
