import rateLimiter from "@convex-dev/rate-limiter/convex.config";
import { defineApp } from "convex/server";

const app = defineApp();
app.use(rateLimiter);

// `@convex-dev/rate-limiter` is registered for later wrapper integration.
// Per the post-validation Resend revision, `@convex-dev/resend` is NOT registered —
// Resend lives in Next.js (`apps/marketplace/app/api/emails/send/route.ts`).

export default app;
