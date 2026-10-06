/**
 * A declared command scope: repository-relative path prefixes or simple globs
 * (`*` within one segment, `**` across segments). Normalization is lexical and
 * platform-independent so equal declarations always digest identically.
 */
export declare function normalizeCommandScope(entries: readonly string[], commandId: string, label?: string): string[];
/**
 * Whether a normalized repository path lies under any normalized scope entry.
 * Matching ignores case, which only binds more files on case-insensitive hosts.
 */
export declare function scopeMatcher(scope: readonly string[]): (path: string) => boolean;
