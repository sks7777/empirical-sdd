import { type JsonValue } from "./protocol.js";
export interface JournalEvent<TState extends JsonValue = JsonValue> {
    schemaVersion: 1;
    sequence: number;
    previousDigest: string;
    actor: string;
    type: "transition" | "compaction-boundary" | "migration";
    summary: string;
    createdAt: string;
    stateBeforeDigest: string;
    stateAfterDigest: string;
    state: TState;
    digest: string;
}
export interface JournalSnapshot<TState extends JsonValue = JsonValue> {
    schemaVersion: 1;
    feature: string;
    lastSequence: number;
    lastEventDigest: string;
    stateDigest: string;
    state: TState;
    compactedAt: string;
    digest: string;
}
export interface JournalReadResult<TState extends JsonValue = JsonValue> {
    snapshot: JournalSnapshot<TState> | null;
    events: JournalEvent<TState>[];
    state: TState | null;
    lastSequence: number;
    lastEventDigest: string;
}
export declare function journalGenesisDigest(feature: string): string;
export declare function createJournalEvent<TState extends JsonValue>(input: {
    sequence: number;
    previousDigest: string;
    actor: string;
    type?: JournalEvent["type"];
    summary: string;
    createdAt: string;
    stateBefore: TState | null;
    stateAfter: TState;
}): JournalEvent<TState>;
export declare function verifyJournalEvent<TState extends JsonValue>(value: JournalEvent<TState>, expected: {
    sequence: number;
    previousDigest: string;
    stateBefore: TState | null;
}): void;
export declare function readJournal<TState extends JsonValue>(directory: string, feature?: string): Promise<JournalReadResult<TState>>;
export declare function appendJournalEvent<TState extends JsonValue>(input: {
    directory: string;
    feature: string;
    actor: string;
    summary: string;
    state: TState;
    type?: JournalEvent["type"];
    now?: () => Date;
}): Promise<JournalEvent<TState>>;
export type CompactionFaultPoint = "after-prepare" | "after-snapshot" | "after-boundary";
export declare function recoverCompaction<TState extends JsonValue>(directory: string): Promise<JournalSnapshot<TState> | null>;
export declare function compactJournal<TState extends JsonValue>(input: {
    directory: string;
    feature: string;
    actor?: string;
    now?: () => Date;
    faultAt?: CompactionFaultPoint;
}): Promise<JournalSnapshot<TState>>;
