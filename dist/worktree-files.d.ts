import type { IsolationConfig, LocalFileRefusal, WorktreeProposal } from "./types.js";
export declare const LOCAL_FILE_CANDIDATE_LIMIT = 200;
export declare const LOCAL_FILE_SIZE_LIMIT = 1048576;
/** Literal portable path rules shared by explicit copies and discovered candidates. */
export declare function isSafeLocalFilePath(path: unknown): path is string;
/** Portable literal paths only; never patterns or platform-dependent aliases. */
export declare function validateCopyFiles(value: unknown): string[];
/** Approved copy lists (explicit then discovered) use the explicit rules with a larger bound. */
export declare function validateLocalFileList(value: unknown, max?: number): string[];
export declare function compareOrdinal(left: string, right: string): number;
/** Explicit paths win; a discovered case variant of an explicit path is represented once. */
export declare function mergeLocalFileSelection(explicit: string[], candidates: string[]): {
    discovered: string[];
    duplicates: string[];
};
export type LocalFileIgnoreStatus = "ignored" | "tracked" | "not-ignored";
/**
 * Two batched spawns: ignored-and-untracked paths, then pattern matches
 * regardless of the index. Only the second set means tracked.
 */
export declare function gitIgnoreStatus(root: string, paths: string[]): Map<string, LocalFileIgnoreStatus>;
export interface LocalFileSelection {
    explicit: string[];
    discovered: string[];
    refused: LocalFileRefusal[];
}
/**
 * Candidates come only from Git's ignored-and-untracked listing. Wholly ignored
 * directories are reported without being descended, so their contents are not
 * candidates. Nothing here reads file contents.
 */
export declare function discoverLocalFiles(root: string, isolation: IsolationConfig, options: {
    enforceLimit: boolean;
}): Promise<LocalFileSelection & {
    candidates: number;
}>;
export interface LocalFileMarkers {
    /** Path-keyed marker shared by creation and prepare; created only when `create` is set. */
    marker(path: string, create: boolean): Promise<string | null>;
    /** True when a path-keyed or legacy 0.34.0 marker exists for the path. */
    interrupted(path: string): Promise<boolean>;
    /** Removes a legacy marker once its path has been copied completely. */
    clearLegacy(path: string): Promise<void>;
}
/**
 * A marker makes a process crash during a copy visible on the next retry.
 * Markers are empty files keyed by target and path identity, never contents.
 */
export declare function localFileMarkers(targetRoot: string, legacyMarker?: {
    token: string;
    paths: string[];
}): Promise<LocalFileMarkers>;
export interface LocalFileCopyPlan {
    sourceRoot: string;
    targetRoot: string;
    explicit: string[];
    discovered: string[];
    /** Creation honors markers written by 0.34.0 handoffs. */
    legacyMarker?: {
        token: string;
        paths: string[];
    };
    /** Internal test seam; never tool input. */
    hooks?: {
        afterSourceOpen?(path: string): Promise<void>;
        afterDestinationOpen?(path: string): Promise<void>;
    };
}
export interface LocalFileCopyReport {
    copied: string[];
    skippedExisting: string[];
    missingOptional: string[];
    refused: LocalFileRefusal[];
}
export declare function splitProposalLocalFiles(proposal: WorktreeProposal): {
    explicit: string[];
    discovered: string[];
};
export declare function validateWorktreeSources(proposal: WorktreeProposal): Promise<void>;
/**
 * Copies missing files as independent owner-only regular files created
 * exclusively. Explicit problems fail with a path-only error before any copy;
 * discovered problems are reported by path and reason.
 */
export declare function copyLocalFiles(plan: LocalFileCopyPlan): Promise<LocalFileCopyReport>;
/**
 * Read-only destination classification for a prepare preview: existing paths
 * and refusals the copy engine would report, and the explicit failures it would
 * raise. Creates no markers or directories.
 */
export declare function previewLocalFileCopies(plan: Pick<LocalFileCopyPlan, "sourceRoot" | "targetRoot" | "explicit" | "discovered">): Promise<{
    skippedExisting: string[];
    refused: LocalFileRefusal[];
}>;
export declare function prepareWorktreeFiles(proposal: WorktreeProposal): Promise<LocalFileCopyReport>;
