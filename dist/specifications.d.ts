import { type ProjectStore } from "./storage.js";
import type { ArchiveReport, CapabilityDelta, CapabilitySummary, DeltaValidationReport } from "./types.js";
export interface CapabilityBaseSnapshot {
    capability: string;
    digest: string;
    requirements: Record<string, string | null>;
}
export interface CapabilityReplayResult {
    capability: string;
    next: string;
    baseDigest: string;
    resultDigest: string;
    issues: string[];
}
export interface CapabilityArchivePlan {
    report: Omit<ArchiveReport, "feature" | "converged">;
    commit: () => Promise<() => Promise<void>>;
}
export declare function capabilityMarkdownDigest(markdown: string | null): string;
export declare function loadCapabilityDeltas(store: ProjectStore, feature: string): Promise<CapabilityDelta[]>;
export declare function parseCapabilityDelta(capability: string, markdown: string, source?: string): CapabilityDelta;
export declare function captureCapabilityBase(capability: string, markdown: string | null, deltas: readonly CapabilityDelta[]): CapabilityBaseSnapshot;
export declare function replayCapabilityDeltas(capability: string, currentMarkdown: string | null, deltas: readonly CapabilityDelta[], base: CapabilityBaseSnapshot): CapabilityReplayResult;
export declare function validateFeatureDeltas(store: ProjectStore, feature: string): Promise<DeltaValidationReport>;
export declare function capabilityDeltaDigest(store: ProjectStore, feature: string): Promise<string | null>;
export declare function planCapabilityArchive(store: ProjectStore, feature: string): Promise<CapabilityArchivePlan>;
/**
 * Project a feature's approved deltas into its checkout's capability specs,
 * relative to the bases captured at Specify. Safe to repeat: a requirement
 * already in its final form is kept, one still at its base is applied, and
 * anything else is a conflict. Returns the capabilities whose file changed,
 * or with `dryRun` would change.
 */
export declare function projectCapabilityDeltas(store: ProjectStore, feature: string, bases: Readonly<Record<string, CapabilityBaseSnapshot>>, options?: {
    dryRun?: boolean;
}): Promise<string[]>;
export declare function listCapabilities(store: ProjectStore): Promise<CapabilitySummary[]>;
export declare function normalizedName(name: string): string;
/** The approved delta digest; retained snapshots are trusted only while they reproduce it. */
export declare function digestCapabilityDeltas(deltas: readonly CapabilityDelta[]): string;
