"use client";

import { useAuth as useClerkNextjsAuth } from "@clerk/nextjs";
import { ConvexReactClient } from "convex/react";
import { ConvexProviderWithClerk } from "convex/react-clerk";
import type { ComponentProps, ReactNode } from "react";
import { useEffect, useMemo } from "react";

export function requireConvexUrl(): string {
  const raw = process.env.NEXT_PUBLIC_CONVEX_URL;
  if (raw === undefined || raw === null) {
    throw new Error(
      "NEXT_PUBLIC_CONVEX_URL is required. Copy apps/*/.env.example and set your Convex deployment URL.",
    );
  }
  const url = raw.trim();
  if (url === "") {
    throw new Error(
      "NEXT_PUBLIC_CONVEX_URL is required. Copy apps/*/.env.example and set your Convex deployment URL.",
    );
  }
  let parsed: URL;
  try {
    parsed = new URL(url);
  } catch {
    throw new Error("NEXT_PUBLIC_CONVEX_URL must be a valid http(s) URL.");
  }
  if (parsed.protocol !== "http:" && parsed.protocol !== "https:") {
    throw new Error("NEXT_PUBLIC_CONVEX_URL must use http or https.");
  }
  // Plaintext WebSocket carries Clerk-bridged auth tokens. Allow http: only outside
  // production so a misconfigured prod env never silently downgrades the connection.
  // Case-insensitive compare: misconfigured CI sometimes sets `NODE_ENV=Production`.
  if (
    parsed.protocol === "http:" &&
    process.env.NODE_ENV?.toLowerCase() === "production"
  ) {
    throw new Error(
      "NEXT_PUBLIC_CONVEX_URL must use https in production deployments.",
    );
  }
  return url;
}

type ClerkUseAuthForConvex = ComponentProps<
  typeof ConvexProviderWithClerk
>["useAuth"];

export type ConvexClientProviderProps = {
  children: ReactNode;
  /**
   * Clerk `useAuth` implementation. Defaults to `@clerk/nextjs` (requires `ClerkProvider`
   * from the same package). Tests may pass a Clerk-shaped stub to avoid loading Clerk.js.
   */
  useAuth?: ClerkUseAuthForConvex;
};

/**
 * Bridges Clerk session tokens into Convex auth. In apps, render inside `ClerkProvider`
 * from `@clerk/nextjs` and omit `useAuth`. Use `useConvexAuth` from `convex/react` for UI auth state.
 */
export function ConvexClientProvider({
  children,
  useAuth: useAuthHook = useClerkNextjsAuth as ClerkUseAuthForConvex,
}: ConvexClientProviderProps) {
  const url = useMemo(() => requireConvexUrl(), []);
  const client = useMemo(() => new ConvexReactClient(url), [url]);

  useEffect(() => {
    return () => {
      // close() is async and may reject (mid-flight WS teardown, transient network drop).
      // It can also throw synchronously if the underlying transport is in a weird state
      // or if a future runtime renames the method. Wrap both paths so unmount never
      // surfaces a Next.js error overlay during StrictMode dev double-mount.
      try {
        void client.close().catch(() => {});
      } catch {
        /* sync teardown error — nothing actionable on unmount */
      }
    };
  }, [client]);

  return (
    <ConvexProviderWithClerk client={client} useAuth={useAuthHook}>
      {children}
    </ConvexProviderWithClerk>
  );
}
