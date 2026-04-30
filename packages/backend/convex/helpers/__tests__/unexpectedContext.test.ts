/**
 * Tests for helpers/unexpectedContext.shared.ts
 *
 * Protects:
 * - collectUnexpectedWrapperContext never throws and fills telemetry fields best-effort
 * - When the wrapper has populated ctx.user / ctx.org, identity is read from there
 *   without a second JWT verification via getUserIdentity
 * - orgKind reflects ctx.org.kind so dashboards distinguish vendor vs platform incidents
 * - Metadata and auth failures degrade to undefined fields instead of propagating
 */

import { expect, it, vi } from "vitest";
import { F2T_CLAIMS } from "../authClaims.shared";
import { collectUnexpectedWrapperContext } from "../unexpectedContext.shared";

it("leaves functionName unset when ctx.meta is absent", async () => {
  const out = await collectUnexpectedWrapperContext({
    auth: { getUserIdentity: async () => null },
  });
  expect(out.functionName).toBeUndefined();
  expect(out.orgKind).toBe("unknown");
});

it("reads functionName from getFunctionMetadata when present", async () => {
  const out = await collectUnexpectedWrapperContext({
    meta: { getFunctionMetadata: async () => ({ name: "fixture:n" }) },
    auth: { getUserIdentity: async () => null },
  });
  expect(out.functionName).toBe("fixture:n");
});

it("treats missing meta.name as undefined functionName", async () => {
  const out = await collectUnexpectedWrapperContext({
    meta: { getFunctionMetadata: async () => ({}) },
    auth: { getUserIdentity: async () => null },
  });
  expect(out.functionName).toBeUndefined();
});

it("clears functionName when getFunctionMetadata rejects", async () => {
  const out = await collectUnexpectedWrapperContext({
    meta: {
      getFunctionMetadata: async () => {
        throw new Error("meta failed");
      },
    },
    auth: { getUserIdentity: async () => null },
  });
  expect(out.functionName).toBeUndefined();
});

it("maps authenticated identity to token and org id claims when ctx.user is unset", async () => {
  const out = await collectUnexpectedWrapperContext({
    auth: {
      getUserIdentity: async () => ({
        tokenIdentifier: "https://clerk.example.com|u1",
        subject: "u1",
        issuer: "https://clerk.example.com",
        [F2T_CLAIMS.orgId]: "org_claim",
      }),
    },
  });
  expect(out.userTokenIdentifier).toBe("https://clerk.example.com|u1");
  expect(out.orgId).toBe("org_claim");
  expect(out.orgKind).toBe("unknown");
});

it("omits org id when identity is null", async () => {
  const out = await collectUnexpectedWrapperContext({
    auth: { getUserIdentity: async () => null },
  });
  expect(out.userTokenIdentifier).toBeUndefined();
  expect(out.orgId).toBeUndefined();
});

it("clears auth telemetry fields when getUserIdentity rejects", async () => {
  const out = await collectUnexpectedWrapperContext({
    auth: {
      getUserIdentity: async () => {
        throw new Error("auth failed");
      },
    },
  });
  expect(out.userTokenIdentifier).toBeUndefined();
  expect(out.orgId).toBeUndefined();
  expect(out.orgKind).toBe("unknown");
});

it("reads ctx.user without calling getUserIdentity a second time", async () => {
  const getUserIdentity = vi.fn();
  const out = await collectUnexpectedWrapperContext({
    auth: { getUserIdentity },
    user: { tokenIdentifier: "tok-from-ctx" },
    org: { clerkOrgId: "org_v", kind: "vendor" },
  });
  expect(getUserIdentity).not.toHaveBeenCalled();
  expect(out.userTokenIdentifier).toBe("tok-from-ctx");
  expect(out.orgId).toBe("org_v");
  expect(out.orgKind).toBe("vendor");
});

it("uses platform orgKind when ctx.org.kind is platform", async () => {
  const out = await collectUnexpectedWrapperContext({
    auth: { getUserIdentity: async () => null },
    user: { tokenIdentifier: "tok" },
    org: { clerkOrgId: "org_p", kind: "platform" },
  });
  expect(out.orgKind).toBe("platform");
});

it("falls back to unknown orgKind when ctx.user has no org", async () => {
  const out = await collectUnexpectedWrapperContext({
    auth: { getUserIdentity: async () => null },
    user: { tokenIdentifier: "tok" },
  });
  expect(out.orgKind).toBe("unknown");
  expect(out.orgId).toBeUndefined();
});
