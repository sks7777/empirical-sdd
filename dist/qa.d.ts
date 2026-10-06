import { z } from "zod";
import { type ArtifactRecord, type ImpactManifest, type QaAttempt, type QaAttemptOutcome, type QaCheckKind, type QaReceipt, type RiskFloor, type VerificationProfile } from "./protocol.js";
import type { Criterion, EvidenceKind, FullSuiteApproval, FullSuiteApprovalConfirmation, ProjectPolicy, PromotionRoute, VerificationCheck, VerificationMatrix, VerificationSelectionEntry, Workflow } from "./types.js";
interface QaRuntimeResult {
    executableDigest?: string;
    runtimeDigest?: string;
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
export declare const verificationMatrixSchema: z.ZodObject<{
    schemaVersion: z.ZodLiteral<1>;
    feature: z.ZodString;
    riskFloor: z.ZodEnum<{
        behavioral: "behavioral";
        "contract-neutral": "contract-neutral";
        delivery: "delivery";
        integration: "integration";
        migration: "migration";
        publication: "publication";
        sensitive: "sensitive";
    }>;
    specRevision: z.ZodNumber;
    specDigest: z.ZodString;
    impactDigest: z.ZodString;
    policyDigest: z.ZodString;
    capabilities: z.ZodArray<z.ZodString>;
    surfaces: z.ZodArray<z.ZodString>;
    checks: z.ZodArray<z.ZodObject<{
        id: z.ZodString;
        kind: z.ZodEnum<{
            "adapter-contract": "adapter-contract";
            "clean-clone": "clean-clone";
            "cross-platform": "cross-platform";
            "end-to-end": "end-to-end";
            "fault-injection": "fault-injection";
            "fresh-context": "fresh-context";
            "full-ci": "full-ci";
            integration: "integration";
            "live-acceptance": "live-acceptance";
            "package-consumer": "package-consumer";
            unit: "unit";
        }>;
        gate: z.ZodEnum<{
            promotion: "promotion";
            verify: "verify";
        }>;
        evidenceMode: z.ZodEnum<{
            automated: "automated";
            either: "either";
            human: "human";
        }>;
        criteria: z.ZodArray<z.ZodString>;
        commandIds: z.ZodArray<z.ZodString>;
        platforms: z.ZodArray<z.ZodString>;
        environments: z.ZodArray<z.ZodString>;
        reasons: z.ZodArray<z.ZodString>;
    }, z.core.$strict>>;
    coverage: z.ZodArray<z.ZodObject<{
        criterionId: z.ZodString;
        checkIds: z.ZodArray<z.ZodString>;
        evidenceModes: z.ZodArray<z.ZodEnum<{
            automated: "automated";
            either: "either";
            human: "human";
        }>>;
    }, z.core.$strict>>;
    uncoveredCriteria: z.ZodArray<z.ZodString>;
    notApplicable: z.ZodOptional<z.ZodArray<z.ZodObject<{
        check: z.ZodEnum<{
            "clean-clone": "clean-clone";
            "cross-platform": "cross-platform";
            "package-consumer": "package-consumer";
        }>;
        reason: z.ZodString;
    }, z.core.$strict>>>;
    freshContext: z.ZodObject<{
        criteria: z.ZodArray<z.ZodObject<{
            id: z.ZodString;
            text: z.ZodString;
        }, z.core.$strict>>;
        surfaces: z.ZodArray<z.ZodString>;
        allowedArtifacts: z.ZodArray<z.ZodString>;
        excludes: z.ZodArray<z.ZodString>;
    }, z.core.$strict>;
    digest: z.ZodString;
}, z.core.$strict>;
export interface BuildVerificationMatrixInput {
    feature: string;
    criteria: Criterion[];
    riskFloor: RiskFloor;
    specRevision: number;
    specDigest: string;
    impact: ImpactManifest;
    policy: ProjectPolicy;
    policyDigest?: string;
}
export declare function qaCommandChecks(command: ProjectPolicy["verification"]["commands"][number]): QaCheckKind[];
type PolicyCommand = ProjectPolicy["verification"]["commands"][number];
export interface IntegrationReplayPlan {
    executed: string[];
    /** Commands left out because the Verify selection's commands cover every check they declare. */
    covered: Array<{
        id: string;
        coveredBy: string;
    }>;
    /** Commands left out that the selection does not cover, with the reason. */
    notSelected: Array<{
        id: string;
        reason: string;
    }>;
    changedFiles: string[];
    /** False when the feature changed verification configuration, forcing every bare command. */
    coverage: boolean;
    /** Present when nothing can run: full CI is proven by the promotion route instead. */
    note?: string;
}
/** The replay note for a policy whose only verification commands are full CI. */
export declare const FULL_CI_ONLY_REPLAY_NOTE = "No non-full-CI verification command is configured; full CI is proven by the promotion route (an exact local receipt or pull-request CI), never replayed.";
/**
 * Commands to execute during independent integration. A full-CI command never
 * runs here, on either promotion route. With coverage, only the Verify
 * selection's commands run, in policy order; a command left out is `covered`
 * when the selected commands cover every check it declares, and `notSelected`
 * with its reason otherwise. Callers disable coverage when the feature changed
 * the verification configuration, which runs every bare non-full-CI command
 * instead. Changed commands require explicitly resolved file arguments;
 * their bare argv must never run, even in a changed-only policy.
 */
export declare function integrationReplayCommands(policy: ProjectPolicy, matrix: VerificationMatrix | null, selection: readonly VerificationSelectionEntry[], options: {
    coverage: boolean;
    changedArgv?: Readonly<Record<string, string[]>>;
}): {
    run: PolicyCommand[];
    plan: IntegrationReplayPlan;
};
/**
 * @deprecated Since the Verify selection replaced it, Integrate uses
 * integrationReplayCommands and never executes full CI. Kept for callers of the
 * 0.36 export: a replayed full-CI command in the same cwd makes another command
 * redundant when it declares all of that command's checks.
 */
export declare function integrationReplayPlan(commands: readonly PolicyCommand[], options?: {
    coverage: boolean;
}): {
    run: PolicyCommand[];
    plan: IntegrationReplayPlan;
};
/** Digest of the verification configuration that replay coverage trusts. */
export declare function verificationConfigurationDigest(root: string, policy: ProjectPolicy): Promise<string>;
/**
 * Repository-relative files a declared full-CI command other than `bun run ci`
 * trusts: the task-runner manifests in its cwd and every relative argv token
 * that names a path. Missing files still count, so adding one is a change.
 */
export declare function fullCiRunnerFiles(commands: readonly PolicyCommand[]): string[];
/**
 * Repository-relative files one command may execute or read by name: the
 * task-runner manifests in its cwd and every relative argv token naming a path.
 */
export declare function commandRunnerFiles(command: Pick<PolicyCommand, "argv" | "cwd">): string[];
/** The `scripts` of a package manifest; absent manifests are null and malformed ones compare by raw text. */
export declare function packageScriptsValue(text: string | null): unknown;
/** Git reads for remote-proof eligibility; any failure fails closed. */
export declare class PromotionGitError extends Error {
}
/**
 * Paths between `base` and `head` that force a local full-CI receipt under
 * remote-checks: policy, package scripts, workflows, composite actions,
 * scripts, lockfiles, `.gitmodules`, and any symlink or gitlink entry.
 * Paths compare case-insensitively, which only over-matches.
 */
export declare function promotionConfigurationChanges(root: string, base: string, head: string, 
/** Extra exact paths (e.g. `fullCiRunnerFiles`) whose change also forces local proof. */
trustedFiles?: readonly string[]): string[];
/**
 * `uses:` references in workflows and composite actions at `commit` whose
 * content can change outside the candidate diff: tags, branches, short SHAs,
 * unpinned Docker images, unparsable values, and local actions outside
 * `.github/actions/` and `.github/workflows/`.
 */
export declare function mutableWorkflowReferences(root: string, commit: string): Array<{
    path: string;
    reference: string;
}>;
export declare function buildVerificationMatrix(input: BuildVerificationMatrixInput): VerificationMatrix;
/**
 * Whether an explicit verification profile may execute a configured command.
 * Profiles filter executability only; they never change a matrix or its digest.
 */
export declare function verificationProfileDecision(workflow: Workflow, profile: VerificationProfile, command: PolicyCommand): {
    allowed: true;
} | {
    allowed: false;
    reason: string;
};
/**
 * Optional Fast evidence matrix for explicit profile requests: one Verify-gate
 * check per kind declared by non-full-CI commands and no promotion check. Fast
 * completion never requires it, so its receipts cannot make Fast verified.
 */
export declare function buildFastVerificationMatrix(input: Omit<BuildVerificationMatrixInput, "impact"> & {
    impact: Pick<ImpactManifest, "capabilities" | "surfaces" | "digest">;
}): VerificationMatrix;
/**
 * The Verify selection: exactly one command per automated Verify-gate check,
 * chosen as the minimum-cost cover over non-full-CI candidates (fewest unknown
 * estimates, then lowest summed estimate, then fewest commands, then earliest
 * policy order). Changed-file commands are candidates only when a changed test
 * file matches. Pure: equal inputs produce byte-identical selections, and gates
 * never read it.
 */
export declare function selectVerificationCommands(input: {
    matrix: VerificationMatrix;
    policy: ProjectPolicy;
    commandEstimates: Readonly<Record<string, number | null>>;
    changedTestsAvailable: boolean;
    /** When supplied, each command uses its own passing-run baseline. */
    changedTestsAvailableByCommand?: Readonly<Record<string, boolean>>;
    preferChanged?: boolean;
}): VerificationSelectionEntry[];
export declare function verifyVerificationMatrix(value: VerificationMatrix): void;
export interface QaReceiptProvenance {
    repositoryId: string;
    feature: string;
    specRevision: number;
    specDigest: string;
    treeDigest: string;
    policyDigest: string;
    workflowRevision: number;
    gitCommit: string;
}
export declare function platformRecord(): QaReceipt["platform"];
export declare function qaOutcome(result: QaRuntimeResult): QaAttemptOutcome;
export declare function qaRuntimeAttempt(input: {
    number: number;
    summary: string;
    result: QaRuntimeResult;
    cleanStart: boolean;
    sourceTreeBefore: string;
    sourceTreeAfter: string;
    artifacts?: ArtifactRecord[];
}): QaAttempt;
export declare function qaRecordedAttempt(input: {
    number: number;
    outcome: QaAttemptOutcome;
    summary: string;
    collector: string;
    cleanStart: boolean;
    sourceTree: string;
    artifacts?: ArtifactRecord[];
    now?: Date;
}): QaAttempt;
export declare function createQaReceipt(input: {
    testSelection?: QaReceipt["testSelection"];
    criteria: string[];
    evidenceKinds: EvidenceKind[];
    summary: string;
    provenance: QaReceiptProvenance;
    matrix: VerificationMatrix;
    check: VerificationCheck;
    coveredChecks: QaCheckKind[];
    attempts: QaAttempt[];
    platform?: QaReceipt["platform"];
}): QaReceipt;
export declare function verifyQaReceipt(receipt: QaReceipt, matrix?: VerificationMatrix): void;
export declare function missingQaChecks(matrix: VerificationMatrix, receipts: readonly QaReceipt[], gate: "verify" | "promotion", reviewReceiptId?: string | null): string[];
export interface PromotionIdentity {
    repositoryId: string;
    /**
     * Every repository id a receipt of this repository may carry, including the
     * path-derived ones recorded before identity became portable. Absent, only
     * `repositoryId` is accepted.
     */
    acceptedRepositoryIds?: readonly string[];
    feature: string;
    workflowRevision: number;
    gitCommit: string;
    treeDigest: string;
    specRevision: number;
    specDigest: string;
    policyDigest: string;
    matrix: VerificationMatrix;
}
/**
 * The first reason a full-CI receipt cannot prove this promotion candidate, or
 * null when it can. Carry-over disables only the workflow-revision identity.
 */
/**
 * The provenance a reuse comparison binds. Strict binding keeps everything;
 * standard binding drops the commit and workflow revision, which change with
 * every `.empirical/`-only commit, and keeps the tree, spec, policy and scope.
 */
export declare function bindingProvenance<T extends {
    gitCommit?: unknown;
    workflowRevision?: unknown;
}>(provenance: T, strict: boolean): Omit<T, "gitCommit" | "workflowRevision"> | T;
export declare function promotionReceiptMismatch(receipt: QaReceipt, expected: PromotionIdentity, options: {
    workflowRevision: boolean;
    gitCommit?: boolean;
}): string | null;
export declare function selectExactPromotionReceipt(input: {
    matrix: VerificationMatrix;
    receipts: readonly QaReceipt[];
    repositoryId: string;
    acceptedRepositoryIds?: readonly string[];
    feature: string;
    workflowRevision: number;
    gitCommit: string;
    treeDigest: string;
    specRevision: number;
    specDigest: string;
    policyDigest: string;
    /** Strict binding also requires the exact revision and commit. */
    strict?: boolean;
}): QaReceipt;
/** The identity a local full-suite approval binds; any difference leaves it unmatched. */
export type FullSuiteApprovalIdentity = Pick<FullSuiteApproval, "feature" | "workflowRevision" | "gitCommit" | "treeDigest" | "policyDigest" | "commandId" | "argvDigest" | "estimateMs">;
/**
 * A content-addressed approval record. The id covers the identity, route and
 * authorization digest but not the time or how the yes was confirmed.
 */
export declare function createFullSuiteApproval(input: FullSuiteApprovalIdentity & {
    route: PromotionRoute;
    confirmation: FullSuiteApprovalConfirmation;
    authorizationDigest: string | null;
    /** Omitted or 0 for the first approval of an identity; each consumed run needs the next. */
    renewal?: number;
    now?: Date;
}): FullSuiteApproval;
/** Parses an approval record and checks its digest and content-addressed id. */
export declare function verifyFullSuiteApproval(value: unknown): FullSuiteApproval;
/** Whether an approval authorizes this exact run; publication authorization skips only the estimate. */
export declare function fullSuiteApprovalMatches(approval: FullSuiteApproval, identity: FullSuiteApprovalIdentity, options?: {
    estimate?: boolean;
    strict?: boolean;
}): boolean;
export declare function sourceCheckoutChanges(root: string): string[];
export declare function isSourceCheckoutClean(root: string): boolean;
export declare function parseQaCheckKind(value: unknown): QaCheckKind;
export declare function parseQaAttemptOutcome(value: unknown): QaAttemptOutcome;
export declare function parseArtifactRecords(value: unknown): ArtifactRecord[];
export {};
