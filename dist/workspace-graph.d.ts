/**
 * Workspace package graph for `scope: "workspace"` commands. Everything here is
 * pure over a list of repository paths and a manifest reader, deterministic,
 * bounded, and fails closed: any ambiguity yields an unresolved reason instead
 * of a narrower scope.
 */
/** Stable reason code recorded when a workspace scope cannot be derived. */
export declare const SCOPE_WORKSPACE_UNRESOLVED = "SCOPE_WORKSPACE_UNRESOLVED";
export declare const MAX_WORKSPACE_PACKAGES = 2000;
export declare const MAX_WORKSPACE_DEPTH = 64;
export type WorkspaceScopeResult = {
    ok: true;
    target: string;
    scope: string[];
} | {
    ok: false;
    reason: string;
};
export interface WorkspaceGraphSource {
    /** Repository-relative, `/`-separated candidate file paths. */
    paths: readonly string[];
    /** Reads a repository-relative file as text, or null when unreadable. */
    read: (path: string) => Promise<string | null>;
}
/** Minimal `packages:` list reader for pnpm-workspace.yaml. */
export declare function parsePnpmWorkspacePackages(text: string): string[];
type WorkspaceDeclaration = "pnpm" | "package-json" | "any";
interface WorkspaceTarget {
    declaration: WorkspaceDeclaration;
    /** Exact package name or repository-relative directory; null selects the cwd package. */
    selector: {
        name: string;
    } | {
        directory: string;
    } | null;
}
/** Which package a command targets according to its workspace tool and filters. */
export declare function workspaceTarget(argv: readonly string[], cwd: string): WorkspaceTarget;
/**
 * The derived scope for a command: its target package directory plus every
 * workspace package reachable through dependency fields, sorted.
 */
export declare function deriveWorkspaceScope(source: WorkspaceGraphSource, argv: readonly string[], cwdInput: string): Promise<WorkspaceScopeResult>;
export {};
