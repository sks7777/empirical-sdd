import type { JournalEvent } from "./journal.js";
import { type QaReceipt, type RemoteChecksReceipt } from "./protocol.js";
import type { ProjectPolicy, PromotionRoute, RemoteProofReason, WorkflowState } from "./types.js";
/**
 * A github.com repository identity. Declared here, not in delivery, so the
 * public declaration graph never reaches Node-typed delivery internals.
 */
export interface GitHubRepository {
    owner: string;
    repo: string;
}
/** One verified journal element: the compacted snapshot state or an event. */
export interface JournalStateEntry {
    type: JournalEvent["type"] | "snapshot";
    summary: string;
    state: WorkflowState;
}
/**
 * Structural classification of the one transition carry-over admits: the
 * Integrate completion that recorded `receiptId`. Actors and summaries are
 * caller-supplied, so only verified consecutive states decide.
 */
export declare function isIntegrateCompletion(before: WorkflowState, after: WorkflowState, receiptId: string): boolean;
/**
 * The receipt id the journal head's Integrate completion added, and the
 * revision it was recorded at. Any other head is named as the mismatch.
 */
export declare function integrateCompletionCandidate(entries: readonly JournalStateEntry[]): {
    accepted: true;
    receiptId: string;
    receiptRevision: number;
} | {
    accepted: false;
    mismatch: string;
};
/**
 * Deliver may reuse only the full-CI receipt Integrate recorded, when the
 * journal head is exactly that Integrate completion and matches the current
 * projection. Source, spec, policy and runtime identities are checked by the
 * caller; the receipt is never rewritten.
 */
export declare function integrateReceiptCarryOver(input: {
    receipt: QaReceipt;
    states: readonly JournalStateEntry[];
    current: WorkflowState;
}): {
    accepted: true;
} | {
    accepted: false;
    mismatch: string;
};
/** The GitHub App id of GitHub Actions; its check runs group by workflow run attempt. */
export declare const GITHUB_ACTIONS_APP_ID = 15368;
export interface RequiredCheckRequirement {
    context: string;
    /** null means unpinned: legacy contexts[], app_id null or -1, or a ruleset entry without integration_id. */
    appId: number | null;
    source: "branch-protection" | "ruleset";
}
/** A check run as GitHub reports it; commit statuses are never read. */
export interface ObservedCheckRun {
    name: string;
    appId: number;
    appSlug: string;
    checkSuiteId: string;
    runId: string;
    headSha: string;
    status: "queued" | "in_progress" | "waiting" | "requested" | "pending" | "completed";
    conclusion: string | null;
}
/** A GitHub Actions workflow run attempt and the check suite it owns. */
export interface ObservedWorkflowRun {
    workflowRunId: string;
    runAttempt: number;
    checkSuiteId: string;
    workflowPath: string;
    headSha: string;
    /** Check run ids of this attempt's jobs (from each job's `check_run_url`). */
    checkRunIds: string[];
}
export type ReaderFailure = {
    code: "REMOTE_READER_ERROR";
    httpStatus: number | null;
    endpointTemplate: string;
};
export type RequiredChecksRead = {
    readable: true;
    requirements: RequiredCheckRequirement[];
} | {
    readable: false;
    failure: ReaderFailure;
};
export interface GitHubChecksReader {
    branchHead(repository: GitHubRepository, branch: string): Promise<string | null | ReaderFailure>;
    requiredChecks(repository: GitHubRepository, branch: string): Promise<RequiredChecksRead>;
    checkRunsForCommit(repository: GitHubRepository, sha: string): Promise<ObservedCheckRun[] | ReaderFailure>;
    workflowRunsForCommit(repository: GitHubRepository, sha: string): Promise<ObservedWorkflowRun[] | ReaderFailure>;
}
export interface PromotionProofDependencies {
    githubChecksReader?: GitHubChecksReader;
}
export declare function isReaderFailure(value: unknown): value is ReaderFailure;
export declare function remoteReasonsTerminal(reasons: readonly RemoteProofReason[]): boolean;
export interface RemoteCheckRecord {
    name: string;
    appId: number;
    appSlug: string;
    checkSuiteId: string;
    runId: string;
    headSha: string;
    workflowRunId: string | null;
    runAttempt: number | null;
    status: "completed";
    conclusion: "success";
}
export interface RequiredSetRecord {
    requirements: Array<{
        context: string;
        appId: number;
        source: RequiredCheckRequirement["source"];
    }>;
}
/**
 * Pure evaluation of policy-required checks for one exact head. Each policy
 * name must be required by the target with one concrete app pin; only that
 * app's check runs count, and the latest attempt of every execution unit that
 * emits the name must have succeeded. Under the GitHub Actions pin each check
 * run must be a job of a listed workflow run attempt, and every run of the name
 * in that attempt must succeed. Ordering never compares across units.
 */
