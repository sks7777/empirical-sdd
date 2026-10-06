import { type LocalFileCopyReport, type LocalFileSelection } from "./worktree-files.js";
import { type ChangeType, type IsolationConfig, type Workflow, type WorktreeLocalFiles, type WorktreeProposal } from "./types.js";
export interface WorktreeOverrides {
    iterative?: boolean;
    changeType?: ChangeType;
    feature?: string;
    branch?: string;
    path?: string;
    base?: string;
}
export declare function inferChangeType(request: string): ChangeType;
export declare function featureSlug(request: string): string;
export declare function proposeWorktree(root: string, request: string, workflow: Workflow, activeFeature: string, config: IsolationConfig, overrides?: WorktreeOverrides, selection?: LocalFileSelection): WorktreeProposal;
/**
 * The approval identity binds the ordered copy list and its discovered subset,
 * never refusals, so it equals the earlier token when nothing is discovered.
 */
export declare function approvedLocalFilesIdentity(localFiles: WorktreeLocalFiles | undefined): {
    mode: "copy-missing";
    paths: string[];
    discovered?: string[];
} | undefined;
export declare function createGitWorktree(proposal: WorktreeProposal, options?: {
    recover?: boolean;
    beforeCreate?: () => Promise<void>;
}): Promise<LocalFileCopyReport>;
export declare function detectBase(root: string): string;
export interface WorktreeListEntry {
    path: string;
    bare: boolean;
    prunable: boolean;
}
/** Parses `git worktree list --porcelain -z`; the first entry is the main worktree. */
export declare function parseWorktreeList(output: string): WorktreeListEntry[];
/**
 * True when two paths name the same directory.
 *
 * Windows exposes one directory under two spellings: `os.tmpdir()` hands back
 * the 8.3 short form `C:\\Users\\JUANSE~1\\...` while Git reports the long form
 * `C:/Users/Juan Sebastian/...`. `resolve` normalizes separators but not short
 * names, so comparing resolved strings rejects a checkout for being itself.
 *
 * `realpath` collapses both spellings — and resolves links, which makes this a
 * stricter identity test than string comparison rather than a looser one. A path
 * that does not exist cannot be canonicalized, so it falls back to `resolve`.
 * Windows paths are case-insensitive, so they compare without case there.
 */
export declare function isSameDirectory(left: string, right: string): Promise<boolean>;
export declare function readWorktreeIntent(root: string, token: string): Promise<WorktreeProposal | null>;
export declare function writeWorktreeIntent(proposal: WorktreeProposal): Promise<void>;
