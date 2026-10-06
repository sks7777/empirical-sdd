import { type BreakGlassAuthorizationEvidence, type ReleaseCandidate, type ReleaseObservation, type ReleasePlan, type ReleasePullRequest } from "./release.js";
export interface ReleaseCommandResult {
    exitCode: number;
    stdout: string;
    stderr: string;
}
export type ReleaseCommandRunner = (root: string, argv: string[]) => Promise<ReleaseCommandResult>;
export interface RepositoryCandidateInput {
    root: string;
    repository: string;
    commit: string;
    pullRequest: number;
    expectedDate: string;
    runner?: ReleaseCommandRunner;
}
export interface PullRequestView {
    number: number;
    state: string;
    reviewDecision: string | null;
    baseRefName: string;
    baseRefOid: string;
    headRefName: string;
    headRefOid: string;
    headRepository: {
        name: string;
        nameWithOwner?: string;
    } | null;
    headRepositoryOwner: {
        login: string;
    } | null;
    isCrossRepository: boolean;
    mergeCommit: {
        oid: string;
    } | null;
    mergedAt: string | null;
    url: string;
}
export interface GitHubReconciliationResult {
    tag: "existing" | "created";
    release: "existing" | "created";
    plan: ReleasePlan;
}
export declare const defaultReleaseCommandRunner: ReleaseCommandRunner;
export declare function loadRepositoryCandidate(input: RepositoryCandidateInput): Promise<ReleaseCandidate>;
export declare function loadPullRequestAuthorization(input: {
    root: string;
    pullRequest: number;
    commit: string;
    protectedRef: boolean;
    runner?: ReleaseCommandRunner;
}): Promise<{
    fact: ReleasePullRequest;
    mergedAt: string;
}>;
export declare function loadMergedReleasePullRequest(input: {
    root: string;
    pullRequest: number;
    commit: string;
    protectedRef: boolean;
    runner?: ReleaseCommandRunner;
}): Promise<{
    fact: ReleasePullRequest;
    mergedAt: string;
    parents: string[];
}>;
export declare function loadBreakGlassAuthorizationEvidence(input: {
    root: string;
    authorization: unknown;
    candidate: ReleaseCandidate;
    pullRequest: ReleasePullRequest;
    actor: string;
    policyEnabled: string;
    environmentApproved: boolean;
    now?: string;
    runner?: ReleaseCommandRunner;
}): Promise<BreakGlassAuthorizationEvidence>;
export declare function validatePullRequestEventCandidate(input: {
    root: string;
    event: unknown;
    commit: string;
    runner?: ReleaseCommandRunner;
}): Promise<ReleasePullRequest>;
export declare function observeRemoteRelease(input: {
    root: string;
    candidate: ReleaseCandidate;
    runner?: ReleaseCommandRunner;
}): Promise<ReleaseObservation>;
export declare function reconcileGitHubRelease(input: {
    root: string;
    candidate: ReleaseCandidate;
    runner?: ReleaseCommandRunner;
}): Promise<GitHubReconciliationResult>;
export declare function assertCleanTrackedTree(root: string, runner?: ReleaseCommandRunner): Promise<void>;
export declare function assertCommitOnRemoteMain(root: string, commit: string, runner?: ReleaseCommandRunner): Promise<void>;
export declare function commitParents(root: string, commit: string, runner?: ReleaseCommandRunner): Promise<string[]>;
