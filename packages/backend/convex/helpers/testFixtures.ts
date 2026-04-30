import { v } from "convex/values";
import {
  internalAdminMutation,
  internalAdminQuery,
  internalCustomizationFailureQuery,
  internalCustomerMutation,
  internalCustomerQuery,
  internalMutation,
  internalPublicMutation,
  internalPublicQuery,
  internalVendorMutation,
  internalVendorOwnerMutation,
  internalVendorQuery,
  type AuthOrg,
  type AuthUser,
} from "./auth";
import { appError } from "./errors";

/** Shared handler so Vitest coverage counts the slot `fixtureCustomizationThrows` never reaches. */
async function nullFixtureHandler(): Promise<null> {
  return null;
}

export const fixtureCustomerEcho = internalCustomerQuery({
  args: { msg: v.string() },
  handler: async (ctx, args) => {
    const { user } = ctx as { user: AuthUser };
    return {
      token: user.tokenIdentifier,
      msg: args.msg,
      ...(user.email !== undefined ? { email: user.email } : {}),
      ...(user.name !== undefined ? { name: user.name } : {}),
    };
  },
});

export const fixtureCustomerMutatePing = internalCustomerMutation({
  args: { n: v.number() },
  handler: async (ctx, args) => {
    const { user } = ctx as { user: AuthUser };
    return user.subject.length + args.n;
  },
});

export const fixtureVendorEcho = internalVendorMutation({
  args: {},
  handler: async (ctx) => {
    const { org } = ctx as { org: AuthOrg };
    return {
      orgId: org.clerkOrgId,
      role: org.role,
    };
  },
});

export const fixtureVendorQueryOrg = internalVendorQuery({
  args: {},
  handler: async (ctx) => {
    const { org } = ctx as { org: AuthOrg };
    return org.clerkOrgId;
  },
});

export const fixtureVendorQueryOrgName = internalVendorQuery({
  args: {},
  handler: async (ctx) => {
    const { org } = ctx as { org: AuthOrg };
    return org.orgName ?? "";
  },
});

export const fixtureVendorOwnerEcho = internalVendorOwnerMutation({
  args: {},
  handler: async (ctx) => {
    const { org } = ctx as { org: AuthOrg };
    return {
      orgId: org.clerkOrgId,
      ...(org.orgName !== undefined ? { orgName: org.orgName } : {}),
    };
  },
});

export const fixtureAdminEcho = internalAdminMutation({
  args: {},
  handler: async (ctx) => {
    const { user, org } = ctx as { user: AuthUser; org: AuthOrg };
    return {
      orgName: org.orgName,
      user: user.tokenIdentifier,
    };
  },
});

export const fixtureAdminQueryOrgName = internalAdminQuery({
  args: {},
  handler: async (ctx) => {
    const { org } = ctx as { org: AuthOrg };
    return org.orgName ?? "";
  },
});

export const fixtureCustomizationThrows = internalCustomizationFailureQuery({
  args: {},
  returns: v.null(),
  handler: nullFixtureHandler,
});

export const fixturePublicNull = internalPublicQuery({
  args: {},
  returns: v.null(),
  handler: nullFixtureHandler,
});

export const fixtureThrowsUnexpected = internalPublicQuery({
  args: {},
  handler: async () => {
    throw new Error("fixture boom");
  },
});

export const fixtureThrowsAppError = internalPublicQuery({
  args: {},
  handler: async () => {
    throw appError("validation.invalid", "fixture validation");
  },
});

export const fixturePublicMutEcho = internalPublicMutation({
  args: { x: v.string() },
  handler: async (ctx, args) => {
    void ctx;
    return args.x;
  },
});

export const fixtureInternalInc = internalMutation({
  args: { n: v.number() },
  handler: async (ctx, args) => {
    void ctx;
    return args.n + 1;
  },
});

// Permissive shorthand-handler shape so async-and-sync variants share a single cast site.
// Convex's CustomBuilder accepts either signature at runtime; the local type is just a
// stable cast target.
type ShorthandHandler = (
  ctx: unknown,
  args: Record<string, never>,
) => unknown;

const fixtureShorthandPublicHandler: ShorthandHandler = (ctx, args) => {
  void ctx;
  void args;
  return "shorthand-ok";
};

export const fixtureShorthandPublicQuery = internalPublicQuery(
  fixtureShorthandPublicHandler,
);

export const fixtureShorthandPublicWithReturns = internalPublicQuery(
  Object.assign(
    async (ctx: unknown, args: Record<string, never>) => {
      void ctx;
      void args;
      return null;
    },
    { returns: v.null() },
  ) as ShorthandHandler,
);

// Exercises the wrapMutationlikeSpec branch that copies `spec.args` from a shorthand
// function. Args validators must survive the wrap so input validation isn't silently
// dropped for shorthand specs.
export const fixtureShorthandPublicWithArgs = internalPublicQuery(
  Object.assign(
    async (ctx: unknown, args: { msg: string }) => {
      void ctx;
      return args.msg;
    },
    { args: { msg: v.string() } },
  ) as unknown as ShorthandHandler,
);
