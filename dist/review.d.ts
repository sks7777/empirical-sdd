import type { BotReviewReadiness, CanonicalReviewResult, ContractAmendmentView, Criterion, DecisionSummary, ReviewConfig, ReviewPacket, ReviewReReview, ReviewSubmission } from "./types.js";
export declare const DEFAULT_REVIEWER_TOKEN_ENV = "EMPIRICAL_REVIEWER_TOKEN";
export interface ReviewRuntimeResult {
    argv: string[];
    cwd: string;
    timeoutMs: number;
    maxOutputBytes: number;
    environmentKeys: string[];
    exitCode: number | null;
    signal: string | null;
    timedOut: boolean;
    stdoutDigest: string;
    stderrDigest: string;
    stdoutTail: string;
    stderrTail: string;
    stdoutTruncated: boolean;
    stderrTruncated: boolean;
    startedAt: string;
    completedAt: string;
}
export interface ReviewCommandResult {
    result: ReviewRuntimeResult;
    stdout: string;
    stderr: string;
}
export type ReviewCommandRunner = (root: string, argv: string[], reviewerToken?: string) => Promise<ReviewCommandResult>;
export interface BotReviewReadinessOptions {
    root: string;
    config: ReviewConfig;
    repository?: string;
    authorLogin?: string;
    env?: Readonly<Record<string, string | undefined>>;
    runner?: ReviewCommandRunner;
}
export interface LocalReviewPacketOptions {
    root: string;
    config: ReviewConfig;
    baseRef: string;
    /** Read an exact historical head only after separately proving artifact-only ancestry. */
    headCommit?: string;
    /**
     * With `headCommit`: the base the review recorded. Under standard binding
     * the target may have advanced since; the reviewed diff (base...head) is
     * unchanged, so the packet is rebuilt against the recorded base.
     */
    baseCommit?: string;
    criteria: Criterion[];
    decisions?: DecisionSummary[];
    contractAmendments?: ContractAmendmentView[];
    /** The previous recorded review; used only when its head is an ancestor of HEAD on the same base. */
    reReview?: ReviewReReview;
    runner?: ReviewCommandRunner;
}
export interface RemoteReviewPacketOptions {
    config: ReviewConfig;
    baseRef: string;
    baseCommit: string;
    headCommit: string;
    diff: string;
    criteria: Criterion[];
    decisions?: DecisionSummary[];
}
export interface ReviewOperationDependencies {
    env?: Readonly<Record<string, string | undefined>>;
    runner?: ReviewCommandRunner;
}
export interface BotReviewCommandOptions extends ReviewOperationDependencies {
    root: string;
    config: ReviewConfig;
    argv: string[];
}
export interface GitHubLatestReview {
    author: string | {
        login?: unknown;
    } | null;
    state: string;
    submittedAt?: string | null;
    body?: string | null;
    commit?: {
        oid?: unknown;
    } | string | null;
}
export interface GitHubReviewGateInput {
    reviewDecision: string | null | undefined;
    latestReviews: GitHubLatestReview[];
    authorLogin: string;
}
export declare function githubCliConfigurationEnvironment(options?: {
    env?: Record<string, string | undefined>;
    platform?: string;
    home?: string;
}): {
    GH_CONFIG_DIR: string;
};
export declare function redactCapturedReviewResult(captured: ReviewCommandResult, secret: string): ReviewCommandResult;
export declare function isReviewerTokenEnvironmentName(value: string): boolean;
export declare function assertReviewConfig(config: ReviewConfig): void;
export declare function reviewSetupGuidance(config: ReviewConfig, options?: {
    fallbackSelected?: boolean;
}): string;
export declare function reviewPacketInstructions(config: ReviewConfig): string;
export declare function checkBotReviewReadiness(options: BotReviewReadinessOptions): Promise<BotReviewReadiness>;
export declare function executeBotReviewCommand(options: BotReviewCommandOptions): Promise<ReviewCommandResult>;
export declare function createLocalReviewPacket(options: LocalReviewPacketOptions): Promise<ReviewPacket>;
export declare function assertReviewArtifactCommits(root: string, feature: string, reviewedHead: string): Promise<void>;
/**
 * Standard binding: a review stays valid while the source it reviewed is
 * unchanged. A change since the reviewed commit reopens it only when it
 * touches reviewed source or an authored input. These never reopen it:
 * generated Empirical records, and files a target-branch merge brought in
 * that this feature never touched. Strict binding uses
 * `assertReviewArtifactCommits` instead.
 */
export declare function assertReviewedSourceUnchanged(root: string, feature: string, reviewedHead: string, targetRef: string | null): Promise<void>;
/**
 * Empirical paths whose commit never reopens a review: generated records.
 * The feature's authored files (spec, design, decisions, plan) are reviewed
 * inputs, because the packet is rebuilt at the reviewed commit and would not
 * see a later edit. Project config, policy and capability specs stay reviewed
 * inputs too.
 */
export declare function generatedEmpiricalRecord(path: string): boolean;
export declare function createRemoteReviewPacket(options: RemoteReviewPacketOptions): ReviewPacket;
/**
 * Rejects a malformed review submission before any field is dereferenced, so a
 * wrapped or partial payload is an argument error rather than a runtime crash.
 */
export declare function assertReviewSubmissionShape(value: unknown): asserts value is ReviewSubmission;
export declare function renderCanonicalReview(packet: ReviewPacket, submission: ReviewSubmission): string;
export declare function validateCanonicalReviewBody(packet: ReviewPacket, body: string, options?: {
    blockingFindings?: boolean;
}): void;
export declare function createCanonicalReviewResult(packet: ReviewPacket, submission: ReviewSubmission, reviewerLogin: string | null): CanonicalReviewResult;
export declare function verifyCanonicalReviewResult(packet: ReviewPacket, result: CanonicalReviewResult): void;
export declare function githubReviewApprovalPasses(input: GitHubReviewGateInput): boolean;
