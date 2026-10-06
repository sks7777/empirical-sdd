import { type IsolationConfig, type ProjectPolicy, type ProjectConfig, type WorkflowState } from "./types.js";
/** A lock whose mtime is older than this has no live heartbeat behind it. */
export declare const LOCK_STALE_AFTER_MS = 30000;
export declare class ProjectStore {
    readonly selection: "discover" | "selected";
    private readonly afterCommit?;
    readonly root: string;
    readonly feature: string | null;
    constructor(root: string, feature?: string | null, selection?: "discover" | "selected", afterCommit?: ((state: WorkflowState) => Promise<void>) | undefined);
    get directory(): string;
    get configPath(): string;
    get policyPath(): string;
    get stateDirectory(): string;
    get statePath(): string;
    get eventsDirectory(): string;
    get capabilitiesDirectory(): string;
    forFeature(feature: string): ProjectStore;
    capabilityDirectory(capability: string): string;
    capabilitySpecPath(capability: string): string;
    specDirectory(feature: string): string;
    specPath(feature: string): string;
    evidencePath(feature: string): string;
    deltaDirectory(feature: string): string;
    exists(): Promise<boolean>;
    ensureLayout(): Promise<void>;
    loadPolicy(): Promise<ProjectPolicy>;
    /**
     * `verification.evidence` is retired: `config.json` `evidence` is the only
     * evidence setting. It is never added to a policy file, and a copy an older
     * release wrote is kept exactly as stored, because the policy digest bound
     * into existing receipts, approvals and promotion proofs includes it.
     */
    writePolicy(policy: ProjectPolicy): Promise<void>;
    loadConfig(): Promise<ProjectConfig>;
    loadState(recover?: boolean): Promise<WorkflowState>;
    writeConfig(config: ProjectConfig): Promise<void>;
    writeInitial(config: ProjectConfig): Promise<void>;
    writeInitialFeature(state: WorkflowState, actor?: string, summary?: string): Promise<void>;
    configure(update: Partial<ProjectConfig>, options?: {
        clearDefaultMode?: boolean;
    }): Promise<ProjectConfig>;
    activeFeature(recover?: boolean, selection?: "discover" | "selected"): Promise<string | null>;
    private discoverActiveFeature;
    private schemaValidationFeatures;
    listFeatureIds(): Promise<string[]>;
    transition(expectedRevision: number, actor: string, summary: string, mutate: (state: WorkflowState) => WorkflowState): Promise<WorkflowState>;
    transaction<T>(prepare: (current: WorkflowState) => Promise<{
        actor: string;
        summary: string;
        state: WorkflowState;
        value: T;
        decisionBy?: string;
        validate?: () => Promise<void>;
        effect?: () => Promise<() => Promise<void>>;
    }>): Promise<{
        state: WorkflowState;
        value: T;
    }>;
    compactTerminalJournal(actor?: string): Promise<void>;
    migrateSchema(options?: {
        checkoutOnly?: boolean;
        feature?: string;
    }): Promise<Record<string, unknown>>;
    writeSpec(feature: string, contents: string): Promise<void>;
    readSpec(feature: string): Promise<string>;
    writeEvidence(feature: string, evidence: unknown): Promise<void>;
    readEvidence<T>(feature: string): Promise<T[]>;
    listCapabilityNames(): Promise<string[]>;
    readCapability(capability: string): Promise<string | null>;
    writeCapability(capability: string, contents: string): Promise<void>;
    removeCapability(capability: string): Promise<void>;
    withResourceLock<T>(resource: "specs" | "capabilities" | "policy" | "tracker-record", operation: () => Promise<T>): Promise<T>;
    assertCurrentSchemaReadOnly(options?: {
        checkoutOnly?: boolean;
        feature?: string;
    }): Promise<void>;
    private eventPath;
    private latestJournalState;
    private commitInitialState;
    private withLock;
    private requireFeature;
    private assertCapabilityPathSafe;
    assertFeaturePathSafe(feature: string, additional?: string[]): Promise<void>;
    private assertProjectPathSafe;
    private ensureProjectMetadata;
    private ensureCurrentConfigSchema;
}
export declare function withOwnedFileLock<T>(lockPath: string, operation: () => Promise<T>): Promise<T>;
export declare function isRetryableLockOpenError(error: unknown, platform?: NodeJS.Platform): boolean;
/**
 * Whether a lock is abandoned by the same rule lock recovery uses: its lease
 * expired AND its owning process is gone. A sleeping laptop's live owner keeps it.
 */
export declare function lockIsAbandoned(path: string): Promise<boolean>;
/**
 * Remove an abandoned lock under the recovery lock, re-checking its identity so
 * a lock another process took over in the meantime is never removed.
 */
export declare function removeAbandonedLock(path: string): Promise<boolean>;
export declare function discoverProject(start: string): Promise<ProjectStore>;
export declare function writeJsonAtomic(path: string, value: unknown): Promise<void>;
export declare function writeTextAtomic(requestedPath: string, contents: string): Promise<void>;
export declare function isFile(path: string): Promise<boolean>;
export declare function isSymbolicLink(path: string): Promise<boolean>;
export declare function readJson<T>(path: string, code?: string): Promise<T>;
export declare function assertFeatureId(feature: string): void;
export declare function assertCapabilityId(capability: string): void;
/** The retired `verification.evidence` exactly as a policy file stores it, if it does. */
export declare function storedPolicyEvidence(stored: unknown): unknown;
/** Local file settings merge field-wise and only when an update supplies them. */
export declare function mergeIsolation(current: IsolationConfig, update: Partial<IsolationConfig> | undefined): IsolationConfig;
