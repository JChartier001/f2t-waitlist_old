/**
 * Side-effect module: shorthand spec with `args: null` triggers fail-fast registration.
 * Imported only by auth.test.ts via dynamic import().
 */
import { internalPublicQuery } from "../auth";

internalPublicQuery(
  // eslint-disable-next-line @typescript-eslint/no-explicit-any -- Why: deliberately bad shape to prove runtime guard fires
  Object.assign(async () => null, { args: null as any }) as () => Promise<null>,
);
