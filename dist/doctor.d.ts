import { type ConfigurationReport } from "./configuration-reference.js";
import { type DoctorFix } from "./doctor-fixes.js";
export type { DoctorFix, DoctorFixAction, DoctorFixKind } from "./doctor-fixes.js";
/** `info` is advisory: it never changes Doctor's status, but may carry a safe fix. */
export type DoctorSeverity = "ok" | "info" | "warning" | "error";
export interface DoctorFinding {
    severity: DoctorSeverity;
    code: string;
    scope: string;
    message: string;
    remediation: string | null;
    /** Structured resolution for warnings and errors; null for ok findings. */
    fix: DoctorFix | null;
}
export interface DoctorReport {
    schemaVersion: 1;
    root: string;
    status: "healthy" | "warnings" | "errors";
    readonly: true;
    findings: DoctorFinding[];
    configuration?: ConfigurationReport;
}
export interface DoctorRepositoryOptions {
    invocationPath?: string;
    /** Injectable user home for deterministic collision inspection; null disables it. */
    homeRoot?: string | null;
    /** Injectable host platform for deterministic Windows path-limit inspection. */
    platform?: string;
}
export declare function findNamedFiles(root: string, pattern: RegExp): Promise<string[]>;
export declare function doctorRepository(rootInput: string, options?: DoctorRepositoryOptions): Promise<DoctorReport>;
