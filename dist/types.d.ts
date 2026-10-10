export { MANIFEST_SCHEMA_VERSION, POLICY_SCHEMA_VERSION, PRODUCT_VERSION, RECEIPT_SCHEMA_VERSION, SCHEMA_VERSION, } from "./protocol.js";
import type { IntegrationReplayPlan } from "./qa.js";
import type { ConsultFinding, ConsultPacket } from "./specialists.js";
import { POLICY_SCHEMA_VERSION, SCHEMA_VERSION, type CompletionReport, type EvidenceReceipt, type ExecutionMode, type QaAttemptOutcome, type QaCheckKind, type RiskFloor, type StandingAuthorization } from "./protocol.js";
export type { DefaultMode, DirectAction, DirectPause, FeatureLifecycle, PromotionFullCi, VerificationProfile } from "./protocol.js";
import type { DefaultMode, DirectPause, PromotionBinding, PromotionFullCi, VerificationProfile } from "./protocol.js";
export type Workflow = "fast" | "complex";
export type Profile = Workflow | "quick";
export type WorkRoute = "flow-direct" | "flow-delegated" | "formal-sdd";
export type PublicWorkState = "working" | "checking" | "ready" | "needs-decision";
export interface WorkExploration {
    understood?: boolean;
    filesToRead?: number;
    nonTrivialFilesToWrite?: number;
    broadResearch?: boolean;
    freshContextUseful?: boolean;
    recoveryUseful?: boolean;
}
export type Phase = "idle" | "shape" | "specify" | "design" | "plan" | "implement" | "context" | "verify" | "review" | "integrate" | "deliver" | "publish" | "archive" | "done";
export type WorkflowStatus = "idle" | "waiting" | "awaiting_human" | "blocked" | "done";
export type Outcome = "passed" | "failed" | "awaiting_human" | "blocked";
export type EvidenceKind = "test" | "browser" | "screenshot" | "review" | "human";
export type VerificationStatus = "skipped" | "verified" | "pending";
export type ChangeType = "feature" | "fix" | "chore";
export type IsolationMode = "ask" | "off";
export type ComplexDecisionMode = "required" | "off";
export type QuestionMode = "concise" | "detailed";
export type ReviewMode = "bot" | "fresh-context";
export interface IsolationConfig {
    mode: IsolationMode;
    baseBranch: string;
    worktreePath: string;
    branchPattern: string;
    copyFiles?: string[];
    localFiles?: LocalFilesConfig;
}
/** Stored fields only; absent fields resolve to enabled with maxBehind 10. */
export interface ContextConfig {
    /** Repository name for the context index; defaults to the root manifest name, never the folder or a remote. */
    name?: string;
    /** Extra history or archive globs no context page depends on; `!pattern` re-includes a default. */
    exclude?: string[];
}
export interface StalenessConfig {
    enabled?: boolean;
    /** Commits behind the target tolerated before the roadmap asks to sync; conflicts always ask. */
    maxBehind?: number;
}
/** Local-ref freshness of the checkout against its target branch; no timestamps, stable between reads. */
export interface TargetFreshness {
    target: string;
    /** The ref actually compared: the target's upstream when it has one, else the target. */
    ref: string;
    branch: string | null;
    isTarget: boolean;
    behind: number;
    ahead: number;
    /** Files a merge of the target would conflict in; null when this Git cannot predict them. */
    conflicts: string[] | null;
    dirty: boolean;
}
export interface TargetSyncInput {
    target?: string;
    fetch?: boolean;
}
export interface TargetSyncResult {
    kind: "sync_target_result";
    status: "merged" | "current" | "refused";
    reason?: "on-target" | "detached-head" | "dirty-worktree" | "conflicts" | "conflicts-unknown";
    message: string;
    target: string;
    ref: string;
    branch: string | null;
    fetched: boolean;
    before: TargetFreshness;
    after: TargetFreshness;
    conflicts: string[];
    changedFiles: string[];
    mergeCommit: string | null;
}
/** Stored fields only; absent fields resolve to the documented defaults at use time. */
export interface LocalFilesConfig {
    discover?: boolean;
    include?: string[];
    exclude?: string[];
}
export type LocalFileRefusalReason = "unsafe-path" | "case-conflict" | "symbolic-link" | "not-regular-file" | "too-large" | "source-not-ignored" | "destination-tracked" | "destination-not-ignored" | "interrupted-copy";
export interface LocalFileRefusal {
    path: string;
    reason: LocalFileRefusalReason;
}
export interface WorktreeLocalFiles {
    mode: "copy-missing";
    paths: string[];
    discovered?: string[];
    refused?: LocalFileRefusal[];
}
export interface LocalFilesReport {
    copied: string[];
    skippedExisting: string[];
    missingOptional: string[];
    unapproved: string[];
    refused: LocalFileRefusal[];
    remediation?: string;
}
export interface DecisionConfig {
    complexRecords: ComplexDecisionMode;
}
export interface InteractionConfig {
    questions: QuestionMode;
}
export interface ReviewConfig {
    mode: ReviewMode;
    reviewerTokenEnv: string;
}
export type ReviewVerdict = "APPROVED" | "CHANGES_REQUESTED";
export interface ReviewCriterionVerdict {
    id: string;
    passed: boolean;
    detail: string;
}
export interface ReviewPacket {
    schemaVersion: 1;
    mode: ReviewMode;
    baseRef: string;
    baseCommit: string;
    headCommit: string;
    diff: string;
    diffDigest: string;
    criteria: Array<{
        id: string;
        text: string;
    }>;
    decisions: DecisionSummary[];
    /** Present only when the feature amended its contract in place; unamended packet digests are unchanged. */
    contractAmendments?: ContractAmendmentView[];
    /** Present only for a delta re-review: the diff then covers only changes since the previous reviewed head. */
    reReview?: ReviewReReview;
    packetDigest: string;
}
export type ReviewFindingSeverity = "critical" | "high" | "medium" | "low";
export type ReviewFindingCategory = "security" | "acceptance" | "correctness" | "design" | "maintainability" | "tests" | "docs";
/** A structured review finding. Critical, high, security and acceptance findings block. */
export interface ReviewFinding {
    id: string;
    severity: ReviewFindingSeverity;
    category: ReviewFindingCategory;
    summary: string;
    path?: string | undefined;
}
export type ReviewFindingState = "open" | "fixed" | "deferred" | "new";
/** Re-review context: the last recorded review this packet's delta builds on. */
export interface ReviewReReview {
    previousResultDigest: string;
    previousBaseCommit: string;
    previousHeadCommit: string;
    previousVerdict: ReviewVerdict;
    /** The previous canonical review body, so criterion verdicts carry forward. */
    previousReview: string;
    /** Findings from that review that were not deferred; the reviewer checks whether each is fixed. */
    openFindings: ReviewFinding[];
    /** Non-blocking findings deferred in this or earlier rounds; tracked elsewhere, never re-reported. */
    deferredFindings: ReviewFinding[];
}
export interface ReviewSubmission {
    packetDigest: string;
    /**
     * Advisory. The recorded verdict is derived from the criteria and blocking
     * findings, so a label that disagrees with them never rejects the review.
     */
    verdict?: ReviewVerdict | undefined;
    criteria: ReviewCriterionVerdict[];
    securityCorrectness: string;
    designMaintainability: string;
    reviewerActor: string;
    reviewerInvocationId: string;
    /** Optional structured findings; omitted keeps the previous result digest. */
    findings?: ReviewFinding[] | undefined;
}
export interface ReviewDeferral {
    schemaVersion: 1;
    resultDigest: string;
    findingIds: string[];
    reason: string;
    /** Tracker issue id or URL for the follow-up; null only when no tracker is available. */
    ticket: string | null;
    recordedAt: string;
}
export interface ReviewRerunCost {
    /** Checks whose proof a tree change invalidates and that must run again. */
    checks: Array<{
        id: string;
        estimateMs: number | null;
    }>;
    knownEstimateMs: number;
    unknownEstimates: number;
    /** A new review packet is always needed after a fix. */
    reReview: true;
}
export interface ReviewTriageExit {
    /** open-pr is retained for legacy consumers; current review triage never offers it. */
    id: "fix" | "defer" | "follow-up" | "open-pr" | "stop";
    label: string;
    available: boolean;
    unavailableReason?: string;
    cost?: ReviewRerunCost;
    findingIds?: string[];
}
export interface ReviewTriage {
    round: number;
    maxRounds: number;
    roundLimitReached: boolean;
    blockingFindingIds: string[];
    failedCriteria: string[];
    openNonBlockingFindingIds: string[];
    deferredFindingIds: string[];
    exits: ReviewTriageExit[];
    /** Present only after a delta re-review: each carried finding id with its state. */
    findingHistory?: Array<{
        id: string;
        state: ReviewFindingState;
    }>;
    /** True when the agent must present the exits instead of starting another lap. */
    mustChoose: boolean;
}
export interface ReviewDeferInput {
    findingIds: string[];
    reason: string;
    ticket?: string | null;
}
export interface ReviewDeferResult {
    kind: "review_findings_deferred";
    deferral: ReviewDeferral;
    triage: ReviewTriage;
}
export interface CanonicalReviewResult {
    schemaVersion: 1;
    packetDigest: string;
    mode: ReviewMode;
    baseRef: string;
    baseCommit: string;
    headCommit: string;
    diffDigest: string;
    verdict: ReviewVerdict;
    reviewerActor: string;
    reviewerInvocationId: string;
    reviewerLogin: string | null;
    body: string;
    bodyDigest: string;
    /** Present only when the reviewer returned structured findings. */
    findings?: ReviewFinding[] | undefined;
    digest: string;
}
export type BotReviewReadiness = {
    wired: true;
    mode: "bot";
    reviewerTokenEnv: string;
    reviewerLogin: string;
    repository: string;
    permission: string;
    guidance: string;
} | {
    wired: false;
    mode: "bot";
    reviewerTokenEnv: string;
    reason: "invalid-environment-name" | "credential-missing" | "authentication-failed" | "repository-unavailable" | "reviewer-is-author";
    guidance: string;
};
export interface ReviewPacketResult {
    kind: "review_packet";
    packet: ReviewPacket;
    instructions: string;
    readiness: BotReviewReadiness | null;
}
export interface ReviewSetupRequiredResult {
    kind: "review_setup_required";
    readiness: Extract<BotReviewReadiness, {
        wired: false;
    }>;
    fallback: {
        mode: "fresh-context";
        message: string;
    };
}
export interface ReviewRecordedResult {
    kind: "review_recorded";
    packet: ReviewPacket;
    result: CanonicalReviewResult;
    receipt: EvidenceReceipt;
    triage: ReviewTriage;
}
export type ReviewOperationResult = ReviewPacketResult | ReviewSetupRequiredResult | ReviewRecordedResult;
export interface ProjectConfig {
    activationMode: import("./activation.js").ActivationMode;
    /** Team default lane; emitted only when present so older configurations keep their bytes. */
    defaultMode?: DefaultMode;
    schemaVersion: typeof SCHEMA_VERSION;
    profile: Profile;
    maxRepairAttempts: number;
    mockupsBeforeCoding: boolean;
    evidence: {
        required: boolean;
        browserForUi: boolean;
        screenshotForUi: boolean;
        codeReview: boolean;
    };
    isolation: IsolationConfig;
    /** Target-branch drift reporting; emitted only when present so older configurations keep their bytes. */
    staleness?: StalenessConfig;
    /** Repository-context sources; emitted only when present so older configurations keep their bytes. */
    context?: ContextConfig;
    decisions: DecisionConfig;
    interaction: InteractionConfig;
    review: ReviewConfig;
    /** Optional size limits; emitted only when present so older configurations keep their bytes. */
    sizeGuardrail?: SizeGuardrailConfig;
    setupComplete: boolean;
    legacySource: "ai" | null;
    /** Per-lane time budget in minutes; emitted only when present so older configurations keep their bytes. */
    budget?: BudgetConfig;
}
export interface BudgetConfig {
    fast: number;
    quick: number;
    complex: number;
}
export interface SizeGuardrailConfig {
    enabled: boolean;
    maxCriteria: number;
    maxCapabilities: number;
}
/** Deterministic contract size; `over` names each exceeded limit in `reasons`. */
export interface FeatureSize {
    criteria: number;
    capabilities: number;
    over: boolean;
    reasons: string[];
    /** One proposed slice boundary per capability delta, sorted by capability. */
    slices: Array<{
        capability: string;
        requirements: string[];
    }>;
}
export interface ProjectConfigurationInput {
    activationMode?: import("./activation.js").ActivationMode;
    /** `null` clears the key; personal scope accepts only this field. */
    defaultMode?: DefaultMode | null;
    /** `team` (default) writes `.empirical/config.json`; `personal` writes checkout Git metadata. */
    scope?: "team" | "personal";
    mockupsBeforeCoding?: boolean;
    evidence?: Partial<ProjectConfig["evidence"]>;
    isolation?: Partial<IsolationConfig>;
    decisions?: Partial<DecisionConfig>;
    interaction?: Partial<InteractionConfig>;
    review?: Partial<ReviewConfig>;
    setupComplete?: boolean;
}
/** Portable data only: public declarations must not import coordination runtime internals. */
export interface PortableCapabilityBase {
    schemaVersion: 1;
    id: string;
    repositoryId: string;
    feature: string;
    worktree: string;
    worktreeId: string;
    originalWorktreeId?: string;
    baseCommit: string;
    baseTree: string;
    bases: Record<string, {
        capability: string;
        digest: string;
        requirements: Record<string, string | null>;
    }>;
    capabilities: string[];
    status: "active" | "integrated";
    integrationReceiptDigest: string | null;
    createdAt: string;
    heartbeatAt: string;
    digest: string;
}
export interface WorkflowState {
    schemaVersion: typeof SCHEMA_VERSION;
    revision: number;
    activeFeature: string | null;
    request: string | null;
    profile: Profile;
    workflow: Workflow;
    mode: ExecutionMode;
    lifecycle?: import("./protocol.js").FeatureLifecycle;
    /** Present only while the feature is paused for direct work. */
    pause?: DirectPause;
    /** The latest recorded split-or-keep choice for a large Complex feature. */
    sizeDecision?: import("./protocol.js").SizeDecision;
    phase: Phase;
    /**
     * Complex phase order: Review runs before Verify, so review fixes never
     * invalidate test runs. Stamped when a Complex feature starts or a Fast
     * feature is promoted; features started earlier keep Verify before Review.
     */
    reviewFirst?: true;
    status: WorkflowStatus;
    /**
     * Structured cause of a `blocked` status, present only for the failed Fast
     * Implement block that names promotion as a recovery path.
     */
    blockedBy?: "fast-implement-failure";
    repairAttempts: number;
    message: string | null;
    implementationActor: string | null;
    /** Set only when an explicitly approved worktree handoff starts this feature. */
    workStartedAt?: string | null;
    /** Minutes added past the lane budget by explicit checkpoint choices; present only once extended. */
    budgetExtensionMinutes?: number;
    specDigest: string | null;
    approvedSpecRevision: number | null;
    capabilityArchiveRequired: boolean;
    capabilityDeltaDigest: string | null;
    impactDigest: string | null;
    capabilityClaimId: string | null;
    /** Original comparison data travels in the spec; local execution ownership does not. */
    capabilityBase?: PortableCapabilityBase;
    authorizationDigest: string | null;
    evidence: Evidence[];
    evidenceReceiptIds: string[];
    legacyEvidenceCount: number;
    completion: CompletionReport;
    /**
     * Present only on a feature terminated by an explicit recorded closure
     * override. It names why the feature stopped; it proves nothing about what
     * the feature achieved, which stays governed by `completion`.
     */
    closure?: import("./protocol.js").FeatureClosure;
    completionRecord?: import("./completion-record.js").CompletionRecord;
    verificationCoverage?: import("zod").infer<typeof import("./protocol.js").reviewCoverageSchema>;
    /** Confirmed external delivery facts; these do not replace completion receipts. */
    trackerLifecycle?: TrackerLifecycleFacts;
    /** A terminal feature's unsynchronized projection closed without a provider call. */
    trackerWaiver?: import("./protocol.js").TrackerWaiver;
    /** Changes when a feature begins a new iteration or is promoted. */
    trackerGeneration?: number;
    updatedAt: string;
}
export interface TrackerLifecyclePolicy {
    doneWhen: "workflow" | "release" | "deployment";
    readyForRelease: string;
    readyForDeployment: string;
    productionEnvironment: string;
}
export interface TrackerLifecycleFact {
    generation?: number | undefined;
    kind: "release" | "deployment";
    version: string;
    commit: string;
    environment: string | null;
    url: string | null;
    occurredAt: string;
    sourceFeature: string;
    evidenceDigest: string;
}
export interface TrackerLifecycleFacts {
    release?: TrackerLifecycleFact;
    deployments?: Record<string, TrackerLifecycleFact>;
    latest: TrackerLifecycleFact;
}
export type TrackerLifecycleStage = "ready-for-release" | "ready-for-deployment" | "released" | "deployed";
export type TrackerRecordInput = {
    sourceFeature: string;
    receipt: "publication";
} | {
    sourceFeature: string;
    receipt: "execution";
    receiptId: string;
} | {
    sourceFeature: string;
    receipt: "command";
    commandId: string;
};
export interface TrackerRecordResult {
    fact: TrackerLifecycleFact;
    features: Array<{
        feature: string;
        revision: number;
        changed: boolean;
        tracker: TrackerStatus;
    }>;
}
export type TrackerProvider = "github" | "linear" | "jira" | "plane";
export type TrackerProgressState = "specification" | "planned" | "in-progress" | "verification" | "review" | "blocked" | "done";
export type TrackerHealth = "local-only" | "off" | "pending" | "synced" | "failed" | "waived";
export type TrackerStateMap = Record<TrackerProgressState, string>;
export type TrackerTicketPolicy = "off" | "manual" | "ensure";
export type TrackerProgressVisibility = "blockers-final" | "milestones" | "revisions";
export type TrackerEnforcement = "best-effort" | "strict";
export type TrackerTicketRequirement = "required" | "optional" | "off";
export type TrackerGateRecovery = "authenticate" | "bind" | "sync" | "reconcile" | "configure";
export interface TrackerMutationGate {
    state: "open" | "blocked";
    code: string | null;
    summary: string | null;
    recovery: TrackerGateRecovery | null;
}
export type TrackerTicketRules = Record<ChangeType, Record<Profile, TrackerTicketRequirement>>;
export interface TrackerTicketResolution {
    changeType: ChangeType;
    requirement: TrackerTicketRequirement;
    rules: boolean;
}
export interface GitHubTrackerPolicyV1 {
    schemaVersion: 1;
    provider: "github";
    target: {
        owner: string;
        repository: string;
        projectId: string;
        statusFieldId: string;
    };
    credentialEnv: {
        token: string;
    };
    states: TrackerStateMap;
}
export interface GitHubTrackerPolicyV2 extends Omit<GitHubTrackerPolicyV1, "schemaVersion"> {
    schemaVersion: 2;
    ticket: TrackerTicketPolicy;
    visibility: TrackerProgressVisibility;
    enforcement?: TrackerEnforcement | undefined;
    ticketRules?: TrackerTicketRules | undefined;
    lifecycle?: TrackerLifecyclePolicy | undefined;
}
export type GitHubTrackerPolicy = GitHubTrackerPolicyV1 | GitHubTrackerPolicyV2;
export interface LinearTrackerPolicyV1 {
    schemaVersion: 1;
    provider: "linear";
    target: {
        teamId: string;
        projectId: string | null;
    };
    credentialEnv: {
        apiKey: string;
    };
    states: TrackerStateMap;
}
export interface LinearTrackerPolicyV2Host extends Omit<LinearTrackerPolicyV1, "schemaVersion"> {
    schemaVersion: 2;
    connection?: undefined;
    ticket: TrackerTicketPolicy;
    visibility: TrackerProgressVisibility;
    enforcement?: TrackerEnforcement | undefined;
    ticketRules?: TrackerTicketRules | undefined;
    lifecycle?: TrackerLifecyclePolicy | undefined;
}
export interface LinearTrackerPolicyV2Mcp extends Omit<LinearTrackerPolicyV1, "schemaVersion" | "credentialEnv"> {
    schemaVersion: 2;
    connection: "linear-mcp";
    ticket: TrackerTicketPolicy;
    visibility: TrackerProgressVisibility;
    enforcement?: TrackerEnforcement | undefined;
    ticketRules?: TrackerTicketRules | undefined;
    lifecycle?: TrackerLifecyclePolicy | undefined;
}
export type LinearTrackerPolicyV2 = LinearTrackerPolicyV2Host | LinearTrackerPolicyV2Mcp;
export type LinearTrackerPolicy = LinearTrackerPolicyV1 | LinearTrackerPolicyV2;
export interface LinearMcpDiscoveryCatalog {
    teams: Array<{
        id: string;
        name: string;
        key?: string;
    }>;
    projects: Array<{
        id: string;
        name: string;
        teamId: string;
        url?: string;
    }>;
    states: Array<{
        id: string;
        name: string;
        teamId: string;
        type: string;
        position?: number;
    }>;
}
export type LinearMcpOperation = "get-issue" | "find-issues" | "create-issue" | "update-issue" | "list-comments" | "create-comment";
export interface LinearMcpIntent {
    schemaVersion: 1;
    id: string;
    feature: string;
    operation: LinearMcpOperation;
    tool: string;
    arguments: Record<string, unknown>;
    resultSchema: Record<string, unknown>;
    pagination: {
        cursorArgument: "cursor";
        maxPages: number;
        maxItems: number;
    } | null;
    reconciliation: boolean;
    digest: string;
}
export type LinearMcpNormalizedResult = {
    kind: "issue";
    issue: {
        id: string;
        identifier: string;
        url: string;
        description: string;
        attachmentUrls?: string[];
        teamId: string;
        projectId: string | null;
        stateId: string;
    };
} | {
    kind: "issues";
    complete: true;
    issues: Array<{
        id: string;
        identifier: string;
        url: string;
        description: string;
        attachmentUrls?: string[];
        teamId: string;
        projectId: string | null;
        stateId: string;
    }>;
}
/** One listing page; `nextCursor` is null on the last page. */
 | {
    kind: "issues";
    nextCursor: string | null;
    issues: Array<{
        id: string;
        identifier: string;
        url: string;
        description: string;
        attachmentUrls: string[];
        teamId: string;
        projectId: string | null;
        stateId: string;
    }>;
} | {
    kind: "comment";
    comment: {
        id: string;
        issueId: string;
        body: string;
    };
} | {
    kind: "comments";
    complete: true;
    comments: Array<{
        id: string;
        issueId: string;
        body: string;
    }>;
};
export interface LinearMcpBridgeResult extends TrackerSyncResult {
    intent: LinearMcpIntent | null;
}
export interface JiraTrackerPolicyV1 {
    schemaVersion: 1;
    provider: "jira";
    target: {
        siteUrl: string;
        projectKey: string;
        issueTypeId: string;
    };
    credentialEnv: {
        email: string;
        apiToken: string;
    };
    states: TrackerStateMap;
}
export interface JiraTrackerPolicyV2 extends Omit<JiraTrackerPolicyV1, "schemaVersion"> {
    schemaVersion: 2;
    ticket: TrackerTicketPolicy;
    visibility: TrackerProgressVisibility;
    enforcement?: TrackerEnforcement | undefined;
    ticketRules?: TrackerTicketRules | undefined;
    lifecycle?: TrackerLifecyclePolicy | undefined;
}
export type JiraTrackerPolicy = JiraTrackerPolicyV1 | JiraTrackerPolicyV2;
export interface PlaneTrackerPolicyV2 {
    schemaVersion: 2;
    provider: "plane";
    target: {
        baseUrl: string;
        workspaceSlug: string;
        projectId: string;
    };
    credentialEnv: {
        apiKey: string;
    };
    states: TrackerStateMap;
    ticket: TrackerTicketPolicy;
    visibility: TrackerProgressVisibility;
    enforcement?: TrackerEnforcement | undefined;
    ticketRules?: TrackerTicketRules | undefined;
    lifecycle?: TrackerLifecyclePolicy | undefined;
}
export type PlaneTrackerPolicy = PlaneTrackerPolicyV2;
export type TrackerPolicy = GitHubTrackerPolicy | LinearTrackerPolicy | JiraTrackerPolicy | PlaneTrackerPolicy;
export interface EffectiveTrackerPolicy {
    policy: TrackerPolicy;
    schemaVersion: 1 | 2;
    ticket: TrackerTicketPolicy;
    visibility: TrackerProgressVisibility | "legacy";
    enforcement: TrackerEnforcement;
    compatibility: "v1" | "v2";
    ticketRules?: TrackerTicketRules | undefined;
}
export type TrackerDiscoveryResourceKind = "workspace" | "team" | "repository" | "project" | "issue-type" | "field" | "state";
export interface TrackerDiscoveryResource {
    kind: TrackerDiscoveryResourceKind;
    id: string;
    name: string;
    parentId: string | null;
    position: number | null;
    stateType: string | null;
    key: string | null;
    url: string | null;
}
export interface GitHubTrackerDiscoveryInput {
    provider: "github";
    credentialEnv: {
        token: string;
    };
}
export interface LinearTrackerDiscoveryInput {
    provider: "linear";
    credentialEnv: {
        apiKey: string;
    };
}
export interface JiraTrackerDiscoveryInput {
    provider: "jira";
    target: {
        siteUrl: string;
    };
    credentialEnv: {
        email: string;
        apiToken: string;
    };
}
export interface PlaneTrackerDiscoveryInput {
    provider: "plane";
    target: {
        baseUrl: string;
        workspaceSlug: string;
    };
    credentialEnv: {
        apiKey: string;
    };
}
export type TrackerDiscoveryInput = GitHubTrackerDiscoveryInput | LinearTrackerDiscoveryInput | JiraTrackerDiscoveryInput | PlaneTrackerDiscoveryInput;
export interface TrackerAdapterCapabilities {
    comments: boolean;
    uploads: boolean;
    durableLinks: boolean;
}
export interface TrackerDiscovery {
    schemaVersion: 1;
    provider: TrackerProvider;
    resources: TrackerDiscoveryResource[];
    capabilities: TrackerAdapterCapabilities;
    complete: true;
    digest: string;
}
export interface TrackerMappingCandidate {
    stateId: string;
    name: string;
    primaryRank: number;
    nameRank: number;
    reasons: string[];
}
export interface TrackerPhaseMappingSuggestion {
    phase: TrackerProgressState;
    selectedStateId: string | null;
    ambiguous: boolean;
    candidates: TrackerMappingCandidate[];
}
export interface TrackerMappingSuggestion {
    provider: TrackerProvider;
    phases: Record<TrackerProgressState, TrackerPhaseMappingSuggestion>;
    states: TrackerStateMap | null;
    ambiguous: TrackerProgressState[];
}
export interface TrackerPolicyPreview {
    schemaVersion: 1;
    policy: TrackerPolicy;
    effective: {
        ticket: TrackerTicketPolicy;
        visibility: TrackerProgressVisibility | "legacy";
        enforcement: TrackerEnforcement;
        compatibility: "v1" | "v2";
    };
    target: Array<{
        kind: TrackerDiscoveryResourceKind;
        id: string;
        name: string;
    }>;
    mapping: TrackerMappingSuggestion;
    lifecycle?: {
        doneWhen: TrackerLifecyclePolicy["doneWhen"];
        productionEnvironment: string;
        readyForRelease: {
            id: string;
            name: string;
        };
        readyForDeployment: {
            id: string;
            name: string;
        };
    };
    valid: true;
    digest: string;
}
export type TrackerSetupChange = {
    mode: "preserve";
} | {
    mode: "disabled";
} | {
    mode: "apply";
    policy: TrackerPolicy;
};
export interface TrackerArtifact {
    receiptId: string;
    path: string;
    mediaType: string;
    digest: string;
    size: number;
    url: string | null;
}
export interface TrackerEffectAcknowledgement {
    key: string;
    /** `dispatch` records a comment send that is not yet acknowledged; its key is the comment's. */
    kind: "transition" | "comment" | "artifact" | "dispatch";
    remoteId: string | null;
    at: string;
}
export interface TrackerProjection {
    schemaVersion: 1 | 2;
    feature: string;
    phase: Phase;
    status: WorkflowStatus;
    revision: number;
    completionLevel: CompletionReport["highest"];
    progress: TrackerProgressState;
    summary: string | null;
    blocker?: string | null;
    receiptIds?: string[];
    receiptDigest?: string;
    artifacts?: TrackerArtifact[];
    lifecycleStage?: TrackerLifecycleStage;
    lifecycleFact?: TrackerLifecycleFact;
    marker: string;
    digest: string;
}
export interface TrackerFailure {
    code: string;
    summary: string;
    at: string;
}
export interface TrackerBinding {
    schemaVersion: 1 | 2;
    feature: string;
    provider: TrackerProvider;
    remoteId: string;
    remoteKey: string;
    url: string;
    projectItemId: string | null;
    markerId: string | null;
    /** Digest of the provider and remote target this binding is confined to. */
    targetDigest: string;
    /** Durable bind attempt that produced this remote association. */
    bindIdempotencyKey: string;
    lastSyncedRevision: number | null;
    lastSyncedDigest: string | null;
    /** Digest of the target and state mapping used by the last acknowledged projection. */
    lastSyncedPolicyDigest: string | null;
    lastSyncedPhase?: Phase | null;
    lastSyncedStatus?: WorkflowStatus | null;
    lastSyncedCompletionLevel?: CompletionReport["highest"] | null;
    lastSyncedReceiptDigest?: string | null;
    lastSyncedStateId?: string | null;
    lastSyncedLifecycleDigest?: string | null;
    digest: string;
}
export interface TrackerCreateIntent {
    mode: "create";
    title: string;
    description: string;
    /** Stable logical marker for this feature/target; the pending idempotency key identifies the attempt. */
    marker: string;
    /** Set durably immediately before the provider create request is dispatched. */
    dispatched: boolean;
}
export interface TrackerAttachIntent {
    mode: "attach";
    ticket: string;
    /** A terminal feature attached after the fact: validate and bind, publish nothing. */
    linkOnly?: true;
}
export type TrackerBindIntent = TrackerCreateIntent | TrackerAttachIntent;
export interface TrackerPendingRecord {
    schemaVersion: 1 | 2;
    provider: TrackerProvider;
    targetDigest: string;
    policyDigest: string;
    projection: TrackerProjection;
    intent: TrackerBindIntent;
    /** Binding superseded by an explicit replacement; it must never satisfy this pending intent. */
    replacesBindingDigest: string | null;
    idempotencyKey: string;
    attempts: number;
    status: "pending" | "failed" | "synced";
    failure: TrackerFailure | null;
    /**
     * Sticky proof that this feature incurred a required-ticket obligation.
     * The legacy field name is retained for durable compatibility.
     */
    strictRequired?: true;
    effects?: TrackerEffectAcknowledgement[];
    /** Headlines of earlier revisions that never reached the tracker, shown in the next comment. */
    folded?: string[];
    updatedAt: string;
    digest: string;
}
export interface TrackerStatus {
    /** Prepared, validated host operation; absent when no MCP dispatch is needed. */
    intent?: LinearMcpIntent | null;
    /** Revision whose synchronization first requested the unexecuted intent chain. */
    intentSinceRevision?: number;
    /** Number of times the host has prepared the same still-unexecuted intent. */
    intentAttempts?: number;
    health: TrackerHealth;
    provider: TrackerProvider | null;
    url: string | null;
    committedRevision: number;
    lastSyncedRevision: number | null;
    pendingRevision: number | null;
    failure: TrackerFailure | null;
    schemaVersion?: 1 | 2;
    ticket?: TrackerTicketPolicy;
    visibility?: TrackerProgressVisibility | "legacy";
    enforcement?: TrackerEnforcement;
    gate?: TrackerMutationGate;
    changeType?: ChangeType;
    ticketRequirement?: TrackerTicketRequirement;
    pendingEffects?: number;
    /** Present when health is `waived`. */
    waiver?: import("./protocol.js").TrackerWaiver;
}
export interface ProjectStatus extends WorkflowState {
    /** Read-only context for the checkout from which status was requested. */
    checkout: {
        /** Symbolic Git branch, or null for detached and non-Git checkouts. */
        branch: string | null;
    };
    /** Human lifecycle projection for the selected SDD feature. */
    sdd: {
        status: "idle" | "in_progress" | "done";
        readiness: "not_applicable" | "verification_required" | "ready_to_merge";
        message: string;
    };
    /** Durable source pull-request lifecycle observed by delivery. */
    delivery?: DeliveryLifecycleProjection;
    interaction: InteractionConfig;
    review: ReviewConfig;
    tracker: TrackerStatus;
    /** The same derived roadmap the action packet returns; null when it cannot be derived. */
    roadmap: Roadmap | null;
    /** Fast only: Accepted decisions from the optional, never-gating record. */
    decisions?: DecisionSummary[];
    /** Fast only: non-blocking decision record format issues. */
    decisionWarnings?: string[];
    /** Team, personal and effective default lanes. */
    defaultMode: DefaultModeReport;
    /**
     * Unfinished features whose state is identical on the target branch: merged
     * there and never closed. An offline hint; reconcile proves and closes them.
     */
    mergedNotClosed: string[];
}
export interface DeliveryLifecycleProjection {
    schemaVersion: 1;
    source: {
        number: number;
        url: string;
        branch: string;
        head: string;
        state: "draft" | "ready" | "merged";
    };
    verification: "required" | "verified";
    updatedAt: string;
}
export interface DefaultModeReport {
    team: DefaultMode | null;
    personal: DefaultMode | null;
    effective: DefaultMode;
    warnings: string[];
}
export interface TrackerCreateBindInput {
    mode: "create";
    title?: string;
    description?: string;
    replace?: true;
    confirmCreateRetry?: true;
}
export interface TrackerAttachBindInput {
    mode: "attach";
    ticket: string;
    replace?: true;
}
export type TrackerBindInput = TrackerCreateBindInput | TrackerAttachBindInput;
export interface TrackerHttpRequest {
    method: "GET" | "POST" | "PATCH" | "PUT";
    url: string;
    headers: Record<string, string>;
    body?: string | Uint8Array;
    timeoutMs: number;
    maxResponseBytes: number;
}
export interface TrackerHttpResponse {
    status: number;
    body: string;
}
export type TrackerTransport = (request: TrackerHttpRequest) => Promise<TrackerHttpResponse>;
/** Secret-free context supplied to a trusted host OAuth broker. */
export type TrackerOAuthRequest = {
    provider: "github";
} | {
    provider: "linear";
} | {
    provider: "jira";
    siteUrl: string;
} | {
    provider: "plane";
};
/**
 * An out-of-band authorization handoff. This descriptor must never contain a
 * provider credential; the tracker runtime validates it before use.
 */
