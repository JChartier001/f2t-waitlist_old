/**
 * Protects:
 * - ConvexClientProvider wires ConvexProviderWithClerk so useConvexAuth runs inside Convex auth context
 * - ConvexClientProvider requires NEXT_PUBLIC_CONVEX_URL
 * - requireConvexUrl trims and validates http(s) URLs
 * - requireConvexUrl rejects http: in production but allows it in dev/test (auth tokens
 *   ride this socket; plaintext is only safe outside production)
 * - ConvexReactClient is closed on provider unmount; close() rejection is swallowed
 *   so StrictMode dev double-mount doesn't surface unhandled rejections
 */

import { render, screen } from "@testing-library/react";
import { ConvexReactClient } from "convex/react";
import { ConvexProviderWithClerk } from "convex/react-clerk";
import { useConvexAuth } from "convex/react";
import type { ComponentProps } from "react";
import { afterEach, expect, it, vi } from "vitest";
import { ConvexClientProvider, requireConvexUrl } from "./providers";

type ClerkUseAuth = ComponentProps<typeof ConvexProviderWithClerk>["useAuth"];

afterEach(() => {
  vi.unstubAllEnvs();
});

const clerkLikeUseAuth = (() => ({
  isLoaded: true,
  isSignedIn: false,
  getToken: async () => null,
  orgId: null,
  orgRole: null,
  sessionClaims: null,
})) as ClerkUseAuth;

function AuthProbe() {
  const { isLoading, isAuthenticated } = useConvexAuth();
  if (isLoading) {
    return <span data-testid="auth-probe">loading</span>;
  }
  return (
    <span data-testid="auth-probe">
      {isAuthenticated ? "authenticated" : "anonymous"}
    </span>
  );
}

it("requireConvexUrl returns a trimmed https URL", () => {
  vi.stubEnv("NEXT_PUBLIC_CONVEX_URL", "  https://trimmed.example  ");
  expect(requireConvexUrl()).toBe("https://trimmed.example");
});

it("requireConvexUrl throws when URL is not parseable", () => {
  vi.stubEnv("NEXT_PUBLIC_CONVEX_URL", ":::");
  expect(() => requireConvexUrl()).toThrow(/valid http/);
});

it("requireConvexUrl throws when NEXT_PUBLIC_CONVEX_URL is unset", () => {
  const prev = process.env.NEXT_PUBLIC_CONVEX_URL;
  delete process.env.NEXT_PUBLIC_CONVEX_URL;
  expect(() => requireConvexUrl()).toThrow(/NEXT_PUBLIC_CONVEX_URL is required/);
  process.env.NEXT_PUBLIC_CONVEX_URL = prev;
});

it("closes ConvexReactClient on unmount", () => {
  vi.stubEnv("NEXT_PUBLIC_CONVEX_URL", "https://test.convex.cloud");
  const closeSpy = vi
    .spyOn(ConvexReactClient.prototype, "close")
    .mockResolvedValue(undefined);
  const { unmount } = render(
    <ConvexClientProvider useAuth={clerkLikeUseAuth}>
      <AuthProbe />
    </ConvexClientProvider>,
  );
  unmount();
  expect(closeSpy).toHaveBeenCalled();
  closeSpy.mockRestore();
});

it("renders useConvexAuth state with a Clerk-shaped useAuth stub", () => {
  vi.stubEnv("NEXT_PUBLIC_CONVEX_URL", "https://test.convex.cloud");

  render(
    <ConvexClientProvider useAuth={clerkLikeUseAuth}>
      <AuthProbe />
    </ConvexClientProvider>,
  );

  expect(screen.getByTestId("auth-probe").textContent).toBe("anonymous");
});

it("throws when NEXT_PUBLIC_CONVEX_URL is missing", () => {
  vi.stubEnv("NEXT_PUBLIC_CONVEX_URL", "");

  expect(() =>
    render(
      <ConvexClientProvider useAuth={clerkLikeUseAuth}>
        <AuthProbe />
      </ConvexClientProvider>,
    ),
  ).toThrow(/NEXT_PUBLIC_CONVEX_URL is required/);
});

