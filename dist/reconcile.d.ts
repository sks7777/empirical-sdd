/**
 * Reconcile: find unfinished features whose work already merged on the forge
 * and plan their closure as merged-externally.
 *
 * Planning is read-only. It reads Git and asks the forge which merged pull
 * request carried each feature's specification, then reuses forced closure's
 * proof (`observeExternalMerge`), so reconcile trusts exactly what an explicit
 * `feature-close --outcome merged-externally` would. It never selects, fetches,
 * merges, pushes or writes a receipt.
 */
import { type ClosureObserver } from "./closure.js";
import type { CapabilityClaim } from "./coordination.js";
import type { ReconcileCandidate, ReconcilePlan, WorkflowState } from "./types.js";
/**
 * Whether reconcile could ever close a feature in this phase and status: not
 * finished, and at Implement or later. Status and overview flag only these, so
 * the hint never names work reconcile will refuse.
 */
export declare function reconcilable(phase: unknown, status: unknown): boolean;
/**
 * The ref merges are checked against: the remote-tracking branch when present,
 * because review and merge happen on the forge, else the local branch.
 */
export declare function resolveTargetRef(root: string, targetBranch: string): {
    ref: string;
    commit: string;
};
/**
 * The branches finished work merges into, in the order merges are proven:
 * the isolation base first (feature pull requests target it), then the
 * delivery target (releases, and repositories that merge features straight
 * into it). Checking only the delivery target left every feature merged into
 * a `develop` base open forever (SDD-161).
 */
export declare function configuredTargetBranches(root: string): Promise<string[]>;
/** The first target branch that exists here, for hints that need just one. */
export declare function configuredTargetBranch(root: string): Promise<string>;
/**
 * Offline hint: unfinished features whose `state.json` in this checkout is
 * byte-identical to the target's copy, so the feature merged in that state
 * and never advanced. Two Git calls in total, no forge. Reconcile re-proves
 * each one before closing anything.
 */
export declare function mergedNotClosed(root: string, targetBranches: string | readonly string[], unfinished: readonly string[]): Set<string>;
/**
 * Whether this checkout's `state.json` for the feature is byte-identical to
 * the copy the target holds: the feature merged in this state and did not
 * advance here afterwards, so the merge covers all of its recorded work.
 */
export declare function stateMatchesTarget(root: string, targetCommit: string, feature: string): boolean;
/** The last non-merge commit on the target that changed the feature's specification. */
export declare function lastSpecCommit(root: string, targetCommit: string, feature: string): string | null;
/**
 * The commit on the target's first-parent line that brought `commit` in: the
 * merge of the outermost pull request when feature pull requests were stacked
 * (#120 into a feature branch, that branch into `develop`). The forge links a
 * stacked commit only to the inner pull request, whose base is not the target.
 */
export declare function introducingCommit(root: string, commit: string, targetCommit: string): string | null;
export interface ReconcileFeatureState {
    feature: string;
    state: WorkflowState;
}
export interface ReconcileClaims {
    /** This checkout's worktree identity. */
    worktreeId: string;
    /** Claims whose worktree is still registered. */
    active: CapabilityClaim[];
    /** Claims whose worktree is gone; cleanup owns them. */
    stale: CapabilityClaim[];
}
export interface BuildReconcilePlanInput {
    root: string;
    /** The primary target: the plan reports it and binds its commit. */
    targetBranch: string;
    /**
     * Every branch a merge may be proven on, in order; defaults to
     * `[targetBranch]`. A branch missing here is skipped.
     */
    targetBranches?: string[];
    exclude: string[];
    features: ReconcileFeatureState[];
    /** Specs whose state could not be read; reported, never closed. */
    unreadable?: Array<{
        feature: string;
        reason: string;
    }>;
    /** Features selected by another live checkout. */
    claimedElsewhere: ReadonlySet<string>;
    claims: ReconcileClaims;
    observer?: ClosureObserver;
    now?: Date;
    /**
     * Require the checkout's state to equal the merged copy. Standard binding
     * sets false: a merged pull request closes the feature even when this
     * checkout recorded more workflow events afterwards, and the closure keeps
     * the feature's honest completion level.
     */
    requireStateMatch?: boolean;
}
/** Plan which unfinished features reconcile would close. Read-only. */
export declare function buildReconcilePlan(input: BuildReconcilePlanInput): ReconcilePlan;
/**
 * Binds an approval to the decision facts only. Observation timestamps and
 * prose are left out so an unchanged repository previews to the same digest.
 */
export declare function reconcileDigest(targetCommit: string, targetBranch: string, exclude: string[], candidates: ReconcileCandidate[]): string;
