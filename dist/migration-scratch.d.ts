export declare const MIGRATION_MARKER_NAME = ".empirical.schema5-migration.json";
export declare const MIGRATION_SCRATCH_PREFIX = ".empirical.schema5-";
export declare const MIGRATION_STAGE_PREFIX = ".empirical.schema5-stage-";
export declare const MIGRATION_BACKUP_PREFIX = ".empirical.schema4-backup-";
export type MigrationScratchKind = "marker" | "stage" | "backup";
export declare function migrationScratchKind(name: string): MigrationScratchKind | null;
export declare function isMigrationScratchPath(path: string): boolean;
