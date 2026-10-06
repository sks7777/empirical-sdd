import type { RoadmapSummary } from "./types.js";
export interface OverviewIssue {
    root: string;
    feature?: string;
    code: string;
    message: string;
}
export interface WorktreeOverview {
    root: string;
    branch: string | null;
    head: string | null;
    selectedFeature: string | null;
    selection: "valid" | "unavailable";
    locked: boolean;
}
export interface SpecOverviewCopy {
    root: string;
    profile: string | null;
    phase: string | null;
    status: string | null;
    revision: number | null;
    completionLevel: string;
    verification: "verified" | "skipped" | "pending" | "unknown";
    nextAction: string;
    /** Read-only roadmap summary; null without an injected summarizer or when it fails. */
    roadmap: RoadmapSummary | null;
    /** When the copy is paused for direct work, the pause time; otherwise null. */
    paused: string | null;
    /** Unfinished, and its state is identical on the target branch: merged there, never closed. */
    merged: boolean;
    valid: boolean;
}
/**
 * Injected so this inventory stays independent from the workflow engine. It
 * must open the feature read-only and mutate nothing.
 */
export type OverviewSummarizer = (root: string, feature: string) => Promise<RoadmapSummary | null>;
export interface RepositoryOverviewOptions {
    summarize?: OverviewSummarizer;
}
export interface SpecOverview {
    feature: string;
    owners: string[];
    ownership: "selected" | "unclaimed" | "conflict" | "unknown";
    copies: SpecOverviewCopy[];
}
export interface RepositoryOverview {
    schemaVersion: 1;
    root: string;
    worktrees: WorktreeOverview[];
    specs: SpecOverview[];
    issues: OverviewIssue[];
    truncated: boolean;
}
/** A derived inventory only: never selects work, repairs projections, or writes an index. */
export declare function repositoryOverview(rootInput: string, options?: RepositoryOverviewOptions): Promise<RepositoryOverview>;
