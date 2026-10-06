declare const CANONICAL_REPOSITORY = "goempirical/empirical-sdd";
declare const CANONICAL_PACKAGE = "empirical-sdd";
export interface SemanticVersion {
    major: number;
    minor: number;
    patch: number;
    raw: string;
}
export type VersionTransition = "patch" | "minor";
export type MigrationDisposition = "none" | "actionable";
export interface ReleaseNotes {
    version: string;
    previousVersion: string;
    date: string;
    body: string;
    digest: string;
    migration: MigrationDisposition;
    categories: string[];
}
export interface ReleaseCandidateBody {
    schemaVersion: 1;
    repository: typeof CANONICAL_REPOSITORY;
    packageName: typeof CANONICAL_PACKAGE;
    version: string;
    previousVersion: string;
    transition: VersionTransition;
    tag: string;
    distTag: "latest";
    commit: string;
    pullRequest: number;
    releaseDate: string;
    releaseNotes: string;
    notesDigest: string;
    packageIntegrity: string;
    stateSchemaVersion: number;
    previousStateSchemaVersion: number;
    migration: MigrationDisposition;
}
export interface ReleaseCandidate extends ReleaseCandidateBody {
    digest: string;
}
export interface CreateReleaseCandidateInput {
    repository: string;
    packageName: string;
    packageVersion: string;
    productVersion: string;
    previousVersion: string;
    commit: string;
    pullRequest: number;
    expectedDate: string;
    changelog: string;
    packageIntegrity: string;
    stateSchemaVersion: number;
    previousStateSchemaVersion: number;
}
export interface ReleasePullRequest {
    number: number;
    repository: string;
    headRepository: string;
    baseRef: string;
    headRef: string;
    baseSha: string;
    headSha: string;
    mergeCommit: string | null;
    merged: boolean;
    reviewDecision: "APPROVED" | "CHANGES_REQUESTED" | "REVIEW_REQUIRED" | null;
    protectedRef: boolean;
}
export type ReleaseAuthorizationStage = "candidate" | "merged";
export interface ValidateReleaseAuthorizationInput {
    stage: ReleaseAuthorizationStage;
    pullRequest: ReleasePullRequest;
    checkoutCommit: string;
    checkoutParents: string[];
    breakGlass?: BreakGlassAuthorizationEvidence;
}
export interface BreakGlassAuthorizationBody {
    schemaVersion: 1;
    repository: typeof CANONICAL_REPOSITORY;
    pullRequest: number;
    mergeCommit: string;
    version: string;
    packageIntegrity: string;
    actor: string;
    incident: string;
    justification: string;
    issuedAt: string;
    expiresAt: string;
    nonce: string;
}
export interface BreakGlassAuthorization extends BreakGlassAuthorizationBody {
    digest: string;
}
export interface BreakGlassAuthorizationEvidence {
    authorization: BreakGlassAuthorization;
    policyEnabled: boolean;
    environmentApproved: boolean;
    actorPermission: "ADMIN";
    incidentOpen: boolean;
    requiredChecksPassed: boolean;
    actor: string;
    candidateVersion: string;
    packageIntegrity: string;
    now: string;
}
export interface CreateBreakGlassAuthorizationInput {
    repository: string;
    pullRequest: number;
    mergeCommit: string;
    version: string;
    packageIntegrity: string;
    actor: string;
    incident: string;
    justification: string;
    issuedAt: string;
    expiresAt: string;
    nonce: string;
}
export type RemoteFact<T> = {
    state: "absent";
} | {
    state: "present";
    value: T;
} | {
    state: "unknown";
    reason: string;
};
export interface GitHubReleaseFact {
    tag: string;
    title: string;
    body: string;
    draft: boolean;
    prerelease: boolean;
}
export interface NpmVersionFact {
    version: string;
    integrity: string;
    provenance: boolean;
}
export interface ReleaseObservation {
    tag: RemoteFact<string>;
    release: RemoteFact<GitHubReleaseFact>;
    npm: RemoteFact<NpmVersionFact>;
    latest: RemoteFact<string>;
}
export type ReleaseAction = "create-tag" | "create-release" | "publish-npm";
export interface ReleasePlanBody {
    schemaVersion: 1;
    candidateDigest: string;
    actions: ReleaseAction[];
    converged: boolean;
    existing: Array<"tag" | "release" | "npm" | "latest">;
}
export interface ReleasePlan extends ReleasePlanBody {
    digest: string;
}
export type ReleaseEffectStatus = "existing" | "created" | "not-attempted";
export interface ReleaseReportBody {
    schemaVersion: 1;
    candidateDigest: string;
    planDigest: string;
    tag: ReleaseEffectStatus;
    release: ReleaseEffectStatus;
    npm: ReleaseEffectStatus;
    latest: ReleaseEffectStatus;
    converged: boolean;
}
export interface ReleaseReport extends ReleaseReportBody {
    digest: string;
}
export interface ReleaseEffectAdapter {
    observe(candidate: ReleaseCandidate): Promise<ReleaseObservation>;
    createTag(candidate: ReleaseCandidate): Promise<void>;
    createRelease(candidate: ReleaseCandidate): Promise<void>;
    publishNpm(candidate: ReleaseCandidate): Promise<void>;
}
export declare class ReleaseConflictError extends Error {
    constructor(message: string);
}
export declare class ReleaseObservationError extends Error {
    constructor(message: string);
}
export declare class ReleaseExecutionError extends Error {
    readonly report: ReleaseReport;
    constructor(message: string, report: ReleaseReport, options?: ErrorOptions);
}
export declare function parseSemanticVersion(value: string): SemanticVersion;
export declare function classifyVersionTransition(previousValue: string, nextValue: string): VersionTransition;
export declare function extractReleaseNotes(input: {
    changelog: string;
    version: string;
    previousVersion: string;
    expectedDate: string;
    stateSchemaVersion: number;
    previousStateSchemaVersion: number;
}): ReleaseNotes;
export declare function createReleaseCandidate(input: CreateReleaseCandidateInput): ReleaseCandidate;
export declare function verifyReleaseCandidate(candidate: ReleaseCandidate): void;
export declare function createBreakGlassAuthorization(input: CreateBreakGlassAuthorizationInput): BreakGlassAuthorization;
export declare function parseBreakGlassAuthorization(value: unknown): BreakGlassAuthorization;
export declare function verifyBreakGlassEvidence(evidence: BreakGlassAuthorizationEvidence): void;
export declare function validateReleaseAuthorization(input: ValidateReleaseAuthorizationInput): void;
export declare function createReleasePlan(candidate: ReleaseCandidate, observation: ReleaseObservation): ReleasePlan;
export declare function assertFreshReleasePlan(plan: ReleasePlan): void;
export declare function verifyReleasePlan(plan: ReleasePlan): void;
export declare function reconcileRelease(candidate: ReleaseCandidate, adapter: ReleaseEffectAdapter): Promise<ReleaseReport>;
export declare function verifyReleaseReport(report: ReleaseReport): void;
export {};