export interface TrackerOAuthAuthorization {
    provider: TrackerProvider;
    elicitationId: string;
    message: string;
    url: string;
}
/** Ephemeral credentials returned only by a trusted host OAuth broker. */
export type TrackerOAuthCredential = {
    provider: "github";
    accessToken: string;
} | {
    provider: "linear";
    accessToken: string;
} | {
    provider: "jira";
    accessToken: string;
    cloudId: string;
};
/**
 * Host-owned OAuth boundary. Registration, callbacks, refresh, revocation,
 * and encrypted token custody remain outside Empirical.
 */
export interface TrackerOAuthResolver {
    authorize?(request: TrackerOAuthRequest): Promise<TrackerOAuthAuthorization | null>;
    resolve(request: TrackerOAuthRequest): Promise<TrackerOAuthCredential | null>;
    cancelAuthorization?(request: TrackerOAuthRequest): Promise<void>;
}
export type TrackerAuthenticationSource = "oauth" | "environment" | "file";
/** Ephemeral runtime authentication. Values must never be serialized. */
export type ResolvedTrackerAuthentication = {
    provider: "github";
    source: TrackerAuthenticationSource;
    accessToken: string;
} | {
    provider: "linear";
    source: TrackerAuthenticationSource;
    accessToken: string;
} | {
    provider: "jira";
    source: "oauth";
    accessToken: string;
    cloudId: string;
} | {
    provider: "jira";
    source: "environment" | "file";
    email: string;
    apiToken: string;
} | {
    provider: "plane";
    source: "environment" | "file";
    apiKey: string;
};
export interface TrackerAuthenticationGuidance {
    provider: TrackerProvider;
    oauthPreferred: boolean;
    credentialNames: string[];
    secretFilePath: string;
    warning: "Never paste credentials into chat";
    message: string;
}
export interface TrackerDependencies {
    /** Trusted host dispatcher for the existing authenticated Linear MCP connection. */
    linearMcpExecutor?: (intent: LinearMcpIntent) => Promise<LinearMcpNormalizedResult>;
    transport?: TrackerTransport;
    env?: Readonly<Record<string, string | undefined>>;
    now?: () => Date;
    oauthResolver?: TrackerOAuthResolver;
    /** Explicit trusted-host override; also keeps tests independent of user files. */
    secretFilePath?: string;
    /** Repository boundary used to reject repository-contained secret files. */
    repositoryRoot?: string;
    /** Deterministic platform override for embeddings and tests. */
    platform?: "posix" | "win32";
    /** Deterministic home-directory override for embeddings and tests. */
    homeDirectory?: string;
    /** Development-only allowance for loopback HTTP authorization URLs. */
    allowInsecureOAuthLoopback?: boolean;
}
export interface TrackerBindResult {
    binding: TrackerBinding | null;
    tracker: TrackerStatus;
}
export interface TrackerWaiveInput {
    revision: number;
    reason: "tracked-elsewhere" | "abandoned";
    justification: string;
    ticket?: string;
    actor?: string;
}
export interface TrackerWaiveResult {
    feature: string;
    revision: number;
    waiver: import("./protocol.js").TrackerWaiver;
    tracker: TrackerStatus;
}
export interface TrackerSyncResult {
    binding: TrackerBinding | null;
    tracker: TrackerStatus;
    projection: TrackerProjection | null;
}
export interface ProjectPolicy {
    schemaVersion: typeof POLICY_SCHEMA_VERSION;
    context: string[];
    phases: Partial<Record<Phase, string[]>>;
    verification: {
        notApplicable?: Array<{
            check: "package-consumer" | "cross-platform" | "clean-clone";
            reason: string;
        }> | undefined;
        /**
         * @deprecated Retired (SDD-142): gates read only `ProjectConfig["evidence"]`.
         * Parsed for digest stability of existing policies; never written anew.
         */
        evidence: ProjectConfig["evidence"];
        commands: Array<{
            id: string;
            argv: string[];
            cwd: string;
            timeoutMs: number;
            maxOutputBytes: number;
            evidenceKinds: EvidenceKind[];
            checks?: QaCheckKind[];
            criteria: string[];
            testFiles?: "changed" | undefined;
            /** Normalized path prefixes or simple globs binding Verify-gate QA receipts; omitted means the whole tree. */
            scope?: string[] | "workspace" | undefined;
        }>;
    };
    delivery: {
        provider: "github";
        targetBranch: string;
        requiredChecks: string[];
    } | null;
    /** Present only for a non-default (non-auto) promotion mode; see effectivePromotion. */
    promotion?: {
        fullCi?: PromotionFullCi | undefined;
        binding?: PromotionBinding | undefined;
    } | undefined;
    preferredAgent: AgentIntegrationId | null;
}
export interface PolicyEffectiveValues {
    promotion: {
        fullCi: PromotionFullCi;
        binding: PromotionBinding;
    };
}
/**
 * Where full CI proves a feature: `ci` is pull-request CI checked at Deliver,
 * `local` is an approved exact local run. Derived statically from committed
 * policy and local Git; `reasons` lists every local-forcing condition.
 */
