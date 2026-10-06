import { type SpawnSyncOptions, type SpawnSyncReturns } from "node:child_process";
export interface LifecycleProcessResult {
    status: number | null;
    error?: Error;
    stdout?: string;
}
export interface LifecycleRunOptions {
    capture?: boolean;
}
export type LifecycleRunner = (command: string, args: string[], options?: LifecycleRunOptions) => LifecycleProcessResult;
export interface UpdateReport {
    package: "updated";
    integrations: "refreshed";
}
export interface PackageUninstallReport {
    package: "removed";
}
export declare function updateEmpirical(runner?: LifecycleRunner, platform?: NodeJS.Platform, nodeExecutable?: string): UpdateReport;
export declare function resolveGlobalEmpirical(prefix: string, platform: NodeJS.Platform): string;
/**
 * How update launches the npm-installed CLI. Windows runs the package entry
 * with Node because its empirical.cmd wrapper cannot be spawned without a shell.
 */
export declare function resolveGlobalEmpiricalLauncher(prefix: string, platform: NodeJS.Platform, nodeExecutable: string): {
    command: string;
    args: string[];
};
export declare function uninstallEmpirical(runner?: LifecycleRunner): PackageUninstallReport;
export declare function isUninstallConfirmed(answer: string): boolean;
/**
 * The process to spawn for a lifecycle command. Node refuses to spawn .cmd and
 * .bat files without a shell (CVE-2024-27980), and shell: true joins unquoted
 * paths, so Windows wrappers run through cmd.exe with every token quoted.
 */
export declare function lifecycleSpawnTarget(command: string, args: readonly string[], platform?: NodeJS.Platform, comspec?: string | undefined): {
    file: string;
    args: string[];
    windowsVerbatimArguments: boolean;
};
/**
 * The first PATH entry containing a bare Windows wrapper name. A quoted bare
 * name makes cmd.exe resolve the wrapper's %~dp0 against the working directory,
 * which breaks npm.cmd, so wrappers are launched by absolute path.
 */
export declare function resolveWindowsWrapper(command: string, pathValue?: string | undefined, exists?: (path: string) => boolean): string;
/** spawnSync for lifecycle commands, including Windows .cmd wrappers. */
export declare function spawnLifecycle(command: string, args: string[], options?: SpawnSyncOptions): SpawnSyncReturns<string | Buffer>;
