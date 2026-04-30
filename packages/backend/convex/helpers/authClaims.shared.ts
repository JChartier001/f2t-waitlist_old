import type { UserIdentity } from "convex/server";

/**
 * Clerk session-token claims configured under Sessions → Customize session token.
 * Story 1.5 may replace claim reads with synced Convex tables without changing call sites.
 */
export const F2T_CLAIMS = {
  orgId: "f2tOrgId",
  orgName: "f2tOrgName",
  orgRole: "f2tOrgRole",
  vendorOrgIsActive: "f2tVendorOrgIsActive",
} as const;

export function readStringClaim(
  identity: UserIdentity,
  key: string,
): string | undefined {
  const v = identity[key];
  return typeof v === "string" ? v : undefined;
}

export function readBooleanClaim(identity: UserIdentity, key: string): boolean {
  const v = identity[key];
  if (v === true) return true;
  if (v === false || v === null || v === undefined) return false;
  if (typeof v === "number") {
    if (v === 1) return true;
    if (v === 0) return false;
  }
  if (typeof v === "string") {
    const s = v.trim().toLowerCase();
    return s === "true" || s === "1" || s === "yes";
  }
  return false;
}

/**
 * Resolves the platform-admin org id when the session is authoritatively a platform-admin
 * session, else `undefined`. Returns the resolved id so callers can populate `org.clerkOrgId`
 * without re-reading the claim.
 *
 * Membership is proven by `f2tOrgId` matching the deploy's `CLERK_PLATFORM_ORG_ID` (trimmed,
 * non-empty). There is no org-name fallback.
 *
 * Parity note: vendor sessions also gate on `f2tVendorOrgIsActive`. Platform admins do not
 * have a parallel `f2tPlatformOrgIsActive` claim because the platform org is the deploy-wide
 * singleton; suspension is handled by removing the user from the Clerk org (which clears
 * `f2tOrgId` on the next session refresh). Story 1.5 owns synced Convex tables that may add
 * a server-side admin-active gate independent of session staleness.
 */
export function resolvePlatformAdminOrgId(
  identity: UserIdentity,
): { clerkOrgId: string } | undefined {
  const configuredOrgId = process.env.CLERK_PLATFORM_ORG_ID?.trim();
  if (configuredOrgId === undefined || configuredOrgId === "") {
    return undefined;
  }
  // Trim claim too — Clerk session templates configured by hand can carry stray
  // whitespace; configured env is already trimmed, so an untrimmed claim would never
  // match and admins would fail closed for cosmetic reasons.
  const orgId = readStringClaim(identity, F2T_CLAIMS.orgId)?.trim();
  if (orgId !== configuredOrgId) return undefined;
  return { clerkOrgId: orgId };
}

/** Boolean predicate kept for tests and call sites that don't need the resolved org id. */
export function isPlatformAdminIdentity(identity: UserIdentity): boolean {
  return resolvePlatformAdminOrgId(identity) !== undefined;
}

export function resolveVendorOrgContext(identity: UserIdentity):
  | {
      clerkOrgId: string;
      role: string;
      isActive: boolean;
      orgName: string | undefined;
    }
  | undefined {
  const clerkOrgId = readStringClaim(identity, F2T_CLAIMS.orgId);
  if (clerkOrgId === undefined || clerkOrgId === "") return undefined;
  const isActive = readBooleanClaim(identity, F2T_CLAIMS.vendorOrgIsActive);
  if (!isActive) return undefined;
  const rawRole = readStringClaim(identity, F2T_CLAIMS.orgRole);
  const role = rawRole?.trim();
  if (role === undefined || role === "") return undefined;
  const orgName = readStringClaim(identity, F2T_CLAIMS.orgName);
  return { clerkOrgId, role, isActive, orgName };
}

/** Clerk may emit `org:owner` (session template) or legacy bare `owner` from older templates. */
export function isVendorOwnerRole(role: string): boolean {
  return role === "org:owner" || role === "owner";
}
