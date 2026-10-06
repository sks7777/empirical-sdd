export type MigrationFaultPoint = "after-prepare" | "after-backup" | "after-promote";
export interface MigrationReport {
    from: 4 | 5;
    to: 5;
    changed: boolean;
    recovered: boolean;
    features: number;
    sourceDigest: string;
    resultDigest: string;
    receipt: string | null;
}
export declare function recoverSchema5Migration(repositoryRoot: string): Promise<MigrationReport | null>;
export declare function migrateSchema4To5(repositoryRoot: string, options?: {
    faultAt?: MigrationFaultPoint;
    now?: () => Date;
}): Promise<MigrationReport>;
