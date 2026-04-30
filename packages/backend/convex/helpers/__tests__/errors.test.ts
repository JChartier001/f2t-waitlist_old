/**
 * Tests for helpers/errors.ts
 *
 * Protects:
 * - appError throws ConvexError tagged with kind app and the given code
 * - appError strips prototype-mutating keys (`__proto__`, `constructor`, `prototype`)
 *   from data before serialization
 * - isAppConvexError narrows to ConvexError<AppConvexErrorPayload>
 * - readAppErrorPayload rejects payloads missing a string userMessage
 * - summarizeUnknownError walks cause chains, walks AggregateError children, and
 *   guards against cyclic cause / overlong chains without exploding
 * - summarizeUnknownError unwinds visited ancestors so siblings sharing a node are
 *   not falsely reported as cyclic
 * - summarizeUnknownError records `aggregatedTruncated` when AggregateError children
 *   exceed the per-summary cap
 * - summarizeUnknownError caps total nodes visited so AggregateError fan-out can't
 *   stall the V8 isolate
 * - Default telemetry sink redacts args and stack so deployment logs don't leak PII
 * - Telemetry sink failures never replace the normalized error path; nested console
 *   failures are ignored, including when console.error is the failing sink itself
 * - Last-resort correlation IDs are distinct so Sentry doesn't dedupe unrelated incidents
 */

import { ConvexError } from "convex/values";
import { afterEach, expect, it, vi } from "vitest";
import {
  appError,
  createUnexpectedErrorCorrelationId,
  isAppConvexError,
  readAppErrorPayload,
  reportUnexpectedErrorForWrappers,
  resetUnexpectedErrorTelemetryForTests,
  setUnexpectedErrorTelemetry,
  summarizeUnknownError,
} from "../errors";

const origCrypto = globalThis.crypto;

const UUID_RE =
  /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

afterEach(() => {
  vi.stubGlobal("crypto", origCrypto);
  resetUnexpectedErrorTelemetryForTests();
});

function boom(): never {
  throw new Error("boom");
}

it("tags ConvexError payloads with kind app and error code", () => {
  try {
    appError("validation.invalid", "Bad input", { field: "email" });
    expect.fail("expected throw");
  } catch (e: unknown) {
    expect(e).toBeInstanceOf(ConvexError);
    expect(isAppConvexError(e)).toBe(true);
    expect(readAppErrorPayload(e)?.code).toBe("validation.invalid");
    expect(readAppErrorPayload(e)?.userMessage).toBe("Bad input");
    expect(readAppErrorPayload(e)?.field).toBe("email");
  }
});

it("appError drops prototype-mutating keys to prevent prototype pollution", () => {
  // Construct an object that has `__proto__` as an own enumerable string key
  // (object-literal `__proto__:` is special-cased to setPrototypeOf, so we need
  // defineProperty to make Object.entries see it as a real key).
  const polluted: Record<string, unknown> = { ok: "x" };
  Object.defineProperty(polluted, "__proto__", {
    value: "should-be-stripped",
    enumerable: true,
    writable: true,
    configurable: true,
  });
  Object.defineProperty(polluted, "constructor", {
    value: "should-be-stripped-too",
    enumerable: true,
    writable: true,
    configurable: true,
  });
  try {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any -- Why: dynamic-key boundary; runtime guard is what we're testing
    appError("validation.invalid", "msg", polluted as any);
    expect.fail("expected throw");
  } catch (e: unknown) {
    const payload = readAppErrorPayload(e) as
      | (Record<string, unknown> & { ok?: string })
      | undefined;
    expect(payload).toBeDefined();
    expect(payload?.ok).toBe("x");
    // Strict own-property check: forbidden keys must not have leaked in as own props.
    // Reading payload.__proto__ would walk the prototype chain (always defined), so
    // we use hasOwnProperty as the load-bearing assertion.
    expect(
      Object.prototype.hasOwnProperty.call(payload, "__proto__"),
    ).toBe(false);
    expect(
      Object.prototype.hasOwnProperty.call(payload, "constructor"),
    ).toBe(false);
  }
});

it("appError strips undefined data values before serialization", () => {
  try {
    appError("validation.invalid", "x", { keep: "y", drop: undefined });
    expect.fail("expected throw");
  } catch (e: unknown) {
    const payload = readAppErrorPayload(e);
    expect(payload?.keep).toBe("y");
    expect("drop" in (payload ?? {})).toBe(false);
  }
});

it("readAppErrorPayload returns undefined for non-ConvexError values", () => {
  expect(readAppErrorPayload(new Error("plain"))).toBeUndefined();
  expect(readAppErrorPayload(undefined)).toBeUndefined();
  expect(readAppErrorPayload("string")).toBeUndefined();
});

