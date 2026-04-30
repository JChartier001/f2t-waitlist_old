/**
 * Tests for helpers/auth.ts via helpers/testFixtures.ts (internal fixtures)
 *
 * Protects:
 * - Anonymous callers are rejected by customerQuery-backed fixtures
 * - Authenticated users without active vendor org are rejected by vendorMutation
 * - Vendor members without owner role are rejected by vendorOwnerMutation
 * - Platform org members succeed through adminMutation when session org id matches CLERK_PLATFORM_ORG_ID
 * - Admin wrappers reject non-matching org id even if org name is Platform
 * - Unexpected handler errors surface as internal.unexpected with correlationId
 * - Customization-phase failures are normalized the same way (correlationId + telemetry)
 */

import { ConvexError } from "convex/values";
import type { UserIdentity } from "convex/server";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { internal } from "../../_generated/api";
import { initConvexTest } from "../../__test_helpers/initConvexTest.setup";
import { F2T_CLAIMS } from "../authClaims.shared";
import {
  readAppErrorPayload,
  resetUnexpectedErrorTelemetryForTests,
  setUnexpectedErrorTelemetry,
} from "../errors";

const CLERK_ISSUER =
  process.env.CLERK_JWT_ISSUER_DOMAIN ?? "https://clerk.example.com";
const PLATFORM_ORG_ID =
  process.env.CLERK_PLATFORM_ORG_ID ?? "org_test_platform";

beforeEach(() => {
  resetUnexpectedErrorTelemetryForTests();
});

afterEach(() => {
  // Reset the telemetry sink symmetrically so a within-test setUnexpectedErrorTelemetry
  // call doesn't leak its mock into the next test's beforeEach window.
  resetUnexpectedErrorTelemetryForTests();
  vi.unstubAllEnvs();
});

