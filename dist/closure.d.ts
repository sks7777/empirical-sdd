/**
 * Forced closure: the recorded way out of a feature that cannot satisfy its
 * next gate.
 *
 * Closure is an *authorization*, not a suppression. It never fabricates a
 * receipt, never raises a completion level, and never merges, pushes or
 * publishes. This module deliberately imports no receipt-creation symbol so
 * that guarantee is structural rather than a convention.
 */
import { type ClosureOutcome, type ExternalMergeFacts, type FeatureClosure, type Phase } from "./protocol.js";
import type { FeatureClosePlan, WorkflowState } from "./types.js";
/** Observed pull request facts, exactly as the host forge reports them. */
export interface ObservedPullRequest {
    number: number;
    url: string;
    state: "OPEN" | "MERGED" | "CLOSED";
    mergeCommit: string | null;
    /** The pull request's head branch, when the forge reports it. */
    headRefName?: string | null;
    /** Paths the pull request changed, when the forge reports them. */
    files?: string[];
}
/** The merged pull request that contains a commit, as the forge associates them. */
export type MergedPullRequestLookup = {
    status: "found";
    number: number;
    mergeCommit: string;
} | {
    status: "none";
} | {
    status: "unavailable";
    detail: string;
};
/**
 * Read-only host observations. Injected so closure stays testable without a
 * network and so the set of commands it can run is visible in one place.
 */
export interface ClosureObserver {
    /** `gh pr view <number>`; null when the pull request cannot be read. */
    viewPullRequest(root: string, pullRequest: number): ObservedPullRequest | null;
    /** `git merge-base --is-ancestor <commit> <ref>`. */
    isAncestor(root: string, commit: string, ref: string): boolean;
    /** The checked-out branch name, or null when detached or unreadable. */
    currentBranch?(root: string): string | null;
    /**
     * Whether the merge commit's own change (against its first parent) touched a
     * path under the prefix; null when the commit is not available locally.
     */
    mergeChangedPath?(root: string, mergeCommit: string, prefix: string): boolean | null;
    /** The latest merged pull request into `base` that contains the commit. */
    findMergedPullRequest?(root: string, commit: string, base: string): MergedPullRequestLookup;
}
/** The default observer. It reads; it never mutates the repository or the forge. */
export declare const hostObserver: ClosureObserver;
/**
 * The single phase a forced advance may enter, or a refusal naming the
 * operation that owns the phase instead.
 */
export declare function nextForcedPhase(state: Pick<WorkflowState, "profile" | "reviewFirst" | "phase">): Phase;
export interface ClosurePlanInput {
    mode: "feature" | "phase";
    outcome: ClosureOutcome;
    reason: string;
    actor: string;
    pullRequest?: number;
    targetBranch: string;
    /** The ref ancestry is checked against; defaults to the target branch. */
    targetRef?: string;
}
/**
 * Build the exact plan a forced closure would apply. Read-only: for
 * `merged-externally` it observes the forge and the Git graph and refuses
 * unless the merge is provable.
 */
export declare function buildClosurePlan(root: string, state: WorkflowState, input: ClosurePlanInput, observer?: ClosureObserver, now?: Date): FeatureClosePlan;
export declare function observeExternalMerge(root: string, feature: string, input: Pick<ClosurePlanInput, "pullRequest" | "targetBranch" | "targetRef">, observer: ClosureObserver, now: Date, 
/**
 * Reconcile runs from an arbitrary checkout, so the current branch and the
 * forge's truncated file list prove nothing there: only the merge commit's
 * own diff may establish ownership.
 */
requireMergeDiff?: boolean): ExternalMergeFacts;
/** The immutable closure record a terminal close persists. */
export declare function closureRecord(plan: FeatureClosePlan, actor: string, confirmation: FeatureClosure["confirmation"], now?: Date): FeatureClosure;
/**
 * The next state a closure produces. Completion facts are carried through
 * unchanged and re-derived, then asserted to be the same rank they were, so a
 * closure can never inflate what the feature proved. The one exception is an
 * observed merge closing a verified feature that waits on it in Integrate:
 * under standard binding that merge is the integration.
 */
export declare function applyClosure(state: WorkflowState, plan: FeatureClosePlan, closure: FeatureClosure | null, now: Date): WorkflowState;