it("readAppErrorPayload returns undefined when string data is not an app error", () => {
  const err = new ConvexError("x");
  (err as { data: unknown }).data = JSON.stringify({
    kind: "other",
    code: "x",
  });
  expect(readAppErrorPayload(err)).toBeUndefined();
});

it("readAppErrorPayload rejects payloads missing a string userMessage", () => {
  const err = new ConvexError("x");
  (err as { data: unknown }).data = { kind: "app", code: "validation.invalid" };
  expect(readAppErrorPayload(err)).toBeUndefined();
});

it("readAppErrorPayload rejects parsed JSON payloads missing userMessage", () => {
  const err = new ConvexError("x");
  (err as { data: unknown }).data = JSON.stringify({
    kind: "app",
    code: "validation.invalid",
  });
  expect(readAppErrorPayload(err)).toBeUndefined();
});

it("uses uuid-shaped fallback correlation id when crypto.randomUUID is unavailable", () => {
  vi.stubGlobal("crypto", undefined);
  const id = createUnexpectedErrorCorrelationId();
  expect(id).toMatch(UUID_RE);
});

it("falls back when randomUUID is present but throws", () => {
  vi.stubGlobal("crypto", {
    randomUUID: () => {
      boom();
    },
    getRandomValues: (arr: Uint8Array) => {
      for (let i = 0; i < arr.length; i++) arr[i] = (i * 17) % 256;
      return arr;
    },
  });
  const id = createUnexpectedErrorCorrelationId();
  expect(id).toMatch(UUID_RE);
});

it("correlation id uses Math.random when getRandomValues is unavailable", () => {
  vi.stubGlobal("crypto", {});
  const id = createUnexpectedErrorCorrelationId();
  expect(id).toMatch(UUID_RE);
});

it("correlation id falls through to a hardcoded UUID when fallback path itself throws", () => {
  vi.stubGlobal("crypto", {});
  const mathSpy = vi.spyOn(Math, "random").mockImplementation(() => {
    throw new Error("math broken");
  });
  const id = createUnexpectedErrorCorrelationId();
  expect(id).toMatch(UUID_RE);
  mathSpy.mockRestore();
});

it("readAppErrorPayload returns undefined when parsed app payload omits code", () => {
  const err = new ConvexError("x");
  (err as { data: unknown }).data = JSON.stringify({ kind: "app" });
  expect(readAppErrorPayload(err)).toBeUndefined();
});

it("readAppErrorPayload returns undefined for object data that is not app-shaped", () => {
  const err = new ConvexError("x");
  (err as { data: unknown }).data = { kind: "app", code: 1 };
  expect(readAppErrorPayload(err)).toBeUndefined();
});

it("readAppErrorPayload treats invalid JSON strings as undefined", () => {
  const err = new ConvexError("x");
  (err as { data: unknown }).data = "{{";
  expect(readAppErrorPayload(err)).toBeUndefined();
});

it("default telemetry redacts args and stack from console.error", () => {
  const spy = vi.spyOn(console, "error").mockImplementation(() => {});
  resetUnexpectedErrorTelemetryForTests();
  const err = new Error("fail");
  reportUnexpectedErrorForWrappers({
    functionName: "helpers/f:x",
    correlationId: "cid",
    userTokenIdentifier: "tok",
    orgId: "oid",
    orgKind: "vendor",
    args: { sensitiveField: "PII@example.com" },
    error: err,
    errorDetail: summarizeUnknownError(err),
  });
  expect(spy).toHaveBeenCalledTimes(1);
  const logged = spy.mock.calls[0]?.[1] as Record<string, unknown> | undefined;
  expect(logged).toBeDefined();
  expect(logged).not.toHaveProperty("args");
  expect(logged).not.toHaveProperty("stack");
  expect(logged?.["correlationId"]).toBe("cid");
  expect(logged?.["orgKind"]).toBe("vendor");
  spy.mockRestore();
});

it("setUnexpectedErrorTelemetry swaps the telemetry sink", () => {
  const sink = vi.fn();
  setUnexpectedErrorTelemetry(sink);
  reportUnexpectedErrorForWrappers({
    functionName: undefined,
    correlationId: "c2",
    userTokenIdentifier: "tok",
    orgId: "oid",
    orgKind: "vendor",
    args: { a: 1 },
    error: "boom",
    errorDetail: summarizeUnknownError("boom"),
  });
  expect(sink).toHaveBeenCalledTimes(1);
});

