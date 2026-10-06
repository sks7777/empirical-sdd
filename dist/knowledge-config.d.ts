import type { ContextConfig } from "./types.js";
/**
 * History and archive paths describe what the project was, not what it is, so
 * no context page depends on them. `ai/specs` is the legacy Empirical layout
 * (`legacySource: "ai"`); the rest are conventional archive locations.
 */
export declare const CONTEXT_EXCLUDE_DEFAULTS: readonly string[];
export declare const CONTEXT_EXCLUDE_LIMIT = 50;
/** Validates only supplied fields and returns them in canonical order; defaults stay implicit. */
export declare function normalizeContextConfig(value: unknown): ContextConfig;
/** Defaults plus configured patterns; `!pattern` drops that exact default. */
export declare function effectiveContextExcludes(value: ContextConfig | undefined): string[];
export declare function isContextExcluded(excludes: readonly string[], path: string): boolean;
