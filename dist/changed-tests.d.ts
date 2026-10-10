export declare const TEST_FILE: RegExp;
/** Paths changed on this branch since `base`, plus uncommitted and untracked work. */
export declare function changedPaths(root: string, base: string | null): string[];
/**
 * Existing test files that correspond to the changed paths: changed test files
 * themselves, and tests whose name stem matches a changed source file.
 */
export interface AffectedTest {
    path: string;
    reasons: string[];
}
/** Conservative static relative-import graph for JS/TS; other languages retain name mapping. */
export declare function affectedTests(root: string, changed: readonly string[]): AffectedTest[];
export declare function selectChangedTests(root: string, changed: readonly string[]): string[];
/**
 * Test paths listed under an `## Affected tests` heading of a plan, in order.
 * Each list item contributes its first test-file path, backticked or bare;
 * globs and prose-only items are ignored.
 */
export declare function declaredTests(plan: string): string[];
export interface TestSelection {
    method: "plan-declared" | "relative-imports-and-name-mapping";
    files: AffectedTest[];
}
/**
 * A plan that declares its affected tests is the selection: those tests plus
 * any changed test files, with no import-graph fan-out. Declared files that no
 * longer exist are dropped; when none remain, the import graph decides.
 */
export declare function selectTests(root: string, changed: readonly string[], declared?: readonly string[]): TestSelection;
/**
 * The argv to execute for a configured command. Commands that opt into
 * `testFiles: "changed"` receive only matching test paths and never fall back
 * to their bare argv, which would usually run the whole suite.
 */
export declare function resolveCommandArgv(root: string, command: {
    id: string;
    argv: readonly string[];
    cwd: string;
    testFiles?: "changed" | undefined;
}, base: string | null, selectedTests?: readonly string[]): string[];
/**
 * The argv for an explicit rerun of named test files, such as a failed job's
 * failing files. Only `testFiles: "changed"` commands accept file arguments,
 * and every file must be a tracked, existing test file of this repository.
 */
export declare function resolveExplicitTestArgv(root: string, command: {
    id: string;
    argv: readonly string[];
    cwd: string;
    testFiles?: "changed" | undefined;
}, files: readonly unknown[], options?: {
    includeUntracked?: boolean;
    preserveOrder?: boolean;
}): {
    argv: string[];
    files: string[];
};
