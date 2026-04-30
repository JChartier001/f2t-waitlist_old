# Story 1.2 — Manual setup steps

This story (Convex backend foundation: auth wrappers + error helper + Clerk bridge) does not produce a user-visible feature. Most verification is automated tests. To finish the story locally you need to provision a Convex deployment and a Clerk application, configure their environment variables, and confirm the three Next.js apps boot through the new `AppProviders` without throwing.

The instructions below are the minimum to **stand up a working dev tier**. Production / qa tier provisioning is owned by Stories 1.13 (CI/CD) and 1.16 (deployment runbooks); don't try to do it here.

---

## 1. Provision Convex (dev tier)

```bash
cd packages/backend
npx convex dev
```

First run will:

1. Prompt for login (browser opens).
2. Ask whether to create a new project — choose **Create a new project**, name it `farm2table-dev` (or whatever you want; the name only shows in the Convex dashboard).
3. Pick the team. If you don't have one, Convex creates a personal team.
4. Pick a deployment to use. Choose the dev deployment it just created.
5. Generate `_generated/` files and start a watcher.

When it finishes, two pieces of information matter:

- **Deployment URL** (something like `https://abandoned-rabbit-123.convex.cloud`) — printed in the terminal and in the Convex dashboard under **Settings → URL & Deploy Key**. You will paste this into `NEXT_PUBLIC_CONVEX_URL` for all three apps.
- **Convex env editor** — you'll set `CLERK_JWT_ISSUER_DOMAIN` and `CLERK_PLATFORM_ORG_ID` here in step 4, not in the apps' `.env.local`. Either via the dashboard (**Settings → Environment Variables**) or with `npx convex env set <KEY> <VALUE>`.

Leave `npx convex dev` running in this terminal — it watches `convex/` and re-deploys functions on save.

> **Note:** the schema is currently `defineSchema({})` with no tables. The first time real domain tables land (Story 1.3+), `npx convex dev` will refuse to push if existing data conflicts. For now there is no data, so this is uneventful.

---

## 2. Provision Clerk (development instance)

Go to <https://dashboard.clerk.com/>, create a new application:

1. **Create application** → name it `farm2table-dev`.
2. Choose authentication methods (email + password is enough for now; you can enable Google / Apple later).
3. After creation, go to **API keys** and copy:
   - **Publishable key** (`pk_test_...`) → goes into `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY`.
   - **Secret key** (`sk_test_...`) → goes into `CLERK_SECRET_KEY`.

### 2a. Enable Organizations

Story 1.2's vendor and platform-admin paths require Clerk Organizations.

1. **Configure → Organization Settings → Enable organizations**. Turn it on.
2. Leave default org-creation settings; you'll create the platform-admin org by hand below.

### 2b. Create the platform-admin Organization

The platform-admin org is the deploy-wide singleton that backs `adminQuery` / `adminMutation` access.