it("custom telemetry sinks receive raw args (Sentry adapter owns redaction)", () => {
  const sink = vi.fn();
  setUnexpectedErrorTelemetry(sink);
  reportUnexpectedErrorForWrappers({
    functionName: "x",
    correlationId: "c3",
    userTokenIdentifier: "tok",
    orgId: "oid",
    orgKind: "platform",
    args: { rawSecret: "kept-for-sentry" },
    error: new Error("e"),
    errorDetail: summarizeUnknownError(new Error("e")),
  });
  const captured = sink.mock.calls[0]?.[0] as { args?: { rawSecret?: string } };
  expect(captured.args?.rawSecret).toBe("kept-for-sentry");
});

it("swallows telemetry sink failures", () => {
  const spy = vi.spyOn(console, "error").mockImplementation(() => {});
  setUnexpectedErrorTelemetry(() => {
    throw new Error("sink broken");
  });
  const err = new Error("orig");
  expect(() =>
    reportUnexpectedErrorForWrappers({
      functionName: "fixture",
      correlationId: "c",
      userTokenIdentifier: undefined,
      orgId: undefined,
      orgKind: "unknown",
      args: {},
      error: err,
      errorDetail: summarizeUnknownError(err),
    }),
  ).not.toThrow();
  expect(spy).toHaveBeenCalled();
  spy.mockRestore();
  resetUnexpectedErrorTelemetryForTests();
});

it("summarizeUnknownError falls back when JSON.stringify fails on non-Error values", () => {
  const circ: Record<string, unknown> = {};
  circ.a = circ;
  expect(summarizeUnknownError(circ).message).toBe("[object Object]");
});

it("summarizeUnknownError uses String for causes when JSON.stringify of the summary throws", () => {
  const inner = new Error("inner");
  const parent = new Error("outer");
  (parent as Error & { cause?: unknown }).cause = inner;
  const spy = vi.spyOn(JSON, "stringify").mockImplementation((value, ...args) => {
    if (
      typeof value === "object" &&
      value !== null &&
      (value as { name?: string }).name === "Error" &&
      (value as { message?: string }).message === "inner"
    ) {
      throw new Error("json failed");
    }
    return JSON.stringify(value, ...(args as []));
  });
  const d = summarizeUnknownError(parent);
  spy.mockRestore();
  expect(d.cause).toBe(String(inner));
});

it("summarizeUnknownError omits stack when property is undefined", () => {
  const err = new Error("x");
  delete (err as { stack?: string }).stack;
  const d = summarizeUnknownError(err);
  expect(d.stack).toBeUndefined();
});

it("summarizeUnknownError truncates cause chains deeper than the recursion limit", () => {
  // Build a >MAX_DEPTH-long chain so the recursive summarize hits its depth guard.
  let chain: Error = new Error("leaf");
  for (let i = 0; i < 12; i += 1) {
    const next = new Error(`level${i}`);
    (next as Error & { cause?: unknown }).cause = chain;
    chain = next;
  }
  const d = summarizeUnknownError(chain);
  expect(typeof d.cause).toBe("string");
  expect(d.cause).toContain("[summary depth exceeded]");
});

it("summarizeUnknownError breaks cyclic cause chains without recursing forever", () => {
  const a = new Error("a");
  const b = new Error("b");
  (a as Error & { cause?: unknown }).cause = b;
  (b as Error & { cause?: unknown }).cause = a;
  const d = summarizeUnknownError(a);
  expect(d.message).toBe("a");
  // The cycle must be summarized; the test passes by virtue of returning at all.
  expect(typeof d.cause).toBe("string");
});

it("summarizeUnknownError falls back to a marker when both JSON and String fail on the cause", () => {
  // Hostile cause: toString throws AND the recursive JSON.stringify of the inner
  // summary is mocked to throw — exercises the catch-of-catch in the cause path.
  const hostileCause: Record<string, unknown> = {};
  Object.defineProperty(hostileCause, "toString", {
    value: () => {
      throw new Error("hostile toString");
    },
  });
  const parent = new Error("outer");
  (parent as Error & { cause?: unknown }).cause = hostileCause;
  const spy = vi.spyOn(JSON, "stringify").mockImplementation(() => {
    throw new Error("json broken");
  });
  const d = summarizeUnknownError(parent);
  spy.mockRestore();
  expect(d.cause).toBe("[unrepresentable cause]");
});

it("summarizeUnknownError falls back to a marker when both JSON and String fail on a non-Error value", () => {
  const hostile: Record<string, unknown> = {};
  Object.defineProperty(hostile, "toString", {
    value: () => {
      throw new Error("hostile toString");
    },
  });
  const spy = vi.spyOn(JSON, "stringify").mockImplementation(() => {
    throw new Error("json broken");
  });
  const d = summarizeUnknownError(hostile);
  spy.mockRestore();
  expect(d.message).toBe("[unrepresentable error]");
});

