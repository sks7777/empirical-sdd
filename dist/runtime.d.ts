import type { QaExecutionOptions, QaExecutionPhase, QaExecutionProgress } from "./types.js";
/** Credential-shaped values, shared by output redaction and the host config check. */
export declare const CREDENTIAL_VALUE_PATTERN: string;
export interface RuntimeCommand {
    argv: string[];
    cwd: string;
    timeoutMs: number;
    maxOutputBytes: number;
    environment?: Record<string, string>;
    /** Trusted in-memory secrets translated to child environment variables and never recorded. */
    secrets?: {
        githubToken?: string;
    };
}
export interface RuntimeResult {
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
export interface CapturedRuntimeResult {
    result: RuntimeResult;
    stdout: string;
    stderr: string;
}
export interface ProcessInvocation {
    signal?: AbortSignal;
    onSpawn?: (pid: number) => void;
    argv0?: string;
    executable: string;
    args: string[];
    cwd: string;
    env: NodeJS.ProcessEnv;
    timeoutMs: number;
    maxOutputBytes: number;
    onOutput?: (stream: "stdout" | "stderr", chunk: Buffer) => void;
}
export interface ProcessOutcome {
    exitCode: number | null;
    signal: string | null;
    timedOut: boolean;
    stdout: Uint8Array;
    stderr: Uint8Array;
    stdoutTruncated: boolean;
    stderrTruncated: boolean;
}
export type ProcessAdapter = (invocation: ProcessInvocation) => Promise<ProcessOutcome>;
export declare const nodeProcessAdapter: ProcessAdapter;
export declare function redactOutput(value: string): string;
export declare function executeCommand(root: string, command: RuntimeCommand, adapter?: ProcessAdapter, now?: () => Date): Promise<RuntimeResult>;
export declare function executeCommandCaptured(root: string, command: RuntimeCommand, adapter?: ProcessAdapter, now?: () => Date): Promise<CapturedRuntimeResult>;
/** A command id safe to report; anything unexpected becomes a neutral label. */
export declare function verificationLabel(commandId: string): string;
/** One bounded heartbeat: the same facts stderr carries, for an optional host sink. */
/**
 * Where the feature stands in its phase order while a command runs. The caller
 * derives it from workflow state, so a heartbeat can never claim a phase the
 * roadmap disagrees with. An index below 1 is not one of the counted phases.
 */
export interface VerificationProgressPhase {
    phase: string;
    index: number;
    total: number;
}
export interface VerificationProgressEvent {
    elapsedMs: number;
    status: string;
    label: string;
    /**
     * Null until the command exits, then whether it exited cleanly (exit 0, no
     * timeout or signal). Not a receipt verdict: the receipt still decides.
     */
    passed: boolean | null;
    phase: VerificationProgressPhase | null;
}
export type QaExecutionReporter = (stage: QaExecutionPhase, details?: Partial<Pick<QaExecutionProgress, "timeoutMs" | "commandEstimateMs" | "commandOutcome" | "commandExitCode" | "commandSignal" | "phase" | "testFiles">>) => void;
export declare function formatQaExecutionProgress(event: QaExecutionProgress): string;
/** Include provenance work and receipt recording in diagnostic progress. */
export declare function withQaExecutionProgress<T>(commandId: string, operation: (report: QaExecutionReporter) => Promise<T>, onProgress?: QaExecutionOptions["onProgress"], write?: (message: string) => void, heartbeatMs?: number): Promise<T>;
/** Bounded metadata on stderr only; never emits argv, environment values or child output. */
export declare function withVerificationProgress<T>(phase: "qa" | "integration" | "benchmark", commandId: string, operation: () => Promise<T>, write?: (message: string) => void, heartbeatMs?: number, progress?: (event: VerificationProgressEvent) => void, workflowPhase?: VerificationProgressPhase | null): Promise<T>;
/** Fingerprint the resolved configured executable without persisting host paths.
 * Unknown resolution is deliberately not reusable. Source and policy identities
 * separately bind scripts/arguments; this is not a cache of subprocess results.
 */
export declare function resolveCommandExecutable(root: string, command: Pick<RuntimeCommand, "argv" | "cwd">, readExecutable?: (path: string) => AsyncIterable<Uint8Array>): Promise<{
    path: string;
    digest: string;
} | null>;
export declare function commandExecutableDigest(root: string, command: Pick<RuntimeCommand, "argv" | "cwd">, readExecutable?: (path: string) => AsyncIterable<Uint8Array>): Promise<string | null>;
/** Bind reuse to local runtime inputs, including Git-ignored dependencies and
 * outputs. Only opaque digests leave this function; environment values and
 * filesystem contents never enter receipts. Git/Empirical journal metadata is
 * excluded because recording the receipt itself mutates it. External services
 * and files outside the repository are outside this controlled snapshot.
 */
export declare function verificationRuntimeDigest(root: string, limits?: {
    maxFiles?: number;
    maxBytes?: number;
    timeoutMs?: number;
}): Promise<string | null>;
