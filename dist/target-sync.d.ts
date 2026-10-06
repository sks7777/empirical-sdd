import type { ProjectConfig, StalenessConfig, TargetFreshness, TargetSyncInput, TargetSyncResult } from "./types.js";
/** Default commit count past which a branch without predicted conflicts is reported stale. */
export declare const DEFAULT_MAX_BEHIND = 10;
/** The configured target branch, or the detected base when configured as auto; null when unknown. */
export declare function configuredTarget(root: string, config: Pick<ProjectConfig, "isolation"> | null): string | null;
/** Effective staleness settings; absent configuration keeps the defaults. */
export declare function stalenessSettings(config: Pick<ProjectConfig, "staleness"> | null): Required<StalenessConfig>;
/**
 * Read-only freshness of the current checkout against its target, from local
 * refs only: it never fetches and never touches the index or worktree. A local
 * target with an upstream is compared against that remote-tracking ref, which is
 * what an explicit fetch refreshes. Returns null outside a usable Git branch.
 */
export declare function assessTargetFreshness(root: string, target: string): TargetFreshness | null;
/** Conflicting paths from an in-memory merge; null when this Git cannot predict them. */
export declare function predictConflicts(root: string, ref: string): string[] | null;
/** The roadmap line for a stale branch, or null when current enough or disabled. */
export declare function stalenessNotice(freshness: TargetFreshness | null, settings: Required<StalenessConfig>): string | null;
/**
 * Explicitly brings the current feature branch up to date with its target: an
 * optional fetch, then a merge (never a rebase, reset or force) only when the
 * worktree is clean and no conflict is predicted. Refusals change nothing.
 * Nothing is pushed.
 */
export declare function syncTarget(root: string, input?: TargetSyncInput): Promise<TargetSyncResult>;
