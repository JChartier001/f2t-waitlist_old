import { defineApp } from "convex/server";

const app = defineApp();

// Story 1.2 will register `@convex-dev/rate-limiter` here.
// Per the post-validation Resend revision, `@convex-dev/resend` is NOT registered —
// Resend lives in Next.js (`apps/marketplace/app/api/emails/send/route.ts`).

export default app;
