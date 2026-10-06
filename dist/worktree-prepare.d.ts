import { type WorktreePrepareInput, type WorktreePreparePreview, type WorktreePrepareResult } from "./types.js";
export type WorktreePrepareInvalidReason = "not-a-repository" | "missing" | "unregistered" | "bare" | "not-worktree-root" | "different-repository" | "same-as-source";
/**
 * Previews or applies local environment file copies for a registered worktree
 * of the same repository. Configuration comes from the source; no workflow
 * state, selection, journal event, receipt or tracker effect is created.
 */
export declare function prepareWorktree(root: string, input?: WorktreePrepareInput): Promise<WorktreePreparePreview | WorktreePrepareResult>;