export interface PromotionRoute {
    mode: PromotionFullCi;
    route: "ci" | "local";
    reasons: RemoteProofReason[];
}
export interface PolicyReport {
    policy: ProjectPolicy;
    digest: string;
    /** Read-only derived values; never part of a committed policy file. */
    effective: PolicyEffectiveValues;
}
export interface Criterion {
    id: string;
    text: string;
    ui: boolean;
    checked: boolean;
}
export type QaEvidenceMode = "automated" | "human" | "either";
export type QaGate = "verify" | "promotion";
export interface VerificationCheck {
    id: string;
    kind: QaCheckKind;
    gate: QaGate;
    evidenceMode: QaEvidenceMode;
    criteria: string[];
    commandIds: string[];
    platforms: string[];
    environments: string[];
    reasons: string[];
}
export interface VerificationCriterionCoverage {
    criterionId: string;
    checkIds: string[];
    evidenceModes: QaEvidenceMode[];
}
export interface FreshContextPacket {
    criteria: Array<{
        id: string;
        text: string;
    }>;
    surfaces: string[];
    allowedArtifacts: string[];
    excludes: string[];
}
export interface VerificationMatrix {
    schemaVersion: 1;
    feature: string;
    riskFloor: RiskFloor;
    specRevision: number;
    specDigest: string;
    impactDigest: string;
    policyDigest: string;
    capabilities: string[];
    surfaces: string[];
    checks: VerificationCheck[];
    coverage: VerificationCriterionCoverage[];
    uncoveredCriteria: string[];
    notApplicable?: Array<{
        check: "package-consumer" | "cross-platform" | "clean-clone";
        reason: string;
    }> | undefined;
    freshContext: FreshContextPacket;
    digest: string;
}
/**
 * One automated Verify-gate check and the single command the minimum-cost cover
 * assigns to it. Advisory for execution only: any passing applicable receipt
 * still satisfies the check. `commandId` is null when no candidate covers it.
 */
