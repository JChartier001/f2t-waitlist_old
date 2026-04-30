import type { UserIdentity } from "convex/server";
import { F2T_CLAIMS, readStringClaim } from "./authClaims.shared";

/**
 * Wrapper-augmented context. `user` and `org` are populated by the auth-wrapper
 * customizations, so the unexpected-error path can read identity without a second
 * JWT verification. Public wrappers and customization-phase failures see `user`
 * unset; in those cases we fall back to `auth.getUserIdentity()` once.
 */
export type WrapperCtx = {
  auth: { getUserIdentity: () => Promise<UserIdentity | null> };
  meta?: { getFunctionMetadata?: () => Promise<{ name?: string } | undefined> };
  /** Wrappers always set both fields when populating user; `?` only because public
   * wrappers and pre-customization paths leave it unset entirely. */
  user?: { tokenIdentifier: string };
  /** When `org` is set, `kind` MUST be set — telemetry pivots break otherwise. */
  org?: { clerkOrgId: string; kind: "vendor" | "platform" };
};

export type UnexpectedWrapperContext = {
  functionName: string | undefined;
  userTokenIdentifier: string | undefined;
  orgId: string | undefined;
  orgKind: "vendor" | "platform" | "unknown";
};

/**
 * Best-effort metadata for wrapper unexpected-error telemetry. Never throws.
 */
export async function collectUnexpectedWrapperContext(
  ctx: WrapperCtx,
): Promise<UnexpectedWrapperContext> {
  let functionName: string | undefined;
  try {
    const meta = await ctx.meta?.getFunctionMetadata?.();
    functionName = meta?.name;
  } catch {
    functionName = undefined;
  }

  if (ctx.user !== undefined) {
    return {
      functionName,
      userTokenIdentifier: ctx.user.tokenIdentifier,
      orgId: ctx.org?.clerkOrgId,
      // `WrapperCtx.org.kind` is required when `org` is set; the optional fall-through
      // covers wrappers that legitimately set neither (public wrappers / customer flow).
      orgKind: ctx.org === undefined ? "unknown" : ctx.org.kind,
    };
  }

  let userTokenIdentifier: string | undefined;
  let orgId: string | undefined;
  try {
    const identity = await ctx.auth.getUserIdentity();
    userTokenIdentifier = identity?.tokenIdentifier;
    orgId = identity ? readStringClaim(identity, F2T_CLAIMS.orgId) : undefined;
  } catch {
    userTokenIdentifier = undefined;
    orgId = undefined;
  }
  return { functionName, userTokenIdentifier, orgId, orgKind: "unknown" };
}
