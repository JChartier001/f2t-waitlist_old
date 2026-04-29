import baseConfig from "./base.js";

/**
 * Next.js ESLint preset. For Story 1.1 this is just the base config — Story 1.15
 * adds the Next.js / React rules (eslint-config-next, react-hooks, jsx-a11y) once
 * the flat-config + FlatCompat ergonomics for `eslint-config-next` settle.
 *
 * The dependency-graph rule from `base.js` is still enforced here (load-bearing
 * for AC #5 of Story 1.1), so app-to-app and app-to-backend boundaries are gated.
 */
const nextjsConfig = baseConfig;

export default nextjsConfig;
