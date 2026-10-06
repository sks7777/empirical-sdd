import { type CollectedReceipt, type Criterion, type EvidenceReceipt, type ExecutedReceipt, type ArtifactRecord, type QaReceipt } from "./protocol.js";
import type { RuntimeResult } from "./runtime.js";
import { qaCommandChecks } from "./qa.js";
export interface ReceiptProvenanceInput {
    repositoryId: string;
    feature: string;
    specRevision: number;
    specDigest: string;
    treeDigest: string;
    policyDigest: string;
    workflowRevision?: number;
    matrixDigest?: string;
}
export declare function createExecutedReceipt(input: {
    criteria: string[];
    evidenceKinds?: Array<"test" | "browser" | "screenshot" | "review" | "human">;
    summary: string;
    provenance: ReceiptProvenanceInput;
    result: RuntimeResult;
}): ExecutedReceipt;
export declare function createCollectedReceipt(input: {
    root: string;
    criteria: string[];
    evidenceKinds?: Array<"test" | "browser" | "screenshot" | "review" | "human">;
    summary: string;
    collector: string;
    provenance: ReceiptProvenanceInput;
    artifacts: Array<{
        path: string;
        mediaType: string;
    }>;
    now?: () => Date;
}): Promise<CollectedReceipt>;
export declare function collectArtifactRecords(root: string, items: Array<{
    path: string;
    mediaType: string;
}>): Promise<ArtifactRecord[]>;
export declare function appendReceipt(path: string, receipt: EvidenceReceipt): Promise<void>;
export interface ReceiptValidationContext {
    root: string;
    repositoryId: string;
    /**
     * Every repository id a receipt of this repository may carry, including the
     * path-derived ones recorded before identity became portable. Absent, only
     * `repositoryId` is accepted.
     */
    acceptedRepositoryIds?: readonly string[];
    feature: string;
    criteria: Criterion[];
    specRevision: number;
    specDigest: string;
    treeDigest: string;
    policyDigest: string;
    workflowRevision?: number;
    matrixDigest?: string;
    /**
     * Verify-gate reads only: an eligible QA receipt with a declared scope stays
     * valid while its scoped digest matches, even if the whole tree changed, and
     * any QA receipt below full CI survives a line-ending-only change.
     */
    scopedQa?: boolean;
    /** The current policy's declared command scopes; a recorded scope must still match one. */
    commandScopes?: ReadonlyArray<{
        argv: readonly string[];
        cwd: string;
        scope: readonly string[] | "workspace";
    }>;
    /**
     * Only the Verify phase itself: a human record bound to assessed paths may
     * survive outside them. Carried into later phases it needs the exact tree.
     */
    humanScopedQa?: boolean;
    /**
     * Standard binding: a review receipt follows its review. The caller has
     * proved (or proves next) that reviewed source and project inputs are
     * unchanged since the reviewed commit, so the whole-tree digest is not
     * compared for review evidence; spec and policy digests still are.
     */
    reviewFollowsSource?: boolean;
}
export declare function validateReceipt(input: unknown, context: ReceiptValidationContext): Promise<EvidenceReceipt>;
export declare function readAndValidateReceipt(path: string, context: ReceiptValidationContext): Promise<EvidenceReceipt>;
export declare function receiptDirectoryForFeature(featureDir: string): string;
export declare function receiptPath(featureDir: string, receipt: EvidenceReceipt): string;
export declare function receiptParent(path: string): string;
/**
 * An executed receipt's recorded scope must equal what a current policy command
 * with the same cwd and argv prefix declares, including its kind. A receipt
 * edited to a narrower scope, or to drop `scopeSource`, fails closed.
 */
export declare function recordedScopeMatchesPolicy(receipt: QaReceipt, command: {
    argv: readonly string[];
    cwd: string;
}, commandScopes: ReceiptValidationContext["commandScopes"]): boolean;
/**
 * Content with CRLF line endings normalized to LF for text files (no NUL byte
 * in the first 8,000 bytes, Git's binary heuristic). Binary content is exact.
 */
export declare function lineEndingNormalized(bytes: Uint8Array, path?: string): Uint8Array;
/** Whether every scope entry matches at least one current tree candidate. */
export declare function everyScopeEntryMatchesTree(rootInput: string, scope: readonly string[]): Promise<boolean>;
export declare function repositoryTreeDigest(rootInput: string): Promise<string>;
/** Completion also binds executable modes, symlink targets and submodule commits. */
export declare function finalizationSourceDigest(rootInput: string): Promise<string>;
/**
 * The exact tree digest and, from the same read, the digest with text-file
 * line endings normalized (see lineEndingNormalized).
 */
export declare function repositoryTreeDigests(rootInput: string): Promise<{
    tree: string;
    text: string;
}>;
export interface ScopedDigestInput {
    /** Normalized declared scope (see normalizeCommandScope). */
    scope: readonly string[];
    /** Present when the scope was derived from the workspace package graph. */
    scopeSource?: "workspace";
    /** The recorded command argv and cwd: argv-named paths and the cwd manifest are always bound. */
    argv: readonly string[];
    cwd: string;
}
/**
 * Content digest of every tree candidate under the declared scope plus the
 * global configuration a command trusts: policy, package manifests, lockfiles,
 * test-runner/compiler/toolchain configuration, `patches/`, workflows,
 * composite actions, `.gitmodules`, argv-named paths (and anything below them),
 * task-runner manifests, the root and cwd configuration files, and the resolved
 * in-repository target of every bound symbolic link. It is null (whole-tree
 * binding only) when a bound link cannot be resolved safely. Deletions, renames
 * and any symbolic link or gitlink anywhere change it; order and separators are
 * platform-independent. It reuses the tree digest's candidate inventory.
 */
export declare function repositoryScopeDigest(rootInput: string, input: ScopedDigestInput): Promise<string | null>;
/**
 * Whether a QA receipt may be bound by its scope instead of the whole tree:
 * executed Verify-gate evidence with a policy-declared scope, or a pure human
 * record bound to its assessed paths, never covering full CI. Anything else
 * fails closed to whole-tree comparison.
 */
export declare function scopedQaReceiptEligible(receipt: EvidenceReceipt): receipt is QaReceipt & {
    provenance: QaReceipt["provenance"] & {
        scope: string[];
        scopeDigest: string;
    };
};
/** The current scoped digest for a scoped QA receipt's recorded scope and latest command. */
export declare function currentReceiptScopeDigest(root: string, receipt: QaReceipt): Promise<string | null>;
/** A resolved receipt scope, or why a declared workspace scope fell back to the whole tree. */
export type ReceiptScopeResolution = {
    scope: string[];
    scopeSource?: "workspace";
} | {
    unresolved: string;
};
/**
 * The scope derived from the workspace package graph for an exact argv and cwd:
 * the target package plus its transitive workspace dependencies, normalized and
 * sorted. Any ambiguity yields an unresolved reason (whole-tree binding).
 */
export declare function resolveWorkspaceScope(rootInput: string, argv: readonly string[], cwd: string): Promise<ReceiptScopeResolution>;
/**
 * The scope a policy command declares for its QA receipts for an exact argv,
 * or undefined for whole-tree binding. Workspace scopes resolve against the
 * current workspace graph.
 */
export declare function commandReceiptScope(root: string, command: Parameters<typeof qaCommandChecks>[0], argv: readonly string[]): Promise<ReceiptScopeResolution | undefined>;