export interface VerificationSelectionEntry {
    /** Affected tests with their reasons; only in the QA plan, never in an action packet's roadmap. */
    tests?: import("./changed-tests.js").AffectedTest[];
    /** How many affected tests the command runs; the roadmap carries this instead of the list. */
    testCount?: number;
    checkId: string;
    commandId: string | null;
    /** The command's median over its last three completed attempts, or null. */
    estimateMs: number | null;
    /** Other selected check ids that share this command's run. */
    sharedWith: string[];
    /** At most 160 characters. */
    reason: string;
}
/** A QA plan response: the unchanged matrix plus its Verify selection as a sibling field. */
export type VerificationMatrixPlan = VerificationMatrix & {
    selection: VerificationSelectionEntry[];
};
/** One verification heartbeat for an optional host progress sink. */
export interface VerificationProgressReport {
    /** The check id for QA execution, or the command id for integration replay. */
    id: string;
    status: string;
    elapsedMs: number;
    /** The known estimate for this run, or null. */
    totalMs: number | null;
    /** Null until the command exits, then whether it exited cleanly. */
    passed: boolean | null;
    /** The feature's phase and its 1-based position in its phase order. */
    phase: {
        phase: Phase;
        index: number;
        total: number;
    } | null;
}
/** Trusted host-only progress sink; it never changes receipts or gate outcomes. */
export interface VerificationRuntimeOptions {
    progress?: (event: VerificationProgressReport) => void;
}
export interface QaPlanOptions {
    verificationProfile: VerificationProfile;
}
/** Commands an explicit verification profile may execute for the current feature. */
export interface VerificationProfilePlan {
    kind: "verification_profile_plan";
    profile: VerificationProfile;
    workflow: Workflow;
    /** True for Fast: its receipts are optional and never make the feature verified. */
    optional: boolean;
    /** The profile filters commands only, so this digest is the same for both profiles. */
    matrix: VerificationMatrix;
    /** One entry per command; a single run covers every listed check id. */
    executable: Array<{
        checkId: string;
        commandId: string;
        changedFiles: boolean;
        coveredCheckIds: string[];
        selected: boolean;
    }>;
    refused: Array<{
        commandId: string;
        code: "QA_COMMAND_NOT_APPLICABLE";
        reason: string;
    }>;
    /** Promotion checks left for Integrate, whose exact-receipt gate would discard an earlier run. */
    deferred: Array<{
        checkId: string;
        commandId: string;
        reason: string;
    }>;
}
export interface VerificationProfileSummary {
    /** The profile a QA request without verificationProfile uses; null when one is required. */
    whenOmitted: "final" | null;
    iterate: string[];
    final: string[];
}
export interface Evidence {
    criterionId: string;
    kind: EvidenceKind;
    passed: boolean;
    summary: string;
    artifact?: string;
}
export interface CompletionInput {
    /** User-supplied attribution; never inferred from the executing agent. */
    decisionBy?: string;
    revision: number;
    outcome: Outcome;
    summary: string;
    actor?: string;
    receiptIds?: string[];
    /** Schema-4 compatibility input; Schema 5 rejects asserted evidence. */
    evidence?: Evidence[];
}
export type RoadmapPhaseState = "done" | "current" | "pending";
export type RoadmapCheckState = "passed" | "failed" | "unsupported" | "missing-environment" | "unrun";
export type RoadmapWaitingKind = "decision" | "authorization" | "environment" | "policy-gap" | "test-request" | "merge";
export interface RoadmapCheck {
    id: string;
    gate: QaGate;
    state: RoadmapCheckState;
    receiptId: string | null;
    lastDurationMs: number | null;
    /** Present only when the latest attempt hit its command timeout: that timeout. */
    timedOutAfterMs?: number;
    /** Median of recent matching attempts; null when unknown and always null once passed. Never gates. */
    estimateMs: number | null;
    /** Verify checks: the one command the Verify selection runs for this check. */
    selectedCommandId?: string;
    /** The local full-CI check once its exact run is approved: how the yes was confirmed. */
    approval?: FullSuiteApprovalConfirmation;
    /** The promotion full-CI check: where full CI is proven, and every local-forcing reason. */
    route?: PromotionRoute["route"];
    reasons?: RemoteProofReason[];
    /** A short explanation for a check that is intentionally not run locally. */
    note?: string;
}
/** A background QA job of the active feature, as stable fields only: no clock-derived values. */
export interface RoadmapJob {
    id: string;
    checkId: string;
    commandId: string;
    status: "queued" | "running" | "passed" | "failed" | "cancelled" | "stale" | "error";
    receiptId: string | null;
    stale: boolean;
    estimateMs: number | null;
    failingTestFiles: number;
}
/** Derived on every read from persisted state, the matrix, receipts and policy; never stored. */
export interface Roadmap {
    help?: string;
    verificationSelection?: VerificationSelectionEntry[];
    schemaVersion: 1;
    /** 1-based position in the profile's phase order; Done, Deliver and Publish report index = total. */
    progress: {
        index: number;
        total: number;
    };
    phases: Array<{
        phase: Phase;
        state: RoadmapPhaseState;
        needs: string[];
    }>;
    checks: RoadmapCheck[];
    waitingOn: Array<{
        kind: RoadmapWaitingKind;
        text: string;
    }>;
    nextAction: string;
    verificationLeft: {
        remaining: number;
        total: number;
        knownEstimateMs: number;
        unknownEstimates: number;
    };
    /** Most recent background jobs of the active feature, newest first. They never block and never become the next action. */
    jobs: RoadmapJob[];
    /** Elapsed time against the lane budget, derived from journal timestamps; present only when a timeline is known. */
    time?: RoadmapTime;
}
export interface RoadmapTime {
    /** Active time since the feature's first journal event; idle gaps between events are capped. */
    elapsedMs: number;
    /** Active time since the current phase was entered. */
    phaseElapsedMs: number;
    /** The lane budget plus every recorded checkpoint extension. */
    budgetMs: number;
    over: boolean;
}
export interface RoadmapSummary {
    progress: Roadmap["progress"];
    phase: Phase;
    nextAction: string;
    waitingOn: number;
    checksLeft: number;
}
export interface ActionRationale {
    currentState: string;
    nextAction: string;
    reason: string;
    requiredContext: string[];
    missingContext: string[];
    gate: "proceed" | "stop";
}
export interface ContractSummary {
    text: string;
    characters: number;
    /** A shortening step ran or any item was clipped. */
    truncated: boolean;
    /** Even the ids-only form exceeds the budget; every id is still present. */
    overBudget: boolean;
    /** Existing full contract documents, optional and never required context. */
    references: string[];
}
export interface ContractCriterionChange {
    id: string;
    previous: string | null;
    current: string | null;
}
export interface ContractAmendmentView {
    revision: number;
    baselineRevision: number;
    request: string;
    criteria: ContractCriterionChange[];
    supersededDecisions: string[];
}
export interface ActionPacket {
    trackerRecovery?: Array<{
        feature: string;
        tracker: TrackerStatus;
    }>;
    /** Context pages Implement completion refreshed; commit them with the implementation. */
    pendingPaths?: string[];
    kind: "action";
    protocol: "empirical-sdd";
    schemaVersion: typeof SCHEMA_VERSION;
    root: string;
    feature: string | null;
    request: string | null;
    profile: Profile;
    mode: ExecutionMode;
    lifecycle?: import("./protocol.js").FeatureLifecycle;
    /** Present only on the paused packet, which names resume as its only action. */
    pause?: DirectPause;
    riskFloor: RiskFloor;
    routeRationale: string[];
    interaction: InteractionConfig;
    review: ReviewConfig;
    phase: Phase;
    status: WorkflowStatus;
    revision: number;
    instructions: string;
    rationale: ActionRationale;
    /** Derived progress, checks, waiting items and next action; null for an idle checkout. */
    roadmap: Roadmap | null;
    acceptanceCriteria: Criterion[];
    requiredEvidence: EvidenceKind[];
    artifacts: string[];
    projectContext: string[];
    knowledgeContext: string[];
    capabilityContext: string[];
    completionRecord?: import("./completion-record.js").CompletionRecord;
    completionLevel: CompletionReport;
    verification: VerificationStatus;
    verificationMatrix: VerificationMatrix | null;
    /** Configured command ids per explicit verification profile; null without an approved feature. */
    verificationProfiles: VerificationProfileSummary | null;
    /** Complex Implement only: bounded deterministic contract extract; full documents stay optional references. */
    contractSummary?: ContractSummary;
    /** Present only for a Complex feature over its size limits in Specify through Implement. */
    featureSize?: FeatureSize & {
        decisionPending: boolean;
    };
    /** Complex iteration Implement only: the newest adjustment request, verbatim and outside the summary budget. */
    adjustmentRequest?: string;
    /** Consolidation and Review: in-place amendments since the last full contract approval. */
    contractAmendments?: ContractAmendmentView[];
    tracker: TrackerStatus;
    completion: {
        available: boolean;
        mcpTool: "empirical_complete" | "empirical_feature_finalize" | "empirical_integrate" | "empirical_deliver" | "empirical_publish";
        cli: string;
        requiredFields: string[];
    };
}
export interface WorktreeProposal {
    kind: "worktree_proposal";
    protocol: "empirical-sdd";
    schemaVersion: typeof SCHEMA_VERSION;
    root: string;
    request: string;
    workflow: Workflow;
    changeType: ChangeType;
    feature: string;
    branch: string;
    path: string;
    base: string;
    baseCommit: string;
    activeFeature: string;
    approvalToken: string;
    iterative?: true;
    localFiles?: WorktreeLocalFiles;
    command: string[];
    requiresApproval: true;
}
export interface WorktreeCreateInput {
    iterative?: boolean;
    request: string;
    workflow: Workflow;
    changeType?: ChangeType;
    feature?: string;
    branch?: string;
    path?: string;
    base?: string;
    baseCommit: string;
    activeFeature: string;
    approvalToken: string;
    approved: true;
    /** The proposal's localFiles, passed back unchanged. */
    localFiles?: {
        mode?: "copy-missing";
        paths?: string[];
        discovered?: string[];
        refused?: LocalFileRefusal[];
    };
}
export interface WorktreePrepareInput {
    source?: string;
    target?: string;
    approvalToken?: string;
    approved?: true;
}
export interface WorktreePreparePreview {
    kind: "worktree_prepare_preview";
    protocol: "empirical-sdd";
    schemaVersion: typeof SCHEMA_VERSION;
    source: string;
    target: string;
    localFiles: {
        paths: string[];
        discovered: string[];
        skippedExisting: string[];
        refused: LocalFileRefusal[];
    };
    approvalToken: string;
    applyInSameTurn: true;
}
export interface WorktreePrepareResult {
    kind: "worktree_prepare_result";
    protocol: "empirical-sdd";
    schemaVersion: typeof SCHEMA_VERSION;
    source: string;
    target: string;
    localFiles: LocalFilesReport;
}
export interface WorktreeHandoff {
    kind: "worktree_handoff";
    protocol: "empirical-sdd";
    schemaVersion: typeof SCHEMA_VERSION;
    root: string;
    path: string;
    branch: string;
    base: string;
    baseCommit: string;
    feature: string;
    revision: number;
    workflow: Workflow;
    continueWithoutApproval: true;
    resume: string;
    localFiles: LocalFilesReport;
    action: ActionPacket;
}
export type FeatureStartResult = ActionPacket | WorktreeProposal;
/** Checkout-local `<git-dir>/empirical-sdd/direct-tracked`; never committed. */
export interface DirectTrackMarker {
    commit: string;
    feature: string;
    trackedAt: string;
    uncommitted: Array<{
        path: string;
        digest: string;
    }>;
}
/** Checkout-local `<git-dir>/empirical-sdd/preferences.json`. */
export interface DirectPreferences {
    defaultMode?: DefaultMode;
}
/** One rebuilt direct change: a commit, or `commit: null` for uncommitted paths. */
export interface DirectEntry {
    commit: string | null;
    subject: string | null;
    paths: string[];
}
export interface DirectInput {
    action: import("./protocol.js").DirectAction;
    revision?: number;
    profile?: Workflow;
    id?: string;
    actor?: string;
}
export interface DirectPauseResult {
    kind: "direct";
    action: "pause";
    feature: string;
    revision: number;
    pause: DirectPause;
}
export interface DirectTrackResult {
    kind: "direct";
    action: "track";
    feature: FeatureStartResult;
    entries: DirectEntry[];
    /** Null when the start rules returned a worktree proposal and nothing started. */
    marker: DirectTrackMarker | null;
}
export type DirectResult = DirectPauseResult | ActionPacket | DirectTrackResult;
export interface SplitDecisionInput {
    revision: number;
    choice: "keep" | "split";
    /** Required for keep. */
    reason?: string;
    actor?: string;
}
export interface SplitDecisionResult {
    kind: "split-decision";
    feature: string;
    revision: number;
    decision: import("./protocol.js").SizeDecision;
    size: FeatureSize;
    guidance: string;
}
export interface DecisionSummary {
    id: string;
    title: string;
    status: "Accepted" | "Superseded";
    chosenApproach: string;
    supersedes: string[];
    supersededBy: string | null;
}
export interface DecisionValidationReport {
    valid: boolean;
    decisions: DecisionSummary[];
    issues: string[];
}
export interface ExplainReport {
    protocol: "empirical-sdd";
    schemaVersion: typeof SCHEMA_VERSION;
    root: string;
    feature: string | null;
    phase: Phase;
    status: WorkflowStatus;
    revision: number;
    rationale: ActionRationale;
    roadmap: Roadmap | null;
    decisions: DecisionSummary[];
    /** Fast only: non-blocking decision record format issues. */
    decisionWarnings?: string[];
    /** In-place amendments since the last full approval, with superseding decisions. */
    contractAmendments?: ContractAmendmentView[];
    tracker: TrackerStatus;
}
export interface ConsultReport {
    protocol: "empirical-sdd";
    schemaVersion: typeof SCHEMA_VERSION;
    root: string;
    feature: string | null;
    phase: Phase;
    /** Every specialist this feature's surface implies. */
    required: string[];
    /** Focused packets for the specialists gated at the current phase. */
    packets: ConsultPacket[];
    /** Advisories required now but missing or structurally invalid. */
    missingPaths: string[];
    blocked: {
        specialist: string;
        finding: ConsultFinding;
    } | null;
}
export interface ExplorationPacket {
    protocol: "empirical-sdd";
    schemaVersion: typeof SCHEMA_VERSION;
    root: string;
    problem: string;
    instructions: string[];
    questions: string[];
    projectContext: string[];
    knowledgeContext: string[];
    capabilityContext: string[];
    next: {
        fast: string;
        complex: string;
    };
}
export type DeltaOperation = "added" | "modified" | "removed";
export interface RequirementDelta {
    operation: DeltaOperation;
    name: string;
    contents: string;
}
export interface CapabilityDelta {
    capability: string;
    purpose: string | null;
    requirements: RequirementDelta[];
    source: string;
}
export interface CapabilitySummary {
    name: string;
    path: string;
    requirements: number;
}
export interface DeltaValidationReport {
    valid: boolean;
    capabilities: string[];
    operations: number;
    issues: string[];
    digest: string | null;
}
export interface ArchiveReport {
    feature: string;
    capabilities: string[];
    added: number;
    modified: number;
    removed: number;
    converged: boolean;
}
export interface ArchiveResult {
    action: ActionPacket;
    report: ArchiveReport;
}
export interface IntegrationInput {
    decisionBy?: string;
    revision: number;
    targetRoot: string;
    actor?: string;
    receiptIds?: string[];
}
export interface IntegrationResult extends ArchiveResult {
    receipt: Record<string, unknown>;
    /** Commands executed or skipped as covered during independent validation in this call. */
    replay?: IntegrationReplayPlan;
}
export interface DeliveryCommitInput {
    branch: string;
    paths: string[];
    message: string;
    title: string;
    body: string;
}
export interface DeliveryInput {
    revision: number;
    source: DeliveryCommitInput;
    evidence: DeliveryCommitInput;
    review?: ReviewSubmission;
    actor?: string;
    receiptIds?: string[];
}
export type DeliveryResult = {
    outcome: "delivered";
    action: ActionPacket;
    receipt: Record<string, unknown>;
} | {
    outcome: "setup-required";
    action: ActionPacket;
    readiness: Extract<BotReviewReadiness, {
        wired: false;
    }>;
} | {
    outcome: "review-required";
    action: ActionPacket;
    stage: "source" | "evidence";
    review: ReviewPacket;
} | {
    outcome: "changes-requested";
    action: ActionPacket;
    stage: "source" | "evidence";
    review: CanonicalReviewResult;
} | {
    /** The source pull request exists, but remote required-check proof has not passed yet. */
    outcome: "promotion-proof-required";
    action: ActionPacket;
    stage: "source";
    pullRequest: {
        number: number;
        url: string;
    };
    reasons: RemoteProofReason[];
    /**
     * `ci` waits for the required checks on the exact head. `local` means remote
     * proof is ineligible under auto: nothing merges until an approved exact local
     * full-CI run at this revision exists, and `approval` names what to ask for.
     */
    route: "ci" | "local";
    approval?: {
        commandId: string;
        estimateMs: number | null;
        revision: number;
    } | null;
};
/** Structured remote-proof refusal; never carries stderr, response bodies or credentials. */
export interface RemoteProofReason {
    code: string;
    check?: string;
    conclusion?: string;
    httpStatus?: number | null;
    endpointTemplate?: string;
    paths?: string[];
}
export interface PublicationInput {
    revision: number;
    authorization: StandingAuthorization;
    packageName: string;
    version: string;
    distTag: string;
    commit: string;
    approved: true;
    actor?: string;
    receiptIds?: string[];
}
export interface PublicationResult {
    action: ActionPacket;
    receipt: Record<string, unknown>;
}
export interface TransitionEvent {
    schemaVersion: typeof SCHEMA_VERSION;
    revision: number;
    previousRevision: number;
    actor: string;
    summary: string;
    createdAt: string;
    state: WorkflowState;
}
export interface IntegrationReport {
    scope: "project" | "global";
    selected: import("./agent-catalog.js").AgentSkillTargetId[];
    destinations: string[];
    created: string[];
    updated: string[];
    removed: string[];
    preserved: string[];
    entrypoints: AgentEntrypointReport[];
    activation: ProjectActivationReport | null;
}
export interface UninstallReport {
    package: "removed";
    integrations: IntegrationReport;
    preserved: {
        projectHistory: true;
        repositoryIntegrations: true;
    };
}
export type AgentIntegrationId = "codex" | "claude" | "cursor" | "gemini" | "windsurf";
export type ProjectActivationSurfaceState = "current" | "missing" | "stale" | "malformed" | "unsafe" | "unmanaged" | "shadowed"
/**
 * Git records the file as a symbolic link, but this checkout materialized it
 * as a regular file (Windows with `core.symlinks=false`). Checkout-local:
 * the repository is fine, and Empirical never writes into the placeholder.
 */
 | "symlink-placeholder";
