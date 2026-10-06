import { type StandingAuthorization } from "./protocol.js";
import { type CapturedRuntimeResult, type ProcessAdapter } from "./runtime.js";
import { type GitHubLatestReview, type ReviewOperationDependencies } from "./review.js";
import type { BotReviewReadiness, CanonicalReviewResult, Criterion, DecisionSummary, RemoteProofReason, ReviewConfig, ReviewPacket, ReviewSubmission } from "./types.js";
import type { GitHubChecksReader, GitHubRepository } from "./promotion-proof.js";
export interface CommitPlan {
    branch: string;
    paths: string[];
    message: string;
    title: string;
    body: string;
}
export interface PullRequestFact {
    number: number;
    url: string;
    state: "OPEN" | "MERGED" | "CLOSED";
    mergeCommit: string | null;
}
export interface GitHubDeliveryReceipt {
    schemaVersion: 1;
    repositoryId: string;
    feature: string;
    targetBranch: string;
    source: PullRequestFact & {
        commit: string;
    };
    evidence: PullRequestFact & {
        commit: string;
    };
    requiredChecks: string[];
    commandReceiptDigests: string[];
    /** Present only when remote required-check proof satisfied the source promotion gate. */
    promotionProof?: RecordedPromotionProof;
    deliveredAt: string;
    digest: string;
}
export interface RecordedPromotionProof {
    kind: "remote-checks";
    receiptId: string;
    receiptDigest: string;
    githubRepository: string;
}
export type PromotionProofPoll = {
    passed: true;
    receiptId: string;
    receiptDigest: string;
    githubRepository: string;
} | {
    passed: false;
    terminal: boolean;
    reasons: RemoteProofReason[];
};
export type DeliveryRunner = (root: string, argv: string[]) => Promise<CapturedRuntimeResult>;
export interface DeliveryOptions {
    root: string;
    repositoryId: string;
    feature: string;
    authorization: StandingAuthorization;
    targetBranch: string;
    requiredChecks: string[];
    source: CommitPlan;
    evidence: CommitPlan;
    prepareEvidence: (mergedSourceCommit: string) => Promise<void>;
    runner?: DeliveryRunner;
    processAdapter?: ProcessAdapter;
    now?: () => Date;
    delay?: (milliseconds: number) => Promise<void>;
    checkAttempts?: number;
    reviewConfig?: ReviewConfig;
    reviewSubmission?: ReviewSubmission;
    reviewCriteria?: Criterion[];
    reviewDecisions?: DecisionSummary[];
    reviewDependencies?: ReviewOperationDependencies;
    priorCommandReceiptDigests?: string[];
    /**
     * The commit the promotion proof binds. The source pull request head must
     * match it apart from this feature's specification files and integrated
     * capability projections before checks, review, ready or merge.
     */
    proofCommit?: string;
    /** Integrated capability projection digests allowed to differ from the proof commit. */
    proofCapabilityDigests?: Record<string, string>;
    /** Remote-checks proof for the pushed source head; polled before review, ready and merge. */
    promotionProof?: (input: {
        headCommit: string;
        pullRequest: PullRequestFact;
    }) => Promise<PromotionProofPoll>;
    /** A previously recorded, fully validated proof binding for this head, or null. */
    promotionProofRecorded?: (headCommit: string) => Promise<Omit<RecordedPromotionProof, "kind"> | null>;
    /**
     * Revalidate mutable workflow gates immediately before an owned pull request
     * becomes ready. Delivery creation remains draft until this succeeds.
     */
    assertReadyForReview: () => Promise<void>;
}
export interface ReviewablePullRequestFact extends PullRequestFact {
    headCommit: string;
    baseCommit: string;
    isDraft: boolean;
    authorLogin: string;
    reviewDecision: string | null;
    latestReviews: GitHubLatestReview[];
    comments: Array<{
        author: string;
        body: string;
    }>;
}
export interface GitHubReviewSetupRequired {
    kind: "review_setup_required";
    stage: "source" | "evidence";
    readiness: Extract<BotReviewReadiness, {
        wired: false;
    }>;
    commandReceiptDigests: string[];
    pullRequest?: ReviewablePullRequestFact;
}
export interface GitHubReviewRequired {
    kind: "review_required";
    stage: "source" | "evidence";
    pullRequest: ReviewablePullRequestFact;
    packet: ReviewPacket;
    commandReceiptDigests: string[];
}
export interface GitHubChangesRequested {
    kind: "changes_requested";
    stage: "source" | "evidence";
    pullRequest: ReviewablePullRequestFact;
    review: CanonicalReviewResult;
    commandReceiptDigests: string[];
}
/** The source pull request is open, but remote proof has not passed; nothing was reviewed, readied or merged. */
export interface GitHubPromotionProofRequired {
    kind: "promotion_proof_required";
    stage: "source";
    pullRequest: PullRequestFact & {
        headCommit: string;
        isDraft: boolean;
    };
    reasons: RemoteProofReason[];
    commandReceiptDigests: string[];
}
export type GitHubDeliveryResult = GitHubDeliveryReceipt | GitHubReviewSetupRequired | GitHubReviewRequired | GitHubChangesRequested | GitHubPromotionProofRequired;
export declare function assertSafeDeliveryArgv(argv: readonly string[]): void;
export declare function githubCliConfigurationEnvironment(options?: {
    env?: NodeJS.ProcessEnv;
    platform?: NodeJS.Platform;
    home?: string;
}): {
    GH_CONFIG_DIR: string;
};
export declare function githubAuthenticationEnvironment(argv: readonly string[], options?: {
    env?: NodeJS.ProcessEnv;
    platform?: NodeJS.Platform;
    home?: string;
}): Record<string, string>;
/**
 * Paths where the delivered source head differs from the proven commit beyond
 * this feature's specification files and integrated capability projections
 * whose content still has the integrated digest; null when none differ.
 */
