/**
 * Protects:
 * - AppProviders requires NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY
 * - requireClerkPublishableKey trims the publishable key
 */

import { render } from "@testing-library/react";
import { afterEach, expect, it, vi } from "vitest";
import { AppProviders, requireClerkPublishableKey } from "./app-providers";

afterEach(() => {
  vi.unstubAllEnvs();
});

it("returns trimmed NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY when set", () => {
  vi.stubEnv("NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY", "  pk_live_x  ");
  expect(requireClerkPublishableKey()).toBe("pk_live_x");
});

it("throws when NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY is missing", () => {
  vi.stubEnv("NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY", "");
  vi.stubEnv("NEXT_PUBLIC_CONVEX_URL", "https://test.convex.cloud");

  expect(() =>
    render(
      <AppProviders>
        <span data-testid="child">x</span>
      </AppProviders>,
    ),
  ).toThrow(/NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY is required/);
});