it("summarizeUnknownError includes aggregated children for AggregateError", () => {
  const agg = new AggregateError(
    [new Error("first"), new Error("second")],
    "agg failure",
  );
  const d = summarizeUnknownError(agg);
  expect(d.aggregated?.length).toBe(2);
  expect(d.aggregated?.[0]?.message).toBe("first");
  expect(d.aggregated?.[1]?.message).toBe("second");
  expect(d.aggregatedTruncated).toBeUndefined();
});

it("summarizeUnknownError records aggregatedTruncated for >8 AggregateError children", () => {
  const children = Array.from({ length: 12 }, (_, i) => new Error(`child${i}`));
  const agg = new AggregateError(children, "many");
  const d = summarizeUnknownError(agg);
  expect(d.aggregated?.length).toBe(8);
  expect(d.aggregatedTruncated).toBe(4);
});

it("summarizeUnknownError does not flag siblings that legitimately share a node", () => {
  const shared = new Error("shared");
  const agg = new AggregateError([shared, shared], "twins");
  const d = summarizeUnknownError(agg);
  // Both children should be summarized normally; cycle detector unwinds via the
  // ancestor stack so a sibling reference is not mistaken for a cycle.
  expect(d.aggregated?.[0]?.message).toBe("shared");
  expect(d.aggregated?.[1]?.message).toBe("shared");
});

it("summarizeUnknownError caps total nodes to bound AggregateError fan-out", () => {
  // Build a tree where every node is an AggregateError with 8 child AggregateErrors,
  // each with 8 simple children. Without the node-budget guard this would expand to
  // hundreds of nodes; the guard truncates with a marker.
  const leaves = (n: number) =>
    Array.from({ length: 8 }, (_, i) => new Error(`leaf${n}_${i}`));
  const mid = Array.from(
    { length: 8 },
    (_, i) => new AggregateError(leaves(i), `mid${i}`),
  );
  const top = new AggregateError(mid, "top");
  const d = summarizeUnknownError(top);
  expect(d.aggregated?.length).toBe(8);
  // At least one descendant should hit the node-budget marker.
  const hitBudget = JSON.stringify(d).includes("[summary node budget exceeded]");
  expect(hitBudget).toBe(true);
});

it("createUnexpectedErrorCorrelationId yields distinct ids even on the deepest fallback path", () => {
  // Force every entropy source to throw so we land on the last-resort counter path.
  vi.stubGlobal("crypto", {});
  const mathSpy = vi.spyOn(Math, "random").mockImplementation(() => {
    throw new Error("math broken");
  });
  const a = createUnexpectedErrorCorrelationId();
  const b = createUnexpectedErrorCorrelationId();
  mathSpy.mockRestore();
  expect(a).toMatch(UUID_RE);
  expect(b).toMatch(UUID_RE);
  expect(a).not.toBe(b);
});

it("default telemetry sink survives console.error throwing", () => {
  // Default sink IS console.error; the wrapper's catch-of-catch should swallow
  // a console that throws, even with no custom sink installed.
  const spy = vi.spyOn(console, "error").mockImplementation(() => {
    throw new Error("console broken");
  });
  resetUnexpectedErrorTelemetryForTests();
  const err = new Error("orig");
  expect(() =>
    reportUnexpectedErrorForWrappers({
      functionName: "fixture",
      correlationId: "c",
      userTokenIdentifier: undefined,
      orgId: undefined,
      orgKind: "unknown",
      args: {},
      error: err,
      errorDetail: summarizeUnknownError(err),
    }),
  ).not.toThrow();
  spy.mockRestore();
});

it("ignores telemetry and fallback logging when console.error keeps throwing", () => {
  const spy = vi
    .spyOn(console, "error")
    .mockImplementation(() => {
      throw new Error("console broken");
    });
  setUnexpectedErrorTelemetry(() => {
    throw new Error("sink broken");
  });
  const err = new Error("orig");
  expect(() =>
    reportUnexpectedErrorForWrappers({
      functionName: "fixture",
      correlationId: "c",
      userTokenIdentifier: undefined,
      orgId: undefined,
      orgKind: "unknown",
      args: {},
      error: err,
      errorDetail: summarizeUnknownError(err),
    }),
  ).not.toThrow();
  expect(spy).toHaveBeenCalled();
  spy.mockRestore();
  resetUnexpectedErrorTelemetryForTests();
});
