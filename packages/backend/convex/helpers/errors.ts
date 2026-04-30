import { ConvexError, type Value } from "convex/values";

export type AppErrorCode =
  | "auth.unauthenticated"
  | "auth.forbidden"
  | "validation.invalid"
  | "internal.unexpected";

export type AppConvexErrorPayload = {
  kind: "app";
  code: AppErrorCode;
  userMessage: string;
} & Record<string, Value>;

/** JSON-safe summary for Convex/V8 telemetry (no circular refs). */
export type ErrorDetailForTelemetry = {
  name: string;
  message: string;
  stack?: string;
  cause?: string;
  /** Aggregated child-error summaries when the error was an `AggregateError`. */
  aggregated?: ReadonlyArray<{ name: string; message: string }>;
  /** Number of `AggregateError.errors` children dropped past the per-summary cap. */
  aggregatedTruncated?: number;
};

export type UnexpectedErrorTelemetryPayload = {
  functionName: string | undefined;
  correlationId: string;
  userTokenIdentifier: string | undefined;
  orgId: string | undefined;
  /** "platform" / "vendor" / "unknown" — lets dashboards pivot without re-checking env. */
  orgKind: "platform" | "vendor" | "unknown";
  /**
   * Caller-supplied args. May contain PII once domain mutations land. The default
   * `console.error` sink redacts this. Custom telemetry adapters (Story 1.12 Sentry)
   * receive the raw value and own field-level redaction policy.
   */
  args: unknown;
  /** Raw value for debugging; prefer `errorDetail` in sinks. */
  error: unknown;
  errorDetail: ErrorDetailForTelemetry;
};

type TelemetryHandler = (payload: UnexpectedErrorTelemetryPayload) => void;

/**
 * Default sink redacts `args` and `errorDetail.stack` because deployment logs are not a
 * privacy boundary. Story 1.12 swaps this for a Sentry adapter that receives the full
 * payload and applies its own redaction policy.
 */
function defaultUnexpectedTelemetry(
  payload: UnexpectedErrorTelemetryPayload,
): void {
  console.error("[f2t.convex.unexpected]", {
    functionName: payload.functionName,
    correlationId: payload.correlationId,
    userTokenIdentifier: payload.userTokenIdentifier,
    orgId: payload.orgId,
    orgKind: payload.orgKind,
    errorName: payload.errorDetail.name,
    errorMessage: payload.errorDetail.message,
    aggregated: payload.errorDetail.aggregated,
    aggregatedTruncated: payload.errorDetail.aggregatedTruncated,
  });
}

let reportUnexpectedError: TelemetryHandler = defaultUnexpectedTelemetry;

/**
 * Story 1.12 may replace this with a Sentry-backed adapter from Next.js tooling;
 * Convex stays V8-only and never imports Node Sentry SDKs.
 */
export function setUnexpectedErrorTelemetry(handler: TelemetryHandler): void {
  reportUnexpectedError = handler;
}

export function resetUnexpectedErrorTelemetryForTests(): void {
  reportUnexpectedError = defaultUnexpectedTelemetry;
}

const SUMMARY_MAX_DEPTH = 8;
const SUMMARY_MAX_AGGREGATED_PER_LEVEL = 8;
/** Hard ceiling on total summary nodes visited per top-level call (depth × fan-out). */
const SUMMARY_MAX_NODES = 64;

type SummaryState = {
  /** Cycle detector — only nodes on the current ancestor path are added; siblings are not "cyclic". */
  ancestors: Set<unknown>;
  /** Total nodes summarized this top-level call. Hard-cap to bound AggregateError fan-out. */
  visitedCount: number;
};

function summarizeUnknownErrorInner(
  error: unknown,
  depth: number,
  state: SummaryState,
): ErrorDetailForTelemetry {
  if (depth > SUMMARY_MAX_DEPTH) {
    return { name: "Error", message: "[summary depth exceeded]" };
  }
  state.visitedCount += 1;
  if (state.visitedCount > SUMMARY_MAX_NODES) {
    return { name: "Error", message: "[summary node budget exceeded]" };
  }
  const trackable = typeof error === "object" && error !== null;
  if (trackable) {
    if (state.ancestors.has(error)) {
      return { name: "Error", message: "[cyclic error reference]" };
    }
    state.ancestors.add(error);
  }
  try {
    if (error instanceof Error) {
      let cause: string | undefined;
      const rawCause = (error as Error & { cause?: unknown }).cause;
      if (rawCause !== undefined) {
        try {
          cause = JSON.stringify(
            summarizeUnknownErrorInner(rawCause, depth + 1, state),
          );
        } catch {
          try {
            cause = String(rawCause);
          } catch {
            cause = "[unrepresentable cause]";
          }
        }
      }
      let aggregated:
        | ReadonlyArray<{ name: string; message: string }>
        | undefined;
      let aggregatedTruncated: number | undefined;
      const rawErrors = (error as Error & { errors?: unknown }).errors;
      if (Array.isArray(rawErrors) && rawErrors.length > 0) {
        const captured = rawErrors.slice(0, SUMMARY_MAX_AGGREGATED_PER_LEVEL);
        aggregated = captured.map((child) => {
          const childSummary = summarizeUnknownErrorInner(
            child,
            depth + 1,
            state,
          );
          return { name: childSummary.name, message: childSummary.message };
        });
        if (rawErrors.length > captured.length) {
          aggregatedTruncated = rawErrors.length - captured.length;
        }
      }
      return {
        name: error.name,
        message: error.message,
        ...(error.stack !== undefined ? { stack: error.stack } : {}),
        ...(cause !== undefined ? { cause } : {}),
        ...(aggregated !== undefined ? { aggregated } : {}),
        ...(aggregatedTruncated !== undefined ? { aggregatedTruncated } : {}),
      };
    }
    if (typeof error === "string") {
      return { name: "Error", message: error };
    }
    try {
      return { name: typeof error, message: JSON.stringify(error) };
    } catch {
      try {
        return { name: typeof error, message: String(error) };
      } catch {
        return { name: typeof error, message: "[unrepresentable error]" };
      }
    }
  } finally {
    if (trackable) {
      // Pop the ancestor so a node shared between sibling branches (e.g., the same
      // Error instance referenced twice in `aggregated`) isn't reported as cyclic.
      state.ancestors.delete(error);
    }
  }
}

