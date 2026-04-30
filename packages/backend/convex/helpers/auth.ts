import {
  NoOp,
  customMutation,
  customQuery,
} from "convex-helpers/server/customFunctions";
import { ConvexError } from "convex/values";
import type { UserIdentity } from "convex/server";
import {
  internalMutation as internalMutationForRegistration,
  internalQuery,
  mutation,
  query,
  type MutationCtx,
  type QueryCtx,
} from "../_generated/server";
import {
  F2T_CLAIMS,
  isVendorOwnerRole,
  readStringClaim,
  resolvePlatformAdminOrgId,
  resolveVendorOrgContext,
} from "./authClaims.shared";
import {
  appError,
  createUnexpectedErrorCorrelationId,
  reportUnexpectedErrorForWrappers,
  summarizeUnknownError,
} from "./errors";
import {
  collectUnexpectedWrapperContext,
  type WrapperCtx,
} from "./unexpectedContext.shared";

export type AuthUser = {
  tokenIdentifier: string;
  subject: string;
  issuer: string;
  email?: string;
  name?: string;
};

export type AuthOrg = {
  kind: "vendor" | "platform";
  clerkOrgId: string;
  role: string;
  isVendorActive: boolean;
  orgName?: string;
};

function toAuthUser(identity: UserIdentity): AuthUser {
  return {
    tokenIdentifier: identity.tokenIdentifier,
    subject: identity.subject,
    issuer: identity.issuer,
    ...(identity.email !== undefined ? { email: identity.email } : {}),
    ...(identity.name !== undefined ? { name: identity.name } : {}),
  };
}

async function runAuthCustomization<T>(
  ctx: WrapperCtx,
  args: unknown,
  fn: () => Promise<T>,
): Promise<T> {
  try {
    return await fn();
  } catch (error: unknown) {
    if (error instanceof ConvexError) throw error;
    const correlationId = createUnexpectedErrorCorrelationId();
    const { functionName, userTokenIdentifier, orgId, orgKind } =
      await collectUnexpectedWrapperContext(ctx);
    reportUnexpectedErrorForWrappers({
      functionName,
      correlationId,
      userTokenIdentifier,
      orgId,
      orgKind,
      args,
      error,
      errorDetail: summarizeUnknownError(error),
    });
    throw appError(
      "internal.unexpected",
      `Something went wrong. Reference: ${correlationId}`,
      { correlationId },
    );
  }
}

function customizationForQuery(
  delta: (ctx: WrapperCtx) => Promise<Record<string, unknown>>,
) {
  return {
    args: {},
    input: async (ctx: QueryCtx, args: unknown) => ({
      ctx: await runAuthCustomization(ctx as WrapperCtx, args, () =>
        delta(ctx as WrapperCtx),
      ),
      args: {},
    }),
  };
}

function customizationForMutation(
  delta: (ctx: WrapperCtx) => Promise<Record<string, unknown>>,
) {
  return {
    args: {},
    input: async (ctx: MutationCtx, args: unknown) => ({
      ctx: await runAuthCustomization(ctx as WrapperCtx, args, () =>
        delta(ctx as WrapperCtx),
      ),
      args: {},
    }),
  };
}

async function customerContextDelta(
  ctx: WrapperCtx,
): Promise<{ user: AuthUser }> {
  const identity = await ctx.auth.getUserIdentity();
  if (identity === null) {
    throw appError("auth.unauthenticated", "Sign in is required.");
  }
  return { user: toAuthUser(identity) };
}

async function vendorContextDelta(ctx: WrapperCtx): Promise<{
  user: AuthUser;
  org: AuthOrg;
}> {
  const identity = await ctx.auth.getUserIdentity();
  if (identity === null) {
    throw appError("auth.unauthenticated", "Sign in is required.");
  }
  const orgCtx = resolveVendorOrgContext(identity);
  if (orgCtx === undefined) {
    throw appError(
      "auth.forbidden",
      "Active vendor organization membership is required.",
    );
  }
  return {
    user: toAuthUser(identity),
    org: {
      kind: "vendor",
      clerkOrgId: orgCtx.clerkOrgId,
      role: orgCtx.role,
      isVendorActive: orgCtx.isActive,
      ...(orgCtx.orgName !== undefined ? { orgName: orgCtx.orgName } : {}),
    } satisfies AuthOrg,
  };
}

async function vendorOwnerContextDelta(ctx: WrapperCtx): Promise<{
  user: AuthUser;
  org: AuthOrg;
}> {
  const identity = await ctx.auth.getUserIdentity();
  if (identity === null) {
    throw appError("auth.unauthenticated", "Sign in is required.");
  }
  const orgCtx = resolveVendorOrgContext(identity);
  if (orgCtx === undefined) {
    throw appError(
      "auth.forbidden",
      "Active vendor organization membership is required.",
    );
  }
  if (!isVendorOwnerRole(orgCtx.role)) {
    throw appError("auth.forbidden", "Vendor owner role is required.");
  }
  return {
    user: toAuthUser(identity),
    org: {
      kind: "vendor",
      clerkOrgId: orgCtx.clerkOrgId,
      role: orgCtx.role,
      isVendorActive: orgCtx.isActive,
      ...(orgCtx.orgName !== undefined ? { orgName: orgCtx.orgName } : {}),
    } satisfies AuthOrg,
  };
}