export type ProjectActivationSurfaceKind = "instruction" | "skill" | "bridge" | "configuration";
export interface ProjectActivationSurface {
    runtime: AgentIntegrationId | "shared";
    kind: ProjectActivationSurfaceKind;
    path: string;
    state: ProjectActivationSurfaceState;
    detail: string | null;
}
export interface RuntimeActivationGuidance {
    runtime: AgentIntegrationId;
    agent: string;
    guidanceVerified: boolean;
    verify: string;
    reload: string;
}
export interface ProjectActivationReport {
    mode: import("./activation.js").ActivationMode;
    artifactReadiness: "current" | "blocked";
    runtimeLoad: "unverified";
    changed: boolean;
    reloadRequired: boolean;
    guidance: RuntimeActivationGuidance[];
}
export interface AgentEntrypointReport {
    id: import("./agent-catalog.js").AgentSkillTargetId;
    agent: string;
    kind: "skill" | "slash-command";
    artifactRoot: string;
    skills: string[];
    invocations: string[];
    reload: string;
    guidanceVerified: boolean;
    projectMcp: boolean;
    handoff: boolean;
}
export type AgentLaunchCapability = "prompt" | "workspace";
export interface DetectedAgent {
    id: AgentIntegrationId;
    agent: string;
    executable: string;
    capability: AgentLaunchCapability;
}
export interface AgentHandoffOption extends DetectedAgent {
    feature: string;
    specification: string;
    cwd: string;
    prompt: string;
    argv: string[];
    approvalToken: string;
}
export interface AgentHandoffOffer {
    kind: "agent_handoff_offer";
    protocol: "empirical-sdd";
    schemaVersion: typeof SCHEMA_VERSION;
    root: string;
    feature: string;
    specification: string;
    choices: ["current", "save", "agent"];
    agents: AgentHandoffOption[];
    requiresApproval: true;
}
export interface AuthorizedAgentHandoff {
    kind: "authorized_agent_handoff";
    protocol: "empirical-sdd";
    schemaVersion: typeof SCHEMA_VERSION;
    root: string;
    feature: string;
    agent: AgentIntegrationId;
    cwd: string;
    argv: string[];
    prompt: string;
}
export interface RepositoryKnowledgeFile {
    path: string;
    /** Git blob id (`git:<oid>`) in a repository, or an LF-normalized sha256 outside Git. */
    digest: string;
}
export interface RepositoryKnowledgeReport {
    root: string;
    status: "created" | "refreshed" | "current" | "stale";
    digest: string;
    files: number;
    truncated: boolean;
    manifest: string;
    context: string[];
    stale: string[];
    missing: string[];
    refinementRequired: string[];
    /** Pages this refresh confirmed by writing a review record under `.empirical/context/reviews/`. */
    reviewed: string[];
    /**
     * Untracked files a page would select. Freshness counts tracked files only,
     * so stage these before refreshing or the committed pages go stale.
     */
    untrackedSources: string[];
}
export interface InitOptions extends ProjectConfigurationInput {
    profile?: Workflow;
    integrations?: boolean;
    tracker?: TrackerSetupChange;
    trackerDependencies?: TrackerDependencies;
}
export interface StartOptions {
    iterative?: boolean;
    profile?: Workflow;
    id?: string;
}
export interface FeatureStartOptions {
    iterative?: boolean;
    id?: string;
}
export interface YoloOptions extends FeatureStartOptions {
    ceiling?: "implemented" | "verified" | "integrated" | "delivered" | "published";
    /** Explicit Fast stays Fast and is limited to the implemented ceiling. */
    profile?: Workflow;
    targetBranch?: string;
    allowExternalAgent?: boolean;
}
export interface ExecuteEvidenceInput {
    /** When present, only commands this profile allows may run. */
    verificationProfile?: VerificationProfile;
    commandId: string;
    criteria: string[];
    evidenceKinds?: EvidenceKind[];
    summary: string;
}
/** A background job request: the qa-execute fields that a snapshot run can honor. */
export interface QaStartInput {
    verificationProfile?: VerificationProfile;
    checkId: string;
    commandId: string;
    criteria: string[];
    summary: string;
    retryOf?: string;
    /** Tracked test files to append to a `testFiles: "changed"` command instead of the changed-file selection. */
    testFiles?: string[];
    /** Set only after the user explicitly said yes in chat to this run; recorded on the job. */
    userApproved?: boolean;
}
export interface QaExecuteInput {
    /** Omitted keeps Complex on `final`; Fast requires an explicit profile. */
    verificationProfile?: VerificationProfile;
    /** Return this immutable receipt only if it exactly covers this request; stale reuse fails closed. */
    reuseReceiptId?: string;
    checkId: string;
    commandId: string;
    criteria: string[];
    summary: string;
    retryOf?: string;
    artifacts?: Array<{
        path: string;
        mediaType: string;
    }>;
    /**
     * Publish only: the explicit publication authorization approves Publish's own
     * full-CI run when it verifies and binds the current commit. Ignored elsewhere.
     */
    publicationAuthorization?: {
        authorization: StandingAuthorization;
        packageName: string;
        version: string;
        distTag: string;
    };
}
/**
 * How the user's yes to a local full-suite run reached Empirical: an MCP form
 * (`elicited`), an agent relaying it because the host shows no form
 * (`agent-relayed`), an interactive CLI prompt (`cli`), CLI `--yes` (`cli-unattended`),
 * or Publish's explicit publication authorization.
 */