export function summarizeUnknownError(error: unknown): ErrorDetailForTelemetry {
  return summarizeUnknownErrorInner(error, 0, {
    ancestors: new Set<unknown>(),
    visitedCount: 0,
  });
}

export function reportUnexpectedErrorForWrappers(
  payload: UnexpectedErrorTelemetryPayload,
): void {
  try {
    reportUnexpectedError(payload);
  } catch (sinkError: unknown) {
    try {
      console.error(
        "[f2t.convex.unexpected] telemetry sink failed",
        sinkError,
        // Redacted view: mirrors the default-sink shape so a failing custom sink
        // does not accidentally surface raw args/stack via the fallback log.
        {
          functionName: payload.functionName,
          correlationId: payload.correlationId,
          userTokenIdentifier: payload.userTokenIdentifier,
          orgId: payload.orgId,
          orgKind: payload.orgKind,
          errorName: payload.errorDetail.name,
          errorMessage: payload.errorDetail.message,
        },
      );
    } catch {
      /* best-effort only */
    }
  }
}

/** Process-local counter so the deepest fallback path still produces distinct ids. */
let lastResortCorrelationCounter = 0;

function lastResortCorrelationId(): string {
  lastResortCorrelationCounter = (lastResortCorrelationCounter + 1) >>> 0;
  // RFC-4122-shaped: deterministic but unique per call so Sentry doesn't dedupe
  // unrelated incidents into one issue.
  const counter = lastResortCorrelationCounter.toString(16).padStart(12, "0");
  return `00000000-0000-4000-8000-${counter.slice(-12)}`;
}

function fallbackCorrelationId(): string {
  try {
    const bytes = new Uint8Array(16);
    if (typeof globalThis.crypto?.getRandomValues === "function") {
      globalThis.crypto.getRandomValues(bytes);
    } else {
      for (let i = 0; i < 16; i++) bytes[i] = Math.floor(Math.random() * 256);
    }
    bytes[6] = (bytes[6]! & 0x0f) | 0x40;
    bytes[8] = (bytes[8]! & 0x3f) | 0x80;
    const h = [...bytes]
      .map((b) => b.toString(16).padStart(2, "0"))
      .join("");
    return `${h.slice(0, 8)}-${h.slice(8, 12)}-${h.slice(12, 16)}-${h.slice(16, 20)}-${h.slice(20)}`;
  } catch {
    return lastResortCorrelationId();
  }
}

function newCorrelationId(): string {
  const c = globalThis.crypto;
  if (c !== undefined && typeof c.randomUUID === "function") {
    try {
      return c.randomUUID();
    } catch {
      /* fall through */
    }
  }
  return fallbackCorrelationId();
}

export function createUnexpectedErrorCorrelationId(): string {
  return newCorrelationId();
}

/** Keys that would mutate the prototype chain when spread into the payload object. */
const FORBIDDEN_DATA_KEYS = new Set(["__proto__", "constructor", "prototype"]);

/**
 * Builds an `AppConvexErrorPayload` and throws it as a `ConvexError`. Returns `never` so
 * callers can rely on control-flow narrowing, but call sites should still prefix with
 * `throw appError(...)` so the contract holds even if this implementation changes.
 *
 * `data` is shallow-cleaned: `undefined` values are stripped (not a Convex `Value`) and
 * prototype-mutating keys are dropped. `data` is intentionally shallow — nested
 * `undefined` values would still fail Convex serialization, so callers should keep
 * `data` flat (or pre-clean it themselves).
 */
export function appError(
  code: AppErrorCode,
  userMessage: string,
  data?: Record<string, Value | undefined>,
): never {
  const cleanedData: Record<string, Value> = Object.create(null) as Record<
    string,
    Value
  >;
  if (data !== undefined) {
    for (const [k, v] of Object.entries(data)) {
      if (v === undefined) continue;
      if (FORBIDDEN_DATA_KEYS.has(k)) continue;
      cleanedData[k] = v;
    }
  }
  const payload = {
    kind: "app" as const,
    code,
    userMessage,
    ...cleanedData,
  } as AppConvexErrorPayload;
  throw new ConvexError(payload as never);
}

function isAppShape(value: unknown): value is AppConvexErrorPayload {
  return (
    typeof value === "object" &&
    value !== null &&
    (value as { kind?: unknown }).kind === "app" &&
    typeof (value as { code?: unknown }).code === "string" &&
    typeof (value as { userMessage?: unknown }).userMessage === "string"
  );
}

export function readAppErrorPayload(
  error: unknown,
): AppConvexErrorPayload | undefined {
  if (!(error instanceof ConvexError)) return undefined;
  const d = error.data;
  if (typeof d === "string") {
    try {
      const parsed = JSON.parse(d) as unknown;
      return isAppShape(parsed) ? parsed : undefined;
    } catch {
      return undefined;
    }
  }
  return isAppShape(d) ? d : undefined;
}

export function isAppConvexError(
  error: unknown,
): error is ConvexError<AppConvexErrorPayload> {
  return readAppErrorPayload(error) !== undefined;
}
