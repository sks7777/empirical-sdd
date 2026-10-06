import { type ProcessAdapter } from "./runtime.js";
import { type CapabilityBaseSnapshot } from "./specifications.js";
import type { CapabilityDelta, PromotionRoute } from "./types.js";
export interface GitRepositoryIdentity {
    root: string;
    commonDirectory: string;
    headCommit: string;
    headTree: string;
    /** Derived from the repository's lineage, so every clone of it agrees. */
    repositoryId: string;
    /** The pre-lineage identity, derived from this copy's git directory path. */
    pathRepositoryId: string;
    /** Identifies one working copy, and is deliberately local to its machine. */
    worktreeId: string;
    /**
     * Every repository id a durable artifact of this repository may carry: the
     * lineage identity, this copy's own pre-lineage path identity, and any prior
     * identity the repository has recorded as its own.
     */
    acceptedRepositoryIds: string[];
}
export type CapabilityClaim = import("./types.js").PortableCapabilityBase;
export interface ClaimInspection {
    active: CapabilityClaim[];
    stale: CapabilityClaim[];
    integrated: CapabilityClaim[];
}
export interface ClaimHealthInspection extends ClaimInspection {
    invalid: Array<{
        path: string;
        error: string;
    }>;
}
export interface IntegrationReceipt {
    schemaVersion: 1;
    feature: string;
    claimId: string;
    repositoryId: string;
    baseCommit: string;
    baseTree: string;
    featureTree: string;
    targetCommit: string;
    targetTree: string;
    capabilityBaseDigests: Record<string, string>;
    deltaDigest: string;
    resultDigests: Record<string, string>;
    verificationReceiptDigests: string[];
    /** Absent on receipts recorded before promotion routes existed. */
    promotionRoute?: PromotionRoute;
    integratedAt: string;
    digest: string;
}
export interface NonBehavioralIntegrationReceipt {
    schemaVersion: 1;
    classification: "non-behavioral";
    feature: string;
    claimId: null;
    repositoryId: string;
    featureTree: string;
    targetCommit: string;
    targetTree: string;
    verificationReceiptDigests: string[];
    promotionRoute?: PromotionRoute;
    integratedAt: string;
    digest: string;
}
export type StoredIntegrationReceipt = IntegrationReceipt | NonBehavioralIntegrationReceipt;
/**
 * A repository's own record of the identities it has been known by.
 *
 * Identity used to be the absolute path of a copy's git directory, so durable
 * artifacts — receipts, claims — carry whichever machine's path wrote them, and
 * no other machine can recompute it. This file is how a repository states, in
 * its own committed history and under review, that those earlier identities were
 * its own. It never widens acceptance to another repository: the record is only
 * honoured when it names the lineage identity of the repository reading it.
 */
export interface RepositoryIdentityContinuity {
    schemaVersion: 1;
    repositoryId: string;
    priorRepositoryIds: string[];
    recordedAt: string;
    reason: string;
}
export declare function identityContinuityPath(root: string): string;
export declare function readRepositoryIdentityContinuity(root: string): Promise<RepositoryIdentityContinuity | null>;
/**
 * Whether two checkouts share one Git directory (linked worktrees). Locks,
 * claims and transfer intents live in that directory, so operations that rely
 * on them require it; a separate clone with the same lineage does not qualify.
 */
