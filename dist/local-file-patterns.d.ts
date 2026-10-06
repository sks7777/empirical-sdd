import type { LocalFilesConfig } from "./types.js";
export declare const LOCAL_FILES_DEFAULTS: Readonly<{
    discover: boolean;
    include: readonly string[];
    exclude: readonly string[];
}>;
export declare const LOCAL_FILE_PATTERN_LIMIT = 20;
export declare const LOCAL_FILE_PATTERN_MAX_LENGTH = 256;
/** Validates only supplied fields and returns them in canonical order; defaults stay implicit. */
export declare function normalizeLocalFilesConfig(value: unknown): LocalFilesConfig;
export declare function effectiveLocalFiles(value: LocalFilesConfig | undefined): Required<LocalFilesConfig>;
/**
 * Portable repository-relative filters: `/`, `*` within a segment, `?` and
 * whole-segment `**`. Patterns never name paths themselves.
 */
export declare function validateLocalFilePattern(entry: unknown, kind: "include" | "exclude"): string;
/** One-line summary shared by configuration and setup text: `on · include … · exclude … · explicit copies N`. */
export declare function describeLocalFileProvisioning(copyFiles: string[] | undefined, localFiles: LocalFilesConfig | undefined): string;
/** Any node_modules, .git or .empirical segment is excluded regardless of include. */
export declare function hasAlwaysExcludedSegment(path: string): boolean;
export declare function matchesLocalFileInclude(pattern: string, path: string): boolean;
export declare function matchesLocalFileExclude(pattern: string, path: string): boolean;
/** Filters one portable path through always-excluded segments, include and exclude. */
export declare function selectsLocalFile(config: Required<LocalFilesConfig>, path: string): boolean;
