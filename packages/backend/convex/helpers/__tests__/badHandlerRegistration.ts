/**
 * Side-effect module: invalid handler type triggers fail-fast registration error.
 * Imported only by auth.test.ts via dynamic import().
 */
import { internalPublicQuery } from "../auth";
import { v } from "convex/values";

internalPublicQuery({
  args: {},
  returns: v.null(),
  handler: 3 as unknown as () => Promise<null>,
});
