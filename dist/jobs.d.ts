import type { VerificationProfile } from "./types.js";
/** One heavy verification job per repository runs at a time; later starts queue. */
export declare const MAX_RUNNING_JOBS = 1;
/** Failing test files kept per job; a longer list is truncated, never guessed. */
export declare const MAX_FAILING_TEST_FILES = 50;
/** Most recent jobs a roadmap lists for the active feature. */
export declare const ROADMAP_JOB_LIMIT = 5;
export type QaJobStatus = "queued" | "running" | "passed" | "failed" | "cancelled" | "stale" | "error";
export interface QaJobRecord {
    schemaVersion: 1;
    id: string;
    feature: string;
    /** Older unbound queued jobs must be restarted instead of guessing their origin. */
    sourceRoot?: string;
    policyDigest?: string;
    matrixDigest?: string;
    commandDigest?: string;
    workflowRevision: number;
    commit: string;
    treeDigest: string;
    checkId: string;
    commandId: string;
    argv: string[];
    cwd: string;
    criteria: string[];
    summary: string;
    verificationProfile?: VerificationProfile;
    retryOf?: string;
    /** Explicit test files appended to a `testFiles: "changed"` command, such as a failed job's failing files. */
    testFiles?: string[];
    /** The agent confirmed the user's explicit yes in chat before starting this job. */
    userApproved?: boolean;
    /** Repository-relative tracked test files named as failing in the command output. */
    failingTestFiles?: string[];
    status: QaJobStatus;
    createdAt: string;
    startedAt: string | null;
    finishedAt: string | null;
    exitCode: number | null;
    receiptId: string | null;
    estimateMs: number | null;
    snapshotPath: string | null;
    workerPid: number | null;
    error: {
        code: string;
        message: string;
    } | null;
}
export interface QaJobStartResult {
    jobId: string;
    status: "queued" | "running";
    estimateMs: number | null;
}
export interface QaJobView {
    jobId: string;
    feature: string;
    checkId: string;
    commandId: string;
    commit: string;
    workflowRevision: number;
    status: QaJobStatus;
    createdAt: string;
    startedAt: string | null;
    finishedAt: string | null;
    elapsedMs: number | null;
    estimateMs: number | null;
    exitCode: number | null;
    receiptId: string | null;
    error: {
        code: string;
        message: string;
    } | null;
    testFiles: string[];
    userApproved: boolean;
    failingTestFiles: string[];
    /** The feature revision or source tree moved; a receipt stays immutable but cannot satisfy the new revision's gates. */
    stale: boolean;
    staleReason: string | null;
    logTail: string;
}
export interface QaStatusResult {
    kind: "qa_jobs";
    jobs: QaJobView[];
}
export declare function jobsDirectory(root: string): string;
export declare function headCommit(root: string): string;
export declare function newJobId(now?: Date): string;
export declare function assertJobId(value: unknown): string;
export declare function jobLogPath(directory: string, id: string): string;
export declare function writeJob(directory: string, job: QaJobRecord): Promise<QaJobRecord>;
export declare function recordJobCommandPid(directory: string, id: string, pid: number): void;
/** Give the worker time to abort its detached command and clean its snapshot. */
export declare function cancelJobWorker(directory: string, job: QaJobRecord): Promise<void>;
export declare function readJob(directory: string, id: string): Promise<QaJobRecord>;
export declare function listJobs(directory: string): Promise<QaJobRecord[]>;
export declare function writeJobLog(directory: string, id: string, stdout: string, stderr: string): Promise<void>;
/**
 * Keep bounded output while a command runs and rewrite the redacted log at most
 * every LIVE_LOG_INTERVAL_MS, so qa-status can show progress before completion.
 */
export declare function liveJobLog(directory: string, id: string): {
    onOutput: (stream: "stdout" | "stderr", chunk: Uint8Array) => void;
    flush: () => Promise<void>;
};
/**
 * Failing test files named by common runners: bun test `(fail)` lines under a
 * file header, node --test `not ok` entries and their `location`, and
 * vitest/jest `FAIL path` lines. Paths resolve from the command cwd inside the
 * execution root and are kept only when they are tracked test files.
 */
export declare function extractFailingTestFiles(output: string, root: string, cwd: string, tracked: ReadonlySet<string>): string[];
export declare function trackedFiles(root: string): Set<string>;
export interface JobStalenessInput {
    policyDigest: string;
    activeFeature: string | null;
    revision: number;
    commit: string;
    treeDigest: string | null;
    /** Strict binding also requires the job's exact revision and commit. */
    strict?: boolean;
}
/** Why a job no longer describes the current revision and tree; empty when current. */
export declare function jobStaleReasons(record: QaJobRecord, current: JobStalenessInput): string[];
/** A running record whose worker is gone reports error; everything else keeps its recorded status. */
export declare function effectiveJobStatus(record: QaJobRecord): QaJobStatus;
export declare function readJobLogTail(directory: string, id: string): Promise<string>;
export declare function processAlive(pid: number | null): boolean;
/** A lock file owned by a live worker pid; a dead owner's lock is reclaimed. */
export declare function acquireRunnerLock(directory: string, pid?: number): Promise<boolean>;
export declare function releaseRunnerLock(directory: string, pid?: number): Promise<void>;
export declare function runnerLockOwner(directory: string): Promise<number | null>;
/** Launch a detached worker that outlives the calling tool call. */
export declare function launchWorker(root: string): number | null;
/** Terminate a worker and its command tree without touching the host process. */
export declare function terminateProcessTree(pid: number): void;
export declare function snapshotPathFor(id: string): string;
/** Create a detached worktree of the exact commit and provide dependencies. */
export declare function createSnapshot(root: string, id: string, commit: string): Promise<string>;
/** Remove only the snapshot: unlink the dependency link first so source dependencies are never traversed. */
export declare function removeSnapshot(root: string, path: string): Promise<void>;
