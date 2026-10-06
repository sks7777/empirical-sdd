/** Host MCP configuration files that agents rewrite and teams often commit. */
export declare const HOST_CONFIG_FILES: readonly [".codex/config.toml", ".mcp.json", ".cursor/mcp.json", ".gemini/settings.json"];
/**
 * A credential-shaped value in a tracked host config. It carries only where the
 * value is, never the value, a prefix of it, or its length (SDD-168).
 */
export interface HostConfigCredentialFinding {
    path: string;
    keyPaths: string[];
}
/**
 * Lists the tracked host MCP configs that hold credential-shaped values.
 * Read-only: untracked, ignored, oversized, symbolic-link or unreadable files
 * are skipped, and a failure in one file never hides findings in another.
 */
export declare function scanHostConfigCredentials(root: string): Promise<HostConfigCredentialFinding[]>;
/** Exported for tests: the key paths of credential-shaped values in one file. */
export declare function credentialKeyPaths(path: string, contents: string): string[];