export type FullSuiteApprovalConfirmation = "elicited" | "agent-relayed" | "cli" | "cli-unattended" | "publication-authorization";
/**
 * Immutable approval for one fresh local full-CI run, bound to the exact
 * feature, revision, source, policy, command and the estimate that was shown.
 * Any identity change leaves it unmatched; approving never changes state.
 */
export interface FullSuiteApproval {
    schemaVersion: 1;
    id: string;
    feature: string;
    workflowRevision: number;
    gitCommit: string;
    treeDigest: string;
    policyDigest: string;
    commandId: string;
    argvDigest: string;
    estimateMs: number | null;
    route: PromotionRoute;
    /** Present from 1 when an identical approval was already consumed by a run; part of the id. */
    renewal?: number;
    confirmation: FullSuiteApprovalConfirmation;
    /** The publication authorization digest when Publish's authorization approved the run. */
    authorizationDigest: string | null;
    createdAt: string;
    digest: string;
}
/** What must be shown to the user before a full-suite approval: command, revision, estimate and route reasons. */
export interface FullSuiteApprovalRequest {
    commandId: string;
    revision: number;
    estimateMs: number | null;
    route: PromotionRoute;
}
export interface QaApproveInput {
    revision: number;
    commandId: string;
    /** Must equal the command's current estimate as shown to the user (null when unknown). */
    estimateMs: number | null;
    confirmation: Exclude<FullSuiteApprovalConfirmation, "publication-authorization">;
}
export type QaExecutionPhase = "preparing" | "command" | "finalizing" | "reuse";
/** Diagnostic timings for one QA call, separate from immutable evidence. */
export interface QaExecutionProgress {
    commandId: string;
    stage: QaExecutionPhase | "finished" | "failed";
    elapsedMs: number;
    stageElapsedMs: number;
    timeoutMs: number | null;
    commandEstimateMs: number | null;
    commandOutcome: QaAttemptOutcome | null;
    commandExitCode: number | null;
    commandSignal: string | null;
    timings: Record<QaExecutionPhase, number>;
    /** Where the feature stands in its phase order, as the roadmap reports it; absent until known. */
    phase?: {
        phase: string;
        index: number;
        total: number;
    };
    /** Selected repository test files for this command, when the policy exposes them. */
    testFiles?: string[];
}
export interface QaExecutionOptions extends VerificationRuntimeOptions {
    /** Receives bounded metadata only; observer errors do not change execution. */
    onProgress?: (event: QaExecutionProgress) => void | Promise<void>;
}
export interface QaRecordInput {
    checkId: string;
    criteria: string[];
    outcome: QaAttemptOutcome;
    summary: string;
    collector: string;
    retryOf?: string;
    artifacts?: Array<{
        path: string;
        mediaType: string;
    }>;
    /**
     * Repository paths or globs the human assessed. The record then binds only
     * those paths plus global configuration, so an unrelated change leaves it
     * valid at the Verify gate. Omitted binds the whole tree.
     */
    assessedPaths?: string[] | undefined;
}
export interface CollectEvidenceInput {
    criteria: string[];
    evidenceKinds: EvidenceKind[];
    summary: string;
    collector: string;
    artifacts: Array<{
        path: string;
        mediaType: string;
    }>;
}
export interface AdoptionOptions extends ProjectConfigurationInput {
    profile?: Workflow;
    integrations?: boolean;
}
export interface ValidationReport {
    valid: boolean;
    phase: Phase;
    criteria: number;
    missing: string[];
    verification?: VerificationStatus;
    completionLevel?: CompletionReport;
}
/** The exact effect a forced closure would apply, rendered before it is approved. */
export interface FeatureClosePlan {
    pendingPaths?: string[];
    schemaVersion: 1;
    feature: string;
    /** `phase` advances exactly one stage; `feature` terminates the feature. */
    mode: "feature" | "phase";
    revision: number;
    fromPhase: Phase;
    toPhase: Phase;
    /** Null for a forced phase advance, which records no closure. */
    outcome: import("./protocol.js").ClosureOutcome | null;
    /**
     * The completion level the feature ends with. Closure never raises it, except
     * that an observed merge integrates a verified feature waiting on it (`integratesOnMerge`).
     */
    completion: CompletionReport["highest"];
    externalMerge: import("./protocol.js").ExternalMergeFacts | null;
    /** Standard binding: the observed merge of a verified feature waiting in Integrate is its integration. */
    integratesOnMerge?: boolean;
    reason: string;
    effects: string[];
}
export interface FeatureCloseResult {
    finalization?: import("./finalization.js").FeatureFinalization;
    outcome: "planned" | "advanced" | "closed";
    plan: FeatureClosePlan;
    state: WorkflowState;
}
/** One orphan a cleanup would remove, always traced to the Doctor finding that named it. */
export interface CleanupEntry {
    /** The opt-in class this entry belongs to. */
    include: CleanupClass;
    /** The Doctor finding code that reported it. */
    finding: string;
    /** The exact absolute path this entry removes, or null for actions with no single path. */
    path: string | null;
    /** Present only on `forget-recovery`, naming the checkout recovery entry to drop. */
    feature?: string;
    /** Present only on `drop-claim`: the exact claim digest planned, re-checked under its lock. */
    claimDigest?: string;
    action: "remove-file" | "remove-directory" | "prune-worktrees" | "drop-claim" | "forget-recovery";
    detail: string;
}
export type CleanupClass = "locks" | "claims" | "worktrees" | "migration-scratch" | "checkout-recovery";
export interface CleanupPlan {
    schemaVersion: 1;
    root: string;
    include: CleanupClass[];
    entries: CleanupEntry[];
    /** Orphan-looking things deliberately left alone, with the reason. */
    refused: {
        finding: string;
        path: string | null;
        reason: string;
    }[];
    /** Digest of the entries; an approval names it so the applied plan is exactly the previewed one. */
    digest: string;
}
export interface CleanupResult {
    outcome: "planned" | "pruned";
    plan: CleanupPlan;
    removed: CleanupEntry[];
}
export interface FeatureCloseInput {
    decisionBy?: string;
    mode: "feature" | "phase";
    outcome: import("./protocol.js").ClosureOutcome;
    reason: string;
    actor: string;
    confirmation: import("./protocol.js").FeatureClosure["confirmation"];
    pullRequest?: number;
    targetBranch?: string;
    expectedRevision?: number;
    preview?: boolean;
    /** Injected only by tests; production observes the real host. */
    observer?: import("./closure.js").ClosureObserver;
}
export interface CleanupInput {
    include: CleanupClass[];
    preview?: boolean;
    /** The previewed plan's digest; the apply refuses when the current plan differs. */
    planDigest?: string;
}
/**
 * How reconcile treats one unfinished feature: closed as merged-externally,
 * left for the user's explicit close, or left to the checkout that owns it.
 */