async function adminContextDelta(ctx: WrapperCtx): Promise<{
  user: AuthUser;
  org: AuthOrg;
}> {
  const identity = await ctx.auth.getUserIdentity();
  if (identity === null) {
    throw appError("auth.unauthenticated", "Sign in is required.");
  }
  const platformOrg = resolvePlatformAdminOrgId(identity);
  if (platformOrg === undefined) {
    throw appError(
      "auth.forbidden",
      "Platform administrator access is required.",
    );
  }
  const orgName = readStringClaim(identity, F2T_CLAIMS.orgName);
  // Trim role for parity with vendor flow (Round-3 trimmed vendor role); Clerk session
  // templates configured by hand can carry trailing whitespace/newlines.
  const role = readStringClaim(identity, F2T_CLAIMS.orgRole)?.trim() ?? "";
  const org: AuthOrg = {
    kind: "platform",
    clerkOrgId: platformOrg.clerkOrgId,
    role,
    isVendorActive: false,
    ...(orgName !== undefined ? { orgName } : {}),
  };
  return { user: toAuthUser(identity), org };
}

// convex-helpers CustomBuilder spec types are recursive; `any` preserves handler ctx inference.
// eslint-disable-next-line @typescript-eslint/no-explicit-any -- Why: convex-helpers recursive spec; keeps handler ctx/args inferred
function wrapHandler<H extends (ctx: any, args: any) => unknown>(handler: H): H {
  const wrapped = (async (
    // eslint-disable-next-line @typescript-eslint/no-explicit-any -- Why: matches H; CustomBuilder supplies ctx shape
    ctx: any,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any -- Why: matches H; function-specific args
    args: any,
  ) => {
    try {
      return await handler(ctx, args);
    } catch (error: unknown) {
      // Re-throw any structured ConvexError unchanged. This covers our own appError
      // payloads, Convex runtime validator failures, and ConvexErrors raised by other
      // components. The unexpected-error correlation-id path is reserved for plain
      // errors only, so structured diagnostics are never replaced by
      // "internal.unexpected". Validator failures are caller-driven (bad client input),
      // not wrapper-internal bugs, so suppressing wrapper telemetry on them is the
      // right signal-to-noise tradeoff. Components that need their own error
      // telemetry should fire it before throwing.
      if (error instanceof ConvexError) throw error;
      const correlationId = createUnexpectedErrorCorrelationId();
      const { functionName, userTokenIdentifier, orgId, orgKind } =
        await collectUnexpectedWrapperContext(ctx as WrapperCtx);
      reportUnexpectedErrorForWrappers({
        functionName,
        correlationId,
        userTokenIdentifier,
        orgId,
        orgKind,
        args,
        error,
        errorDetail: summarizeUnknownError(error),
      });
      throw appError(
        "internal.unexpected",
        `Something went wrong. Reference: ${correlationId}`,
        { correlationId },
      );
    }
  }) as H;
  return wrapped;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any -- Why: CustomBuilder accepts function or object spec union
function wrapMutationlikeSpec(spec: any): any {
  if (typeof spec === "function") {
    const fn = wrapHandler(spec);
    // Preserve `args` and `returns` validators when the caller used the shorthand-function
    // form with attached metadata (e.g., `Object.assign(handler, { returns })`). Failing to
    // copy `args` would silently drop input validation for shorthand specs.
    // Reject explicit non-object/non-undefined values (e.g., `null`, primitives) so a
    // typo can't smuggle a non-validator through the wrap.
    if ("args" in spec && spec.args !== undefined) {
      if (typeof spec.args !== "object" || spec.args === null) {
        throw new Error(
          "Auth wrapper shorthand spec.args must be an object validator map",
        );
      }
      (fn as { args?: unknown }).args = spec.args;
    }
    if ("returns" in spec && spec.returns !== undefined) {
      if (typeof spec.returns !== "object" || spec.returns === null) {
        throw new Error(
          "Auth wrapper shorthand spec.returns must be a validator object",
        );
      }
      (fn as { returns?: unknown }).returns = spec.returns;
    }
    return fn;
  }
  if (
    typeof spec !== "object" ||
    spec === null ||
    typeof spec.handler !== "function"
  ) {
    throw new Error(
      "Auth wrapper spec must be a function or an object with a function handler property",
    );
  }
  return { ...spec, handler: wrapHandler(spec.handler) };
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any -- Why: convex-helpers builder factory is not exported as a narrow type
function wrapMutationlikeBuilder<Base extends (spec: any) => any>(
  base: Base,
): Base {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any -- Why: spec flows into CustomBuilder; boundary only
  return ((spec: any) => base(wrapMutationlikeSpec(spec))) as Base;
}

const customerCustomizationForQuery = customizationForQuery(customerContextDelta);
const customerCustomizationForMutation =
  customizationForMutation(customerContextDelta);

const vendorCustomizationForQuery = customizationForQuery(vendorContextDelta);
const vendorCustomizationForMutation =
  customizationForMutation(vendorContextDelta);

const vendorOwnerCustomizationForMutation =
  customizationForMutation(vendorOwnerContextDelta);

const adminCustomizationForQuery = customizationForQuery(adminContextDelta);
const adminCustomizationForMutation =
  customizationForMutation(adminContextDelta);

const basePublicQuery = customQuery(query, NoOp);
const basePublicMutation = customMutation(mutation, NoOp);

export const publicQuery = wrapMutationlikeBuilder(basePublicQuery);
export const publicMutation = wrapMutationlikeBuilder(basePublicMutation);

const baseCustomerQuery = customQuery(query, customerCustomizationForQuery);
const baseCustomerMutation = customMutation(
  mutation,
  customerCustomizationForMutation,
);

export const customerQuery = wrapMutationlikeBuilder(baseCustomerQuery);
export const customerMutation = wrapMutationlikeBuilder(baseCustomerMutation);

const baseVendorQuery = customQuery(query, vendorCustomizationForQuery);
const baseVendorMutation = customMutation(
  mutation,
  vendorCustomizationForMutation,
);

export const vendorQuery = wrapMutationlikeBuilder(baseVendorQuery);
export const vendorMutation = wrapMutationlikeBuilder(baseVendorMutation);

const baseVendorOwnerMutation = customMutation(
  mutation,
  vendorOwnerCustomizationForMutation,
);

export const vendorOwnerMutation = wrapMutationlikeBuilder(
  baseVendorOwnerMutation,
);

const baseAdminQuery = customQuery(query, adminCustomizationForQuery);
const baseAdminMutation = customMutation(
  mutation,
  adminCustomizationForMutation,
);

export const adminQuery = wrapMutationlikeBuilder(baseAdminQuery);
export const adminMutation = wrapMutationlikeBuilder(baseAdminMutation);

const baseInternalMutation = customMutation(internalMutationForRegistration, NoOp);

export const internalMutation = wrapMutationlikeBuilder(baseInternalMutation);

/** --- Internal API (tests / server-to-server only): same auth as public builders. --- */

const baseInternalPublicQuery = customQuery(internalQuery, NoOp);
const baseInternalPublicMutation = customMutation(
  internalMutationForRegistration,
  NoOp,
);

export const internalPublicQuery = wrapMutationlikeBuilder(
  baseInternalPublicQuery,
);
export const internalPublicMutation = wrapMutationlikeBuilder(
  baseInternalPublicMutation,
);

const baseInternalCustomerQuery = customQuery(
  internalQuery,
  customerCustomizationForQuery,
);
const baseInternalCustomerMutation = customMutation(
  internalMutationForRegistration,
  customerCustomizationForMutation,
);

export const internalCustomerQuery = wrapMutationlikeBuilder(
  baseInternalCustomerQuery,
);
export const internalCustomerMutation = wrapMutationlikeBuilder(
  baseInternalCustomerMutation,
);

const baseInternalVendorQuery = customQuery(
  internalQuery,
  vendorCustomizationForQuery,
);
const baseInternalVendorMutation = customMutation(
  internalMutationForRegistration,
  vendorCustomizationForMutation,
);

export const internalVendorQuery = wrapMutationlikeBuilder(
  baseInternalVendorQuery,
);
export const internalVendorMutation = wrapMutationlikeBuilder(
  baseInternalVendorMutation,
);

const baseInternalVendorOwnerMutation = customMutation(
  internalMutationForRegistration,
  vendorOwnerCustomizationForMutation,
);

export const internalVendorOwnerMutation = wrapMutationlikeBuilder(
  baseInternalVendorOwnerMutation,
);

const baseInternalAdminQuery = customQuery(
  internalQuery,
  adminCustomizationForQuery,
);
const baseInternalAdminMutation = customMutation(
  internalMutationForRegistration,
  adminCustomizationForMutation,
);

export const internalAdminQuery = wrapMutationlikeBuilder(baseInternalAdminQuery);
export const internalAdminMutation = wrapMutationlikeBuilder(
  baseInternalAdminMutation,
);

/** Convex-test only: exercises `runAuthCustomization` unexpected-error normalization. */
const baseInternalCustomizationFailureQuery = customQuery(internalQuery, {
  args: {},
  /* c8 ignore start -- runAuthCustomization always throws by design here, so the
     await-resolves branch and the post-await return are both unreachable. The
     unexpected-error path itself is tested via the await-rejects path; this
     fixture exists only as a vehicle for that test. */
  input: async (ctx: QueryCtx, args: unknown) => {
    const customCtx = await runAuthCustomization(
      ctx as WrapperCtx,
      args,
      async () => {
        throw new Error("f2t test fixture: customization throws");
      },
    );
    return { args: {}, ctx: customCtx };
  },
  /* c8 ignore stop */
});

export const internalCustomizationFailureQuery = wrapMutationlikeBuilder(
  baseInternalCustomizationFailureQuery,
);
