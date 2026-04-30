"use client";

import { ClerkProvider } from "@clerk/nextjs";
import type { ReactNode } from "react";
import { ConvexClientProvider } from "./providers";

export function requireClerkPublishableKey(): string {
  const raw = process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY;
  if (raw === undefined || raw === null || raw.trim() === "") {
    throw new Error(
      "NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY is required. Copy apps/*/.env.example and set your Clerk publishable key.",
    );
  }
  return raw.trim();
}

/** Clerk + Convex root for Next.js apps. Requires both public env keys. */
export function AppProviders({ children }: { children: ReactNode }) {
  return (
    <ClerkProvider publishableKey={requireClerkPublishableKey()}>
      <ConvexClientProvider>{children}</ConvexClientProvider>
    </ClerkProvider>
  );
}