describe("auth wrapper fixtures", () => {
  it("rejects anonymous callers for customerQuery", async () => {
    const t = initConvexTest();
    const err = await t
      .query(internal.helpers.testFixtures.fixtureCustomerEcho, { msg: "hi" })
      .catch((e: unknown) => e);
    expect(err).toBeInstanceOf(ConvexError);
    expect(readAppErrorPayload(err)?.code).toBe("auth.unauthenticated");
  });

  it("allows authenticated customerQuery when identity is present", async () => {
    const t = initConvexTest().withIdentity({
      tokenIdentifier: `${CLERK_ISSUER}|user_c1`,
      subject: "user_c1",
      issuer: CLERK_ISSUER,
    });
    const out = await t.query(internal.helpers.testFixtures.fixtureCustomerEcho, {
      msg: "hello",
    });
    expect(out.msg).toBe("hello");
    expect(out.token).toContain("user_c1");
  });

  it("maps optional email and name claims onto customerQuery user context", async () => {
    const t = initConvexTest().withIdentity({
      tokenIdentifier: `${CLERK_ISSUER}|user_profile`,
      subject: "user_profile",
      issuer: CLERK_ISSUER,
      email: "farm@example.com",
      name: "Farm Friend",
    } as UserIdentity);
    const out = await t.query(internal.helpers.testFixtures.fixtureCustomerEcho, {
      msg: "hey",
    });
    expect(out.msg).toBe("hey");
    expect(out.email).toBe("farm@example.com");
    expect(out.name).toBe("Farm Friend");
  });

  it("rejects vendorMutation when the session marks the org inactive", async () => {
    const t = initConvexTest().withIdentity({
      tokenIdentifier: `${CLERK_ISSUER}|inact`,
      subject: "inact",
      issuer: CLERK_ISSUER,
      [F2T_CLAIMS.orgId]: "org_inactive",
      [F2T_CLAIMS.vendorOrgIsActive]: false,
      [F2T_CLAIMS.orgRole]: "org:owner",
    });
    await expect(
      t.mutation(internal.helpers.testFixtures.fixtureVendorEcho, {}),
    ).rejects.toBeInstanceOf(ConvexError);
  });

  it("supports vendorMutation for active vendor identities", async () => {
    const t = initConvexTest().withIdentity({
      tokenIdentifier: `${CLERK_ISSUER}|vm_ok`,
      subject: "vm_ok",
      issuer: CLERK_ISSUER,
      [F2T_CLAIMS.orgId]: "org_vm",
      [F2T_CLAIMS.vendorOrgIsActive]: true,
      [F2T_CLAIMS.orgRole]: "org:member",
    });
    const out = await t.mutation(internal.helpers.testFixtures.fixtureVendorEcho, {});
    expect(out.orgId).toBe("org_vm");
    expect(out.role).toBe("org:member");
  });

  it("rejects vendorMutation when identity lacks an active vendor org", async () => {
    const t = initConvexTest().withIdentity({
      tokenIdentifier: `${CLERK_ISSUER}|user_v1`,
      subject: "user_v1",
      issuer: CLERK_ISSUER,
    });
    const err = await t
      .mutation(internal.helpers.testFixtures.fixtureVendorEcho, {})
      .catch((e: unknown) => e);
    expect(err).toBeInstanceOf(ConvexError);
    expect(readAppErrorPayload(err)?.code).toBe("auth.forbidden");
    expect(readAppErrorPayload(err)?.userMessage).toBe(
      "Active vendor organization membership is required.",
    );
  });

  it("rejects vendorOwnerMutation when unauthenticated", async () => {
    const t = initConvexTest();
    const err = await t
      .mutation(internal.helpers.testFixtures.fixtureVendorOwnerEcho, {})
      .catch((e: unknown) => e);
    expect(err).toBeInstanceOf(ConvexError);
    expect(readAppErrorPayload(err)?.code).toBe("auth.unauthenticated");
  });

  it("rejects vendorOwnerMutation when the user has no active vendor org", async () => {
    const t = initConvexTest().withIdentity({
      tokenIdentifier: `${CLERK_ISSUER}|nov`,
      subject: "nov",
      issuer: CLERK_ISSUER,
    });
    const err = await t
      .mutation(internal.helpers.testFixtures.fixtureVendorOwnerEcho, {})
      .catch((e: unknown) => e);
    expect(err).toBeInstanceOf(ConvexError);
    expect(readAppErrorPayload(err)?.code).toBe("auth.forbidden");
    expect(readAppErrorPayload(err)?.userMessage).toBe(
      "Active vendor organization membership is required.",
    );
  });

  it("rejects vendorOwnerMutation for non-owner vendor roles", async () => {
    const t = initConvexTest().withIdentity({
      tokenIdentifier: `${CLERK_ISSUER}|user_member`,
      subject: "user_member",
      issuer: CLERK_ISSUER,
      [F2T_CLAIMS.orgId]: "org_123",
      [F2T_CLAIMS.vendorOrgIsActive]: true,
      [F2T_CLAIMS.orgRole]: "org:member",
    });
    const err = await t
      .mutation(internal.helpers.testFixtures.fixtureVendorOwnerEcho, {})
      .catch((e: unknown) => e);
    expect(err).toBeInstanceOf(ConvexError);
    expect(readAppErrorPayload(err)?.code).toBe("auth.forbidden");
    expect(readAppErrorPayload(err)?.userMessage).toBe(
      "Vendor owner role is required.",
    );
  });

  it("rejects vendorQuery when unauthenticated", async () => {
    const t = initConvexTest();
    await expect(
      t.query(internal.helpers.testFixtures.fixtureVendorQueryOrg, {}),
    ).rejects.toBeInstanceOf(ConvexError);
  });

  it("maps missing vendor org name to an empty string in vendorQuery", async () => {
    const t = initConvexTest().withIdentity({
      tokenIdentifier: `${CLERK_ISSUER}|vnoname`,
      subject: "vnoname",
      issuer: CLERK_ISSUER,
      [F2T_CLAIMS.orgId]: "org_noname",
      [F2T_CLAIMS.vendorOrgIsActive]: true,
      [F2T_CLAIMS.orgRole]: "org:owner",
    });
    const label = await t.query(
      internal.helpers.testFixtures.fixtureVendorQueryOrgName,
      {},
    );
    expect(label).toBe("");
  });

  it("resolves vendor org id in vendorQuery for active owner", async () => {
    const t = initConvexTest().withIdentity({
      tokenIdentifier: `${CLERK_ISSUER}|vend`,
      subject: "vend",
      issuer: CLERK_ISSUER,
      [F2T_CLAIMS.orgId]: "org_v",
      [F2T_CLAIMS.vendorOrgIsActive]: true,
      [F2T_CLAIMS.orgRole]: "org:owner",
    });
    const org = await t.query(internal.helpers.testFixtures.fixtureVendorQueryOrg, {});
    expect(org).toBe("org_v");
  });

  it("passes vendor org name through resolved org context when present in claims", async () => {
    const t = initConvexTest().withIdentity({
      tokenIdentifier: `${CLERK_ISSUER}|vn`,
      subject: "vn",
      issuer: CLERK_ISSUER,
      [F2T_CLAIMS.orgId]: "org_named",
      [F2T_CLAIMS.vendorOrgIsActive]: true,
      [F2T_CLAIMS.orgRole]: "org:owner",
      [F2T_CLAIMS.orgName]: "Berry Patch",
    });
    const label = await t.query(
      internal.helpers.testFixtures.fixtureVendorQueryOrgName,
      {},
    );
    expect(label).toBe("Berry Patch");
  });

  it("allows vendorOwnerMutation for the owner role alias", async () => {
    const t = initConvexTest().withIdentity({
      tokenIdentifier: `${CLERK_ISSUER}|own`,
      subject: "own",
      issuer: CLERK_ISSUER,
      [F2T_CLAIMS.orgId]: "org_o",
      [F2T_CLAIMS.vendorOrgIsActive]: true,
      [F2T_CLAIMS.orgRole]: "owner",
    });
    const out = await t.mutation(
      internal.helpers.testFixtures.fixtureVendorOwnerEcho,
      {},
    );
    expect(out.orgId).toBe("org_o");
  });

  it("includes org display name on vendor owner org context when claim is present", async () => {
    const t = initConvexTest().withIdentity({
      tokenIdentifier: `${CLERK_ISSUER}|own2`,
      subject: "own2",
      issuer: CLERK_ISSUER,
      [F2T_CLAIMS.orgId]: "org_named_owner",
      [F2T_CLAIMS.vendorOrgIsActive]: true,
      [F2T_CLAIMS.orgRole]: "org:owner",
      [F2T_CLAIMS.orgName]: "Covered Bridge Farm",
    });
    const out = await t.mutation(
      internal.helpers.testFixtures.fixtureVendorOwnerEcho,
      {},
    );
    expect(out).toMatchObject({
      orgId: "org_named_owner",
      orgName: "Covered Bridge Farm",
    });
  });

  it("rejects adminQuery when unauthenticated", async () => {
    const t = initConvexTest();
    await expect(
      t.query(internal.helpers.testFixtures.fixtureAdminQueryOrgName, {}),
    ).rejects.toBeInstanceOf(ConvexError);
  });

  it("rejects adminQuery for authenticated non-platform users", async () => {
    const t = initConvexTest().withIdentity({
      tokenIdentifier: `${CLERK_ISSUER}|cust`,
      subject: "cust",
      issuer: CLERK_ISSUER,
    });
    const err = await t
      .query(internal.helpers.testFixtures.fixtureAdminQueryOrgName, {})
      .catch((e: unknown) => e);
    expect(err).toBeInstanceOf(ConvexError);
    expect(readAppErrorPayload(err)?.code).toBe("auth.forbidden");
  });

  it("accepts publicQuery registrations using a bare function spec", async () => {
    const t = initConvexTest();
    const out = await t.query(
      internal.helpers.testFixtures.fixtureShorthandPublicQuery,
      {},
    );
    expect(out).toBe("shorthand-ok");
  });

  it("accepts publicQuery shorthand functions that declare return validators", async () => {
    const t = initConvexTest();
    const out = await t.query(
      internal.helpers.testFixtures.fixtureShorthandPublicWithReturns,
      {},
    );
    expect(out).toBeNull();
  });

  it("preserves args validators on shorthand publicQuery specs", async () => {
    const t = initConvexTest();
    // The fixture's TS reference forgets the inner args validator (it is cast through
    // `ShorthandHandler` so the wrap fn signature stays uniform); cast at the test
    // boundary to call it with the validated args shape.
    // eslint-disable-next-line @typescript-eslint/no-explicit-any -- Why: shorthand fixture's args type is intentionally erased; runtime validation still applies
    const ref = internal.helpers.testFixtures.fixtureShorthandPublicWithArgs as any;
    const out = (await t.query(ref, { msg: "hello" })) as string;
    expect(out).toBe("hello");
  });

  it("rejects shorthand publicQuery calls that violate the preserved args validator", async () => {
    // This is the load-bearing test for the wrapMutationlikeSpec args-copy patch:
    // if the args validator was silently dropped, the call would reach the handler
    // with bogus input and return successfully. Convex's runtime should validate
    // the input shape and reject before the handler runs.
    const t = initConvexTest();
    // eslint-disable-next-line @typescript-eslint/no-explicit-any -- Why: deliberately pass an invalid args shape to prove validator wired
    const ref = internal.helpers.testFixtures.fixtureShorthandPublicWithArgs as any;
    await expect(
      // eslint-disable-next-line @typescript-eslint/no-explicit-any -- Why: bad-shape input is the point of the test
      t.query(ref, { msg: 42 } as any),
    ).rejects.toThrow();
  });

  it("supports customerMutation for authenticated users", async () => {
    const t = initConvexTest().withIdentity({
      tokenIdentifier: `${CLERK_ISSUER}|cm`,
      subject: "cm",
      issuer: CLERK_ISSUER,
    });
    const n = await t.mutation(
      internal.helpers.testFixtures.fixtureCustomerMutatePing,
      { n: 4 },
    );
    expect(n).toBe(2 + 4);
  });

  it("adminQuery maps missing org name to an empty string for platform org id sessions", async () => {
    vi.stubEnv("CLERK_PLATFORM_ORG_ID", "org_adm_only");
    const t = initConvexTest().withIdentity({
      tokenIdentifier: `${CLERK_ISSUER}|adm2`,
      subject: "adm2",
      issuer: CLERK_ISSUER,
      [F2T_CLAIMS.orgId]: "org_adm_only",
    });
    const name = await t.query(
      internal.helpers.testFixtures.fixtureAdminQueryOrgName,
      {},
    );
    expect(name).toBe("");
  });

  it("supports adminQuery for Platform org session claims", async () => {
    const t = initConvexTest().withIdentity({
      tokenIdentifier: `${CLERK_ISSUER}|aq`,
      subject: "aq",
      issuer: CLERK_ISSUER,
      [F2T_CLAIMS.orgName]: "Platform",
      [F2T_CLAIMS.orgId]: PLATFORM_ORG_ID,
      // Provide a role so the trim branch in adminContextDelta is exercised.
      [F2T_CLAIMS.orgRole]: "  admin  ",
    });
    const name = await t.query(
      internal.helpers.testFixtures.fixtureAdminQueryOrgName,
      {},
    );
    expect(name).toBe("Platform");
  });

  it("rejects adminQuery when CLERK_PLATFORM_ORG_ID is set but org id does not match", async () => {
    vi.stubEnv("CLERK_PLATFORM_ORG_ID", "org_strict");
    const t = initConvexTest().withIdentity({
      tokenIdentifier: `${CLERK_ISSUER}|nope`,
      subject: "nope",
      issuer: CLERK_ISSUER,
      [F2T_CLAIMS.orgName]: "Platform",
      [F2T_CLAIMS.orgId]: "wrong_org",
    });
    await expect(
      t.query(internal.helpers.testFixtures.fixtureAdminQueryOrgName, {}),
    ).rejects.toBeInstanceOf(ConvexError);
  });

  it("supports publicMutation without an authenticated user", async () => {
    const t = initConvexTest();
    const out = await t.mutation(internal.helpers.testFixtures.fixturePublicMutEcho, {
      x: "ping",
    });
    expect(out).toBe("ping");
  });

  it("runs internalMutation through the internal API handle", async () => {
    const t = initConvexTest();
    const n = await t.mutation(internal.helpers.testFixtures.fixtureInternalInc, {
      n: 5,
    });
    expect(n).toBe(6);
  });

  it("executes shared null-handler fixture for coverage of customization sibling", async () => {
    const t = initConvexTest();
    const v = await t.query(internal.helpers.testFixtures.fixturePublicNull, {});
    expect(v).toBeNull();
  });

  it("allows adminMutation for Platform org session claims", async () => {
    const t = initConvexTest().withIdentity({
      tokenIdentifier: `${CLERK_ISSUER}|admin_a`,
      subject: "admin_a",
      issuer: CLERK_ISSUER,
      [F2T_CLAIMS.orgName]: "Platform",
      [F2T_CLAIMS.orgId]: PLATFORM_ORG_ID,
    });
    const out = await t.mutation(internal.helpers.testFixtures.fixtureAdminEcho, {});
    expect(out.orgName).toBe("Platform");
    expect(out.user).toContain("admin_a");
  });

  it("rethrows structured appError from handlers without internal normalization", async () => {
    const telemetry = vi.fn();
    setUnexpectedErrorTelemetry(telemetry);
    const t = initConvexTest();
    const err = await t
      .query(internal.helpers.testFixtures.fixtureThrowsAppError, {})
      .catch((e: unknown) => e);
    expect(err).toBeInstanceOf(ConvexError);
    expect(readAppErrorPayload(err)?.code).toBe("validation.invalid");
    // App errors are structured diagnostics; the unexpected-error telemetry path
    // must not fire for them or the Sentry signal becomes noise.
    expect(telemetry).not.toHaveBeenCalled();
  });

  it("maps unexpected errors to internal.unexpected with correlationId", async () => {
    const telemetry = vi.fn();
    setUnexpectedErrorTelemetry(telemetry);
    const t = initConvexTest();
    const err = await t
      .query(internal.helpers.testFixtures.fixtureThrowsUnexpected, {})
      .catch((e: unknown) => e);
    expect(err).toBeInstanceOf(ConvexError);
    const payload = readAppErrorPayload(err);
    expect(payload?.code).toBe("internal.unexpected");
    const correlationId = payload?.correlationId;
    expect(typeof correlationId).toBe("string");
    expect((correlationId as string).length).toBeGreaterThan(3);
    expect(payload?.userMessage).toContain(correlationId as string);
    expect(telemetry).toHaveBeenCalledTimes(1);
    const telPayload = telemetry.mock.calls[0]![0] as {
      correlationId?: string;
      errorDetail?: { name?: string; message?: string };
      args?: unknown;
    };
    expect(typeof telPayload.correlationId).toBe("string");
    expect(telPayload.errorDetail?.name).toBe("Error");
    expect(telPayload.args).toEqual({});
  });

  it("maps customization failures to internal.unexpected with correlationId", async () => {
    const telemetry = vi.fn();
    setUnexpectedErrorTelemetry(telemetry);
    const t = initConvexTest();
    const err = await t
      .query(internal.helpers.testFixtures.fixtureCustomizationThrows, {})
      .catch((e: unknown) => e);
    expect(err).toBeInstanceOf(ConvexError);
    const payload = readAppErrorPayload(err);
    expect(payload?.code).toBe("internal.unexpected");
    expect(telemetry).toHaveBeenCalledTimes(1);
    const telPayload = telemetry.mock.calls[0]![0] as {
      args?: unknown;
      errorDetail?: { message?: string };
    };
    expect(telPayload.args).toEqual({});
    expect(telPayload.errorDetail?.message).toContain("customization throws");
  });

  it("fails fast when shorthand spec.args is null", async () => {
    await expect(import("./badArgsRegistration")).rejects.toThrow(
      /args must be an object validator map/,
    );
  });

  it("fails fast when shorthand spec.returns is null", async () => {
    await expect(import("./badReturnsRegistration")).rejects.toThrow(
      /returns must be a validator object/,
    );
  });

  it("fails fast when a wrapper spec handler is not a function", async () => {
    await expect(import("./badHandlerRegistration")).rejects.toThrow(
      /handler property/,
    );
  });
});