export type ReconcileClassification = "closable" | "needs-decision" | "skipped" | "excluded";
/** What happens to the feature's capability claim if it is closed. */
export type ReconcileClaimDisposition = "none" | "release-own" | "left-for-cleanup";
export interface ReconcileCandidate {
    feature: string;
    revision: number;
    phase: Phase;
    status: WorkflowStatus;
    completion: CompletionReport["highest"];
    classification: ReconcileClassification;
    /** The observed merge when one was proven; null otherwise. */
    externalMerge: import("./protocol.js").ExternalMergeFacts | null;
    claim: ReconcileClaimDisposition;
    /** Why the feature has this classification, in plain language. */
    reason: string;
    /** The explicit close a needs-decision feature can take instead. */
    suggestedOutcomes: import("./protocol.js").ClosureOutcome[];
}
export interface ReconcilePlan {
    schemaVersion: 1;
    root: string;
    targetBranch: string;
    /** The ref merges were checked against and its commit when planned. */
    targetRef: string;
    targetCommit: string;
    exclude: string[];
    candidates: ReconcileCandidate[];
    /** Specs whose state could not be read; listed for Doctor, never closed. */
    unreadable: Array<{
        feature: string;
        reason: string;
    }>;
    /** Digest over the target commit, exclusions and every candidate's decision facts. */
    digest: string;
}
export interface ReconcileInput {
    preview?: boolean;
    exclude?: string[];
    planDigest?: string;
    actor: string;
    confirmation: import("./protocol.js").FeatureClosure["confirmation"];
    /** Injected only by tests; production observes the real host. */
    observer?: import("./closure.js").ClosureObserver;
}
export interface ReconcileFeatureResult {
    feature: string;
    outcome: "closed" | "skipped" | "failed";
    reason: string;
}
export interface ReconcileResult {
    outcome: "planned" | "reconciled";
    plan: ReconcilePlan;
    results: ReconcileFeatureResult[];
}
