/**
 * Tests for helpers/authClaims.shared.ts
 *
 * Protects:
 * - Platform admin resolution requires a non-empty CLERK_PLATFORM_ORG_ID matching session org id
 * - resolvePlatformAdminOrgId returns the resolved id so callers don't re-read the claim
 * - readBooleanClaim accepts common truthy string/number forms
 * - resolveVendorOrgContext requires a trimmed non-empty org role for active vendors
 */

import type { UserIdentity } from "convex/server";
import { afterEach, expect, it, vi } from "vitest";
import {
  F2T_CLAIMS,
  isPlatformAdminIdentity,
  readBooleanClaim,
  resolvePlatformAdminOrgId,
  resolveVendorOrgContext,
} from "../authClaims.shared";

const issuer =
  process.env.CLERK_JWT_ISSUER_DOMAIN ?? "https://clerk.example.com";

const baseIdentity = {
  tokenIdentifier: `${issuer}|u`,
  subject: "u",
  issuer,
};

afterEach(() => {
  vi.unstubAllEnvs();
});

it("matches platform org by CLERK_PLATFORM_ORG_ID when set", () => {
  vi.stubEnv("CLERK_PLATFORM_ORG_ID", "org_plat");
  const id = {
    ...baseIdentity,
    [F2T_CLAIMS.orgId]: "org_plat",
  };
  expect(isPlatformAdminIdentity(id)).toBe(true);
});

it("rejects org-name Platform when CLERK_PLATFORM_ORG_ID is set to a different org", () => {
  vi.stubEnv("CLERK_PLATFORM_ORG_ID", "org_strict");
  const id = {
    ...baseIdentity,
    [F2T_CLAIMS.orgId]: "other_org",
    [F2T_CLAIMS.orgName]: "Platform",
  };
  expect(isPlatformAdminIdentity(id)).toBe(false);
});

it("rejects platform admin when CLERK_PLATFORM_ORG_ID is unset even if org name is Platform", () => {
  vi.stubEnv("CLERK_PLATFORM_ORG_ID", "");
  const id = {
    ...baseIdentity,
    [F2T_CLAIMS.orgId]: "any",
    [F2T_CLAIMS.orgName]: "Platform",
  };
  expect(isPlatformAdminIdentity(id)).toBe(false);
});

it("resolveVendorOrgContext returns undefined when org role is missing", () => {
  const id = {
    ...baseIdentity,
    [F2T_CLAIMS.orgId]: "o1",
    [F2T_CLAIMS.vendorOrgIsActive]: true,
  } as UserIdentity;
  expect(resolveVendorOrgContext(id)).toBeUndefined();
});

it("resolveVendorOrgContext rejects whitespace-only org roles", () => {
  const id = {
    ...baseIdentity,
    [F2T_CLAIMS.orgId]: "o1",
    [F2T_CLAIMS.vendorOrgIsActive]: true,
    [F2T_CLAIMS.orgRole]: "   ",
  } as UserIdentity;
  expect(resolveVendorOrgContext(id)).toBeUndefined();
});

it("resolveVendorOrgContext trims role whitespace when surrounded by valid content", () => {
  const id = {
    ...baseIdentity,
    [F2T_CLAIMS.orgId]: "o1",
    [F2T_CLAIMS.vendorOrgIsActive]: true,
    [F2T_CLAIMS.orgRole]: "  org:owner  ",
  } as UserIdentity;
  expect(resolveVendorOrgContext(id)?.role).toBe("org:owner");
});

it("resolvePlatformAdminOrgId returns the resolved org id when the session matches", () => {
  vi.stubEnv("CLERK_PLATFORM_ORG_ID", "org_plat");
  const id = { ...baseIdentity, [F2T_CLAIMS.orgId]: "org_plat" };
  expect(resolvePlatformAdminOrgId(id)?.clerkOrgId).toBe("org_plat");
});

it("resolvePlatformAdminOrgId trims the f2tOrgId claim before comparing", () => {
  vi.stubEnv("CLERK_PLATFORM_ORG_ID", "org_plat");
  // Clerk session templates configured by hand can carry trailing whitespace.
  const id = { ...baseIdentity, [F2T_CLAIMS.orgId]: "  org_plat  " };
  expect(resolvePlatformAdminOrgId(id)?.clerkOrgId).toBe("org_plat");
});

it("resolvePlatformAdminOrgId returns undefined when the session does not match", () => {
  vi.stubEnv("CLERK_PLATFORM_ORG_ID", "org_plat");
  const id = { ...baseIdentity, [F2T_CLAIMS.orgId]: "other" };
  expect(resolvePlatformAdminOrgId(id)).toBeUndefined();
});

it("readBooleanClaim is false for absent or non-true values", () => {
  const id = { ...baseIdentity, [F2T_CLAIMS.vendorOrgIsActive]: false };
  expect(readBooleanClaim(id, F2T_CLAIMS.vendorOrgIsActive)).toBe(false);
  expect(readBooleanClaim(baseIdentity, F2T_CLAIMS.vendorOrgIsActive)).toBe(
    false,
  );
});

it("readBooleanClaim accepts string and numeric truthy variants", () => {
  expect(
    readBooleanClaim(
      { ...baseIdentity, [F2T_CLAIMS.vendorOrgIsActive]: "True" },
      F2T_CLAIMS.vendorOrgIsActive,
    ),
  ).toBe(true);
  expect(
    readBooleanClaim(
      { ...baseIdentity, [F2T_CLAIMS.vendorOrgIsActive]: "1" },
      F2T_CLAIMS.vendorOrgIsActive,
    ),
  ).toBe(true);
  expect(
    readBooleanClaim(
      { ...baseIdentity, [F2T_CLAIMS.vendorOrgIsActive]: 1 },
      F2T_CLAIMS.vendorOrgIsActive,
    ),
  ).toBe(true);
});

it("readBooleanClaim treats numeric zero as false", () => {
  expect(
    readBooleanClaim(
      { ...baseIdentity, [F2T_CLAIMS.vendorOrgIsActive]: 0 },
      F2T_CLAIMS.vendorOrgIsActive,
    ),
  ).toBe(false);
});

it("readBooleanClaim is false for numeric values other than 0 and 1", () => {
  expect(
    readBooleanClaim(
      { ...baseIdentity, [F2T_CLAIMS.vendorOrgIsActive]: 2 },
      F2T_CLAIMS.vendorOrgIsActive,
    ),
  ).toBe(false);
});

it("readBooleanClaim is false for unrecognized string values", () => {
  expect(
    readBooleanClaim(
      { ...baseIdentity, [F2T_CLAIMS.vendorOrgIsActive]: "maybe" },
      F2T_CLAIMS.vendorOrgIsActive,
    ),
  ).toBe(false);
});
