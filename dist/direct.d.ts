import type { DefaultMode, DirectEntry, DirectPreferences, DirectTrackMarker } from "./types.js";
export declare const DIRECT_TRACKED_FILE = "direct-tracked";
export declare const DIRECT_PREFERENCES_FILE = "preferences.json";
export declare const DIRECT_MAX_COMMITS = 50;
export declare const DIRECT_MAX_PATHS = 200;
export declare const DIRECT_MAX_REQUEST = 4000;
export interface DirectWorkingPath {
    path: string;
    digest: string;
}
/** Portable repository-relative paths outside `.empirical/`; anything else is never listed. */
export declare function isDirectPath(path: string): boolean;
export declare function headCommit(root: string): string;
export declare function isAncestor(root: string, commit: string): boolean;
/**
 * Commits after the tracked commit when it is still an ancestor of HEAD, else
 * commits on no remote-tracking ref. Newest commits win the bound; entries are
 * returned oldest first, and commits touching only `.empirical/` are dropped.
 */
export declare function commitsInRange(root: string, markerCommit: string | null): {
    entries: DirectEntry[];
    omitted: number;
};
/** Uncommitted and untracked paths with content digests; deleted paths use digest `deleted`. */
export declare function workingPaths(root: string): Promise<DirectWorkingPath[]>;
/** Paths changed between a pause base commit and the working tree, excluding `.empirical/`. */
export declare function changedSince(root: string, baseCommit: string): string[];
/** `a, b, +N more`, bounded by count and characters. */
export declare function boundedPaths(paths: readonly string[], maxCharacters: number, maxPaths?: number): string;
/** The track request lists every rebuilt entry within the iterate request bound. */
export declare function directTrackRequest(entries: readonly DirectEntry[], omittedCommits: number): string;
/** A missing or malformed marker is treated as absent. */
export declare function readDirectMarker(root: string): Promise<DirectTrackMarker | null>;
export declare function writeDirectMarker(root: string, marker: DirectTrackMarker): Promise<void>;
/** An unreadable or invalid personal file is ignored with a warning, never an error. */
export declare function readDirectPreferences(root: string): Promise<{
    preferences: DirectPreferences;
    warnings: string[];
}>;
/** Writes or clears the personal default; never touches `.empirical/`. */
export declare function writeDirectPreferences(root: string, defaultMode: DefaultMode | null): Promise<DirectPreferences>;
/** `Direct work: <n> files: <bounded paths>` within the iterate request bound. */
export declare function directWorkSummary(paths: readonly string[], note?: string): string;