export declare function evaluateRemoteChecks(input: {
    policyRequired: readonly string[];
    required: RequiredChecksRead;
    headSha: string;
    runs: ObservedCheckRun[] | ReaderFailure;
    workflowRuns: ObservedWorkflowRun[] | ReaderFailure;
}): {
    passed: true;
    records: RemoteCheckRecord[];
    requiredSet: RequiredSetRecord;
} | {
    passed: false;
    reasons: RemoteProofReason[];
};
/**
 * Backstop only: the strict receipt schema and explicit field copying are the
 * control. Commit id fields are exempt from the 40-hex token pattern, and
 * attacker-chosen check names can only deny proof.
 */
export declare function remoteReceiptCredentialFindings(receipt: RemoteChecksReceipt): string[];
export declare function createRemoteChecksReceipt(input: {
    criteria: string[];
    provenance: RemoteChecksReceipt["provenance"];
    githubRepository: GitHubRepository;
    gate: RemoteChecksReceipt["gate"];
    matrixDigest: string;
    fullCi: RemoteChecksReceipt["fullCi"];
    targetBranch: string;
    targetBranchSource: RemoteChecksReceipt["targetBranchSource"];
    targetBaseCommit: string;
    mergeBaseCommit: string;
    records: RemoteCheckRecord[];
    requiredSet: RequiredSetRecord;
    now?: () => Date;
}): RemoteChecksReceipt;
export type RemoteProofTarget = {
    gate: "deliver";
    authorizationTargetBranch: string | null;
} | {
    gate: "integrate";
    targetRoot: string;
    /** The standing authorization target, when the feature has one. */
    authorizationTargetBranch: string | null;
    /** The approved comparison base from the capability claim, when one exists. */
    claimBaseCommit: string | null;
};
export type RemoteProofEligibility = {
    eligible: true;
    targetBranch: string;
    targetBranchSource: RemoteChecksReceipt["targetBranchSource"];
    targetHead: string;
    mergeBase: string;
} | {
    eligible: false;
    reasons: RemoteProofReason[];
};
export type EligibilityGit = (cwd: string, args: string[]) => {
    status: number | null;
    stdout: string;
};
/** The GitHub delivery target branch the strict committed policy at `commit` names, or null. */
export declare function policyTargetBranchAt(root: string, commit: string, git?: EligibilityGit): string | null;
/**
 * Whether policy lets remote required checks stand in for full CI at all: a
 * non-local mode, GitHub delivery pinning at least one required check, and a
 * configured full-CI command. `remote-checks` parsing already guarantees the rest.
 */
export declare function remoteChecksConfigured(policy: ProjectPolicy): boolean;
/**
 * Whether remote required checks may stand in for local full CI. The target
 * branch comes from a source the candidate cannot edit, and any change to the
 * configuration CI trusts, or a mutable workflow reference, requires local proof.
 */
export declare function remoteProofEligibility(input: {
    root: string;
    policy: ProjectPolicy;
    reader: GitHubChecksReader;
    repository: GitHubRepository;
    target: RemoteProofTarget;
    git?: EligibilityGit;
}): Promise<RemoteProofEligibility>;
/**
 * Whether a recorded Deliver proof binding still stands. Proof was eligible when
 * it was recorded, but the target can change afterwards: its committed policy
 * must still allow remote proof and equal the candidate's, neither head may carry
 * a mutable workflow reference, and the target's required set must still pin the
 * policy names exactly as the receipt recorded. A target that already contains the
 * candidate (after the source merge) is accepted here, unlike first eligibility.
 */
export declare function recordedRemoteProofEligibility(input: {
    root: string;
    policy: ProjectPolicy;
    reader: GitHubChecksReader;
    repository: GitHubRepository;
    authorizationTargetBranch: string | null;
    receipt: RemoteChecksReceipt;
    git?: EligibilityGit;
}): Promise<{
    eligible: true;
} | {
    eligible: false;
    reasons: RemoteProofReason[];
}>;
/**
 * The static promotion route for the current candidate, from committed policy
 * and local Git only (no network). `auto` selects `ci` only when remote proof is
 * configured and no SDD-67 local-forcing reason applies against the last-fetched
 * `origin/<targetBranch>`; every failing condition is listed. An explicit `local`
 * is honored, and `remote-checks` reports its reasons but never falls back.
 * Deliver still re-checks eligibility with GitHub reads before any merge.
 */
export declare function promotionRoute(input: {
    root: string;
    policy: ProjectPolicy;
    targetBranch: string | null;
    git?: EligibilityGit;
}): PromotionRoute;