1. **Organizations → Create organization**.
2. Slug: `platform` (or whatever; the slug isn't used by code).
3. After creation, copy the org's **ID** (looks like `org_2abc123...`). You will set this as `CLERK_PLATFORM_ORG_ID` in Convex's env.
4. Add yourself as a member of this org so you can later sign in as a platform admin.

### 2c. Create the JWT template named `convex`

Convex's `auth.config.ts` is hardcoded to `applicationID: "convex"`. Clerk needs a JWT template with that exact name.

1. **Configure → JWT templates → New template**.
2. Pick the **Convex** preset (Clerk has a built-in template for Convex).
3. Name it `convex` (this is the load-bearing string — must match `applicationID`).
4. **Save** and copy the **Issuer URL** (looks like `https://your-app-name.clerk.accounts.dev`). This is `CLERK_JWT_ISSUER_DOMAIN` for Convex's env.

### 2d. Customize the session token with f2t* claims

Auth wrappers read these claims off the JWT identity:

| Claim key | Source | Purpose |
|---|---|---|
| `f2tOrgId` | `{{org.id}}` | matched against `CLERK_PLATFORM_ORG_ID` for admin; resolves vendor org |
| `f2tOrgName` | `{{org.name}}` | display only |
| `f2tOrgRole` | `{{org.role}}` | vendor owner gate (`org:owner` or `owner`) |
| `f2tVendorOrgIsActive` | `{{org.public_metadata.is_active}}` | vendor active gate |

To wire them:

1. **Sessions → Customize session token → Edit**.
2. Add this JSON block to the **Session token** claims:

   ```json
   {
     "f2tOrgId": "{{org.id}}",
     "f2tOrgName": "{{org.name}}",
     "f2tOrgRole": "{{org.role}}",
     "f2tVendorOrgIsActive": "{{org.public_metadata.is_active}}"
   }
   ```

3. Save.

> **Why this matters now:** Story 1.5 will sync these claims into Convex tables. For Story 1.2, the wrappers read them straight from the JWT, so the template needs to be in place before any vendor or admin Convex function will pass auth.

### 2e. Mark the platform-admin org's "is_active" (optional but recommended)

Vendor active-flag uses `public_metadata.is_active`. The platform-admin org doesn't strictly need it (Story 1.2 documents why admin lacks the parity), but if you create vendor orgs later, set their public metadata to `{ "is_active": true }` via **Organization → Settings → Public metadata**.

---

## 3. Wire env files

Each Next.js app has its own `.env.local` (copy from `.env.example`). Some env goes in the apps; some goes in Convex's deployment env. Don't mix them up.

### 3a. App-level env (Next.js)

Create `apps/marketplace/.env.local`, `apps/admin/.env.local`, `apps/vendor/.env.local` — one for each. Minimum content for Story 1.2:

```bash
# packages/backend/.env.local OR each app's .env.local — see below
NEXT_PUBLIC_CONVEX_URL=https://abandoned-rabbit-123.convex.cloud
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_...
CLERK_SECRET_KEY=sk_test_...
```

The **publishable key** can be the same across all three apps (one Clerk app, three frontends). Same for the Convex URL — all three apps connect to the same Convex deployment.

`.env.local` is gitignored. Don't commit it.

### 3b. Convex-level env (server-side, set via Convex CLI or dashboard)

These are read by Convex functions at runtime, NOT by Next.js. They live in Convex's environment, not in the apps:

```bash
cd packages/backend

npx convex env set CLERK_JWT_ISSUER_DOMAIN https://your-app-name.clerk.accounts.dev
npx convex env set CLERK_PLATFORM_ORG_ID org_2abc123...
```

Or set them in the Convex dashboard at **Settings → Environment Variables**.

> **Why both places?** `CLERK_JWT_ISSUER_DOMAIN` is Convex-side (`auth.config.ts` reads it); `CLERK_PLATFORM_ORG_ID` is also Convex-side (`resolvePlatformAdminOrgId` reads it). The apps don't need them at all. The `.env.example` files list them in app-level env only because earlier stories had different boundaries; you can leave them blank in `.env.local` and the apps will still work.

### 3c. Other env vars in `.env.example`

You'll see Stripe, Resend, Sentry, etc. in the `.env.example` files. **None of these are needed for Story 1.2.** They become required as their owning stories land:

- Stripe: Stories 2.5, 5.4, 5.5
- Resend: Story 1.4
- Sentry: Story 1.12
- `INTERNAL_API_SECRET`: Story 1.4

Leave them empty for now. The apps will boot without them.

---

## 4. Run the tests

From the repo root:

```bash
# Backend (Convex helpers — auth wrappers, errors, claim resolution, etc.)
yarn workspace @workspace/backend test
yarn workspace @workspace/backend test --coverage     # 100% gate
yarn workspace @workspace/backend typecheck
yarn workspace @workspace/backend lint

# Web-shared (Convex+Clerk provider bridge)
yarn workspace @workspace/web-shared test
yarn workspace @workspace/web-shared test --coverage  # 100% gate (narrow include — see story)
yarn workspace @workspace/web-shared typecheck
yarn workspace @workspace/web-shared lint

# Or run every workspace at once via Turborepo (slower, more output)
yarn turbo run test typecheck lint
```

Expected: all green (`91 passed` backend, `15 passed` web-shared as of Story 1.2 close).

If a backend test fails with `Missing CLERK_JWT_ISSUER_DOMAIN`, your shell or `.env.test` is overriding the default that `vitest.setup.ts` provides. Either unset the override (`unset CLERK_JWT_ISSUER_DOMAIN` in your shell) or let the setup file's default apply.

---

## 5. Visual verification

Story 1.2 is **mostly backend** — auth wrappers, error helpers, telemetry, test infrastructure. The only user-visible artifact is the three Next.js apps booting through the new `AppProviders` (which mounts `ClerkProvider` + `ConvexClientProvider` + `ConvexProviderWithClerk`).

There is no UI to click through yet. Each app's `app/page.tsx` is still a placeholder ("Hello from marketplace" / "...admin" / "...vendor"). Real screens land in Stories 1.6–1.11.

### What you can verify visually

Boot each app (run in separate terminals; Convex dev must be running too):

```bash
yarn workspace @workspace/marketplace dev   # http://localhost:3000
yarn workspace @workspace/admin dev         # http://localhost:3001 or whatever next picks
yarn workspace @workspace/vendor dev        # http://localhost:3002
```

For each app:

1. **Page loads with no error overlay.** This proves both env validators ran cleanly:
   - `requireConvexUrl()` returned without throwing.
   - `requireClerkPublishableKey()` returned without throwing.
   - The Clerk + Convex providers mounted.
2. **Open DevTools → Console.** You should see:
   - No "NEXT_PUBLIC_CONVEX_URL is required" red error.
   - No "NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY is required" red error.
   - Possibly a Clerk dev banner — fine.
3. **Network tab → WS.** You should see one WebSocket connection to your Convex deployment URL (`wss://...convex.cloud`). It should connect, not loop on retry. This proves `ConvexProviderWithClerk` bridged Clerk → Convex auth state.

### Negative verification (optional)

To prove the env validators actually fail closed:

1. Temporarily empty `NEXT_PUBLIC_CONVEX_URL` in `apps/marketplace/.env.local`, restart the dev server.
2. Reload the page. Next.js should show an error overlay with `NEXT_PUBLIC_CONVEX_URL is required. Copy apps/*/.env.example...`.
3. Restore the value, restart, confirm the page loads again.

Repeat with `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY` for `app-providers`.

### What you can't verify yet (because it doesn't exist yet)

- No sign-in / sign-up screens (Story 1.9).
- No marketplace browse, vendor portal, or admin dashboard pages (Stories 1.6–1.11).
- No callable Convex functions besides the test fixtures (Story 1.3+ adds the first real domain functions).
- No real-time subscriptions to watch (Story 1.3 adds the domain event backbone).

If you want to confirm `useConvexAuth()` actually works against your live Clerk + Convex pair before Story 1.5 lands, you can drop a probe component into one of the apps — but that's optional and the test in `packages/web-shared/src/providers.test.tsx` already covers it programmatically.

---

## 6. Commit and move on

Once setup verifies:

1. Confirm `.env.local` files are gitignored (they are — root `.gitignore` covers `**/.env.local`).
2. Commit the Story 1.2 changes (the dev-story workflow normally creates a branch + commit; if it didn't, do it manually).
3. Story 1.3 (domain event backbone + audit log subscriber) is next in the sprint. Run `dev-story` against it when ready.

---

## Troubleshooting

| Symptom | Likely cause | Fix |
|---|---|---|
| App throws `NEXT_PUBLIC_CONVEX_URL is required` | env file missing or var empty | Set in `apps/<app>/.env.local`, restart dev server |
| App throws `must use https in production deployments` | `NODE_ENV=production` set locally with `http://` Convex URL | `unset NODE_ENV` or use `https://` URL |
| Convex function fails with `Missing CLERK_JWT_ISSUER_DOMAIN` | env not set in Convex tier | `npx convex env set CLERK_JWT_ISSUER_DOMAIN <issuer>` |
| Vendor flow always returns `auth.forbidden` | `f2tVendorOrgIsActive` claim missing/false | Set `{ "is_active": true }` in the vendor org's public metadata |
| Admin flow always returns `auth.forbidden` | `CLERK_PLATFORM_ORG_ID` mismatch with session's `f2tOrgId` | Confirm both via `npx convex env get` and the JWT template; signed-in user must be a member of that platform org |
| `useConvexAuth()` stays in loading forever | JWT template name isn't `convex` (case-sensitive) | Rename it in Clerk dashboard |
| Tests fail locally but pass in CI | shell `.env.local` overriding test defaults | `unset CLERK_PLATFORM_ORG_ID CLERK_JWT_ISSUER_DOMAIN`, re-run |