export declare function deliveredHeadMismatch(root: string, proofCommit: string, headCommit: string, allowed: {
    feature: string;
    capabilityDigests: Record<string, string>;
}): string[] | null;
export type { GitHubRepository } from "./promotion-proof.js";
/** Accept only github.com HTTPS or SCP-style SSH remotes without embedded credentials. */
export declare function parseGitHubRemoteUrl(url: string): GitHubRepository | null;
/**
 * The repository delivery pushes to. Remote proof reads checks from this exact
 * origin, never from gh's mutable default-repository resolution.
 */
export declare function resolveGitHubRepository(root: string, runner?: DeliveryRunner): Promise<GitHubRepository>;
/**
 * The checks reader may run only these exact read-only shapes. Every other
 * flag (fields, headers, methods, hostnames, previews) and any unencoded,
 * placeholder or dot-segment path is refused before spawning.
 */
export declare function assertReaderArgv(argv: readonly string[]): void;
/** Encode each `/`-separated branch segment so `feature/x` stays a path and `#`, `%`, `{`, `}` cannot alter the request. */
export declare function encodeBranchPath(branch: string): string;
/** The reader's environment: gh configuration only, never a repository or host override. */
export declare function githubChecksReaderEnvironment(argv: readonly string[], options?: {
    env?: NodeJS.ProcessEnv;
    platform?: NodeJS.Platform;
    home?: string;
}): Record<string, string>;
/** Split `gh api --paginate` output, which concatenates one JSON document per page. */
export declare function parseConcatenatedJson(text: string): unknown[];
/**
 * Default GitHub checks reader over `gh api`. It calls the runner directly,
 * never `run()`: failures carry only a code, the numeric HTTP status and the
 * endpoint template, and stderr is discarded.
 */
export declare function createGitHubChecksReader(options: {
    root: string;
    runner?: DeliveryRunner;
    processAdapter?: ProcessAdapter;
}): GitHubChecksReader;
export declare function deliverToGitHub(options: DeliveryOptions): Promise<GitHubDeliveryResult>;
export declare function verifyDeliveryReceipt(receipt: GitHubDeliveryReceipt): void;
export interface PublicationObservation {
    tagCommit: string | null;
    releaseCommit: string | null;
    npmVersion: string | null;
    distTagVersion: string | null;
}
export interface PublicationInspection {
    observed: PublicationObservation;
    commandReceiptDigests: string[];
}
export type PublicationAction = "create-tag" | "push-tag" | "create-github-release" | "publish-npm" | "set-dist-tag";
export interface PublicationPlan {
    packageName: string;
    version: string;
    tag: string;
    distTag: string;
    commit: string;
    actions: PublicationAction[];
    converged: boolean;
    digest: string;
}
export interface PublicationReceipt {
    schemaVersion: 1;
    repositoryId: string;
    feature: string;
    authorizationDigest: string;
    planDigest: string;
    packageName: string;
    version: string;
    tag: string;
    distTag: string;
    commit: string;
    commandReceiptDigests: string[];
    publishedAt: string;
    digest: string;
}
export declare function publicationRequestDigest(input: {
    repositoryId: string;
    feature: string;
    packageName: string;
    version: string;
    distTag: string;
    commit: string;
}): string;
export declare function planPublication(input: {
    authorization: StandingAuthorization;
    repositoryId: string;
    feature: string;
    packageName: string;
    version: string;
    distTag: string;
    commit: string;
    observed: PublicationObservation;
}): PublicationPlan;
export declare function executePublicationPlan(input: {
    root: string;
    plan: PublicationPlan;
    runner?: DeliveryRunner;
    processAdapter?: ProcessAdapter;
}): Promise<string[]>;
export declare function inspectPublication(input: {
    root: string;
    packageName: string;
    version: string;
    distTag: string;
    runner?: DeliveryRunner;
    processAdapter?: ProcessAdapter;
}): Promise<PublicationInspection>;
export declare function verifyPublicationReceipt(receipt: PublicationReceipt): void;
export declare function publishImmutable(input: {
    root: string;
    authorization: StandingAuthorization;
    repositoryId: string;
    feature: string;
    packageName: string;
    version: string;
    distTag: string;
    commit: string;
    runner?: DeliveryRunner;
    processAdapter?: ProcessAdapter;
    now?: () => Date;
}): Promise<PublicationReceipt>;
export declare function localOnlyYoloAuthorization(input: {
    repositoryId: string;
    feature: string;
    requestDigest: string;
    createdAt: string;
}): StandingAuthorization;