it("throws when NEXT_PUBLIC_CONVEX_URL is not http(s)", () => {
  vi.stubEnv("NEXT_PUBLIC_CONVEX_URL", "ftp://bad.example");

  expect(() =>
    render(
      <ConvexClientProvider useAuth={clerkLikeUseAuth}>
        <AuthProbe />
      </ConvexClientProvider>,
    ),
  ).toThrow(/http/);
});

it("throws when NEXT_PUBLIC_CONVEX_URL is only whitespace", () => {
  vi.stubEnv("NEXT_PUBLIC_CONVEX_URL", "   ");

  expect(() =>
    render(
      <ConvexClientProvider useAuth={clerkLikeUseAuth}>
        <AuthProbe />
      </ConvexClientProvider>,
    ),
  ).toThrow(/NEXT_PUBLIC_CONVEX_URL is required/);
});

it("requireConvexUrl allows http: outside production (dev/test sandboxes)", () => {
  vi.stubEnv("NEXT_PUBLIC_CONVEX_URL", "http://localhost:3210");
  vi.stubEnv("NODE_ENV", "development");
  expect(requireConvexUrl()).toBe("http://localhost:3210");
});

it("requireConvexUrl rejects http: in production deployments", () => {
  vi.stubEnv("NEXT_PUBLIC_CONVEX_URL", "http://prod-convex.example.com");
  vi.stubEnv("NODE_ENV", "production");
  expect(() => requireConvexUrl()).toThrow(
    /must use https in production deployments/,
  );
});

it("requireConvexUrl rejects http: when NODE_ENV is misconfigured-cased Production", () => {
  // Misconfigured CI: `NODE_ENV=Production` (capitalized) must still be treated as
  // production. The case-insensitive guard catches this.
  vi.stubEnv("NEXT_PUBLIC_CONVEX_URL", "http://prod-convex.example.com");
  vi.stubEnv("NODE_ENV", "Production");
  expect(() => requireConvexUrl()).toThrow(
    /must use https in production deployments/,
  );
});

it("swallows ConvexReactClient.close rejections on unmount", async () => {
  // Direct test of the cleanup branch: invoke the same shape the cleanup uses
  // (await close().catch wrapped in try/catch) and prove no rejection propagates.
  // Listener-based unhandledRejection probes are unreliable across Vitest workers
  // (happy-dom flushes synchronously), so we instead verify the contract directly.
  vi.stubEnv("NEXT_PUBLIC_CONVEX_URL", "https://test.convex.cloud");
  const closeSpy = vi
    .spyOn(ConvexReactClient.prototype, "close")
    .mockRejectedValue(new Error("ws teardown raced unmount"));
  const { unmount } = render(
    <ConvexClientProvider useAuth={clerkLikeUseAuth}>
      <AuthProbe />
    </ConvexClientProvider>,
  );
  expect(() => unmount()).not.toThrow();
  // Drain microtasks so the rejected close() promise settles inside the .catch.
  await Promise.resolve();
  await Promise.resolve();
  expect(closeSpy).toHaveBeenCalled();
  closeSpy.mockRestore();
});

it("swallows ConvexReactClient.close synchronous throws on unmount", () => {
  // If a future runtime makes close() throw synchronously (e.g., property removed),
  // the cleanup must not surface a Next.js error overlay during unmount.
  vi.stubEnv("NEXT_PUBLIC_CONVEX_URL", "https://test.convex.cloud");
  const closeSpy = vi
    .spyOn(ConvexReactClient.prototype, "close")
    .mockImplementation(() => {
      throw new Error("close vanished");
    });
  const { unmount } = render(
    <ConvexClientProvider useAuth={clerkLikeUseAuth}>
      <AuthProbe />
    </ConvexClientProvider>,
  );
  expect(() => unmount()).not.toThrow();
  expect(closeSpy).toHaveBeenCalled();
  closeSpy.mockRestore();
});