export declare function sharesGitDirectory(a: GitRepositoryIdentity, b: GitRepositoryIdentity): boolean;
export declare function resolveGitRepositoryIdentity(root: string, adapter?: ProcessAdapter): Promise<GitRepositoryIdentity>;
export declare function coordinationDirectory(identity: GitRepositoryIdentity): string;
/** Behavioral and non-behavioral validation share the exact target lease. */
export declare function withIntegrationTargetLock<T>(root: string, targetRoot: string, operation: (target: GitRepositoryIdentity) => Promise<T>, adapter?: ProcessAdapter): Promise<T>;
export declare function inspectCapabilityClaims(root: string, adapter?: ProcessAdapter): Promise<ClaimInspection>;
/** Inventory every malformed record without losing valid sibling diagnostics. */
export declare function inspectCapabilityClaimHealth(root: string, adapter?: ProcessAdapter): Promise<ClaimHealthInspection>;
/** Normal workflow operations address one claim; Doctor deliberately scans all. */
export declare function readCapabilityClaim(root: string, id: string, adapter?: ProcessAdapter): Promise<CapabilityClaim>;
/** Validate portable comparison data without treating its old path as local ownership. */
export declare function portableCapabilityBase(claim: CapabilityClaim): CapabilityClaim;
/** Restore only a missing claim from the comparison data committed with the approved spec. */
export declare function recoverPortableCapabilityClaim(root: string, feature: string, id: string, saved: CapabilityClaim): Promise<CapabilityClaim>;
export declare function transferCapabilityClaim(input: {
    root: string;
    claimId: string;
    expectedDigest: string;
    targetRoot: string;
    now?: () => Date;
}): Promise<CapabilityClaim>;
/**
 * Release this checkout's active claim for a feature closed without
 * integration, under the claim's coordination lock. Returns the released claim
 * so a failed closure can reinstate it, or null when there is nothing to release.
 */
export declare function releaseCapabilityClaim(root: string, id: string, feature: string): Promise<CapabilityClaim | null>;
/** Put back a claim a failed closure released, only while nothing replaced it. */
export declare function reinstateCapabilityClaim(root: string, claim: CapabilityClaim): Promise<void>;
/** Drop a stale claim under its lock, only while it is still the exact claim that was planned. */
export declare function dropStaleCapabilityClaim(root: string, id: string, expectedDigest: string): Promise<boolean>;
/** Restore an exact pre-transfer claim only while its replacement is unchanged. */
export declare function restoreCapabilityClaim(root: string, previous: CapabilityClaim, expectedDigest: string): Promise<void>;
export declare function captureCapabilityBases(input: {
    root: string;
    feature: string;
    deltas: CapabilityDelta[];
}): Promise<Record<string, CapabilityBaseSnapshot>>;
export declare function claimCapabilities(input: {
    root: string;
    feature: string;
    bases: Record<string, CapabilityBaseSnapshot>;
    now?: () => Date;
    adapter?: ProcessAdapter;
}): Promise<{
    claim: CapabilityClaim;
    stale: CapabilityClaim[];
    converged: boolean;
}>;
/** Expand/revise touched requirements while keeping the feature's original comparison commit. */
export declare function reviseCapabilityClaim(input: {
    root: string;
    feature: string;
    claimId: string;
    deltas: CapabilityDelta[];
}): Promise<CapabilityClaim>;
export declare function refreshCapabilityClaim(input: {
    root: string;
    claimId: string;
    now?: () => Date;
    adapter?: ProcessAdapter;
}): Promise<CapabilityClaim>;
export interface IntegrationValidationResult {
    featureTree: string;
    verificationReceiptDigests: string[];
    /** The promotion route Integrate used; recorded so Deliver can report it. */
    promotionRoute?: PromotionRoute;
}
export type IntegrationValidator = (targetRoot: string, candidates: ReadonlyArray<{
    capability: string;
    next: string;
    resultDigest: string;
}>) => Promise<IntegrationValidationResult>;
export declare function integrateCapabilities(input: {
    root: string;
    targetRoot: string;
    feature: string;
    claimId: string;
    validator: IntegrationValidator;
    now?: () => Date;
    adapter?: ProcessAdapter;
}): Promise<IntegrationReceipt>;
export declare function verifyIntegrationReceipt(receipt: IntegrationReceipt): void;
export declare function verifyStoredIntegrationReceipt(receipt: unknown): asserts receipt is StoredIntegrationReceipt;
export declare function commonCoordinationPath(root: string, adapter?: ProcessAdapter): Promise<string>;
